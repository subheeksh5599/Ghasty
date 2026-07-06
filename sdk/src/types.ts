/** Ghasty SDK - Type definitions */

export interface GhastyConfig {
  chainId: 968 | 677;
  sponsorPolicy: string;
  paymasterRpc?: string;
  registryAddress?: string;
  maxGasPerTx?: bigint;
  dailyLimit?: bigint;
}

export interface TransactionRequest {
  to: string;
  value?: string;
  data?: string;
  gas?: string;
}

export interface TransactionReceipt {
  txHash: string;
  sponsored: boolean;
  gasUsed: string;
  effectiveGasPrice: string;
  blockNumber: number;
}

export interface SponsorStats {
  totalSponsored: string;
  totalTxs: number;
  dailySpent: string;
  dailyCap: string;
  gasPool: string;
  active: boolean;
}

export interface PolicyInfo {
  name: string;
  owner: string;
  dailyCap: string;
  dailySpent: string;
  gasPool: string;
  active: boolean;
}

export interface WalletAdapter {
  getAddress(): Promise<string>;
  signTransaction(tx: TransactionRequest & { gasPrice: string }): Promise<string>;
}

export const BOT_CHAIN_RPCS: Record<number, string> = {
  968: "https://rpc.bohr.life",
  677: "https://rpc.botchain.ai",
} as const;

export const DEFAULT_PAYMASTER_RPC = "https://nodereal.io/megafuel/bot-testnet";
