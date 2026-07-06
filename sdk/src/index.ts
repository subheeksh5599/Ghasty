/** Ghasty SDK - EOA Paymaster Wrapper */

import { JsonRpcProvider, ethers } from "ethers";
import { GasPassRegistry__factory } from "./abi";
import type {
  GhastyConfig,
  TransactionRequest,
  TransactionReceipt,
  WalletAdapter,
  SponsorStats,
  PolicyInfo,
} from "./types";
import { DEFAULT_PAYMASTER_RPC, BOT_CHAIN_RPCS } from "./types";

const GAS_PASS_REGISTRY_ABI = [
  "function isSponsorable(string,address,address) view returns (bool)",
  "function getMaxGasPerTx(string,address) view returns (uint256)",
  "function recordSponsorship(string,address,address,uint256,uint256)",
  "function getSponsorStats(string) view returns (tuple(uint256,uint256,uint256,uint256,uint256,bool))",
  "function registerSponsor(string,uint256)",
  "function coverContract(string,address,uint256)",
  "function fundGasPool(string) payable",
  "function gasPool(string) view returns (uint256)",
];

export class Ghasty {
  private config: GhastyConfig;
  private provider: JsonRpcProvider;
  private paymasterProvider: JsonRpcProvider;
  private registry: ethers.Contract | null = null;

  constructor(config: GhastyConfig) {
    this.config = {
      paymasterRpc: DEFAULT_PAYMASTER_RPC,
      maxGasPerTx: 300000n,
      ...config,
    };

    const rpc = BOT_CHAIN_RPCS[config.chainId];
    if (!rpc) throw new Error(`Unknown chain ID: ${config.chainId}`);

    this.provider = new JsonRpcProvider(rpc);
    this.paymasterProvider = new JsonRpcProvider(this.config.paymasterRpc!);

    if (config.registryAddress) {
      this.registry = new ethers.Contract(
        config.registryAddress,
        GAS_PASS_REGISTRY_ABI,
        this.provider,
      );
    }
  }

  /** Check if a transaction is sponsorable */
  async isSponsorable(tx: TransactionRequest, sender: string): Promise<boolean> {
    if (!this.registry) {
      // Fall back to direct paymaster query
      try {
        const result = await this.paymasterProvider.send("pm_isSponsorable", [
          {
            to: tx.to,
            from: sender,
            value: tx.value || "0x0",
            data: tx.data || "0x",
            gas: tx.gas || ethers.toBeHex(this.config.maxGasPerTx!),
          },
        ]);
        return (result as any).Sponsorable === true;
      } catch {
        return false;
      }
    }

    return this.registry.isSponsorable(this.config.sponsorPolicy, sender, tx.to);
  }

  /** Send a gasless transaction */
  async send(wallet: WalletAdapter, tx: TransactionRequest): Promise<TransactionReceipt> {
    const sender = await wallet.getAddress();

    const isSponsored = await this.isSponsorable(tx, sender);
    if (!isSponsored) throw new Error("Transaction not sponsorable under current policy");

    // Sign zero-gas transaction
    const signedTx = await wallet.signTransaction({
      ...tx,
      gasPrice: "0x0",
    });

    // Send to paymaster
    const txHash = await this.paymasterProvider.send("eth_sendRawTransaction", [signedTx]);

    // Wait for confirmation (BOT Chain: ~0.75s blocks)
    const receipt = await this.provider.waitForTransaction(txHash as string);

    return {
      txHash: receipt!.hash,
      sponsored: true,
      gasUsed: ethers.toBeHex(receipt!.gasUsed),
      effectiveGasPrice: "0x0",
      blockNumber: receipt!.blockNumber,
    };
  }

  /** Batch send multiple gasless transactions */
  async sendBatch(
    wallet: WalletAdapter,
    txs: TransactionRequest[],
  ): Promise<TransactionReceipt[]> {
    const results: TransactionReceipt[] = [];
    for (const tx of txs) {
      results.push(await this.send(wallet, tx));
    }
    return results;
  }

  /** Get sponsor stats from the registry */
  async getSponsorStats(): Promise<SponsorStats> {
    if (!this.registry) throw new Error("Registry address not configured");

    const stats = await this.registry.getSponsorStats(this.config.sponsorPolicy);
    return {
      totalSponsored: stats[0].toString(),
      totalTxs: Number(stats[1]),
      dailySpent: stats[2].toString(),
      dailyCap: stats[3].toString(),
      gasPool: stats[4].toString(),
      active: stats[5],
    };
  }

  getConfig(): GhastyConfig {
    return { ...this.config };
  }
}

/** Quick helper: create Ghasty instance from env vars */
export function createGhasty(overrides?: Partial<GhastyConfig>): Ghasty {
  return new Ghasty({
    chainId: 968,
    sponsorPolicy: "ghasty-demo",
    registryAddress: process.env.REGISTRY_ADDRESS,
    ...overrides,
  });
}
