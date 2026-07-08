"use client";

import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import Link from "next/link";
import { useState } from "react";

const ZEROSWAP = "0x9ef56cef4043ABfDBf72acB3C928BC560fCc91a0" as `0x${string}`;
const MOCK_TOKEN = "0x3C31243a186a10885D6012F54C4A3B2FBE420471" as `0x${string}`;

const MOCK_ABI = [
  { type: "function", name: "approve", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable" },
  { type: "function", name: "balanceOf", inputs: [{ name: "owner", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
] as const;

const SWAP_ABI = [
  { type: "function", name: "swap", inputs: [{ name: "tokenIn", type: "address" }, { name: "tokenOut", type: "address" }, { name: "amountIn", type: "uint256" }, { name: "minAmountOut", type: "uint256" }], outputs: [{ name: "amountOut", type: "uint256" }], stateMutability: "nonpayable" },
  { type: "function", name: "addLiquidity", inputs: [{ name: "token", type: "address" }, { name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "gaslessApprove", inputs: [{ name: "token", type: "address" }, { name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { type: "function", name: "getSwapAmount", inputs: [{ name: "tokenIn", type: "address" }, { name: "tokenOut", type: "address" }, { name: "amountIn", type: "uint256" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "liquidity", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }], stateMutability: "view" },
] as const;

export default function SwapPage() {
  const { isConnected, address } = useAccount();

  return (
    <main className="flex min-h-screen flex-col items-center px-6 pt-32 pb-24">
      <div className="w-full max-w-lg">
        <div className="mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            &larr; Back
          </Link>
        </div>

        <div className="border border-foreground/10 p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-xs uppercase tracking-[0.2em] font-bold">
                {isConnected ? "Connected" : "Not Connected"}
              </span>
              {isConnected && address && (
                <span className="text-muted-foreground text-xs font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              )}
            </div>
            {!isConnected && (
              <Link href="/wallet" className="text-[10px] uppercase tracking-[0.2em] text-accent hover:text-accent/80 border-b border-accent/30 pb-0.5">
                Connect Wallet
              </Link>
            )}
          </div>
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tighter">
          Zero<span className="text-accent">Swap</span>
        </h1>

        {!isConnected ? (
          <div className="bg-foreground/5 rounded-xl border border-foreground/10 p-10 text-center">
            <p className="text-muted-foreground mb-4">Connect your wallet to start swapping.</p>
            <Link href="/wallet" className="bg-accent inline-block cursor-pointer rounded-md px-6 py-2.5 text-sm font-medium text-black hover:opacity-90">
              Go to Wallet →
            </Link>
          </div>
        ) : (
          <>
            <SwapForm address={address!} />
            <div className="h-1 bg-foreground/10 rounded-full my-8" />
            <LiquidityForm address={address!} />
            <div className="h-1 bg-foreground/10 rounded-full my-8" />
            <ApproveForm address={address!} />
          </>
        )}
      </div>
    </main>
  );
}

function SwapForm({ address }: { address: string }) {
  const [amount, setAmount] = useState("");
  const [tokenOut, setTokenOut] = useState(MOCK_TOKEN);
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: confirming } = useWaitForTransactionReceipt({ hash });

  const { data: gttBalance } = useReadContract({
    address: MOCK_TOKEN, abi: MOCK_ABI, functionName: "balanceOf", args: [address as `0x${string}`],
  });

  async function handleSwap() {
    if (!amount) return;
    const amtIn = BigInt(Math.floor(parseFloat(amount) * 1e18));
    writeContract({ address: ZEROSWAP, abi: SWAP_ABI, functionName: "swap", args: [MOCK_TOKEN, tokenOut, amtIn, BigInt(0)] });
  }

  const bal = gttBalance ? (Number(gttBalance) / 1e18).toFixed(2) : "0.00";

  return (
    <div className="bg-foreground/5 rounded-xl border border-foreground/10 p-6">
      <h2 className="text-lg font-bold uppercase tracking-[0.1em] mb-5">Swap</h2>

      <div className="space-y-4">
        <div className="bg-background rounded-lg border border-foreground/10 p-4">
          <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-2">You Pay</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent flex-1 text-2xl font-mono outline-none"
              step="0.01"
              min="0"
            />
            <span className="bg-foreground/10 rounded-full px-3 py-1 text-xs font-bold uppercase">GTT</span>
          </div>
          <p className="text-muted-foreground text-xs mt-2">Balance: {bal} GTT</p>
        </div>

        <div className="flex justify-center">
          <span className="text-muted-foreground text-lg">&darr;</span>
        </div>

        <div className="bg-background rounded-lg border border-foreground/10 p-4">
          <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-2">You Receive</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="0.0"
              value={tokenOut === MOCK_TOKEN ? (amount ? String(parseFloat(amount || "0") * 0.99) : "") : ""}
              readOnly
              className="bg-transparent flex-1 text-2xl font-mono outline-none text-muted-foreground"
            />
            <span className="bg-foreground/10 rounded-full px-3 py-1 text-xs font-bold uppercase">GTT</span>
          </div>
          <p className="text-muted-foreground text-xs mt-2">Fee: 0.3% · Slippage: 1%</p>
        </div>

        <button
          onClick={handleSwap}
          disabled={isPending || confirming || !amount}
          className="bg-accent w-full cursor-pointer rounded-lg py-3.5 text-sm font-bold text-black uppercase tracking-wider hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {isPending ? "Confirm in wallet..." : confirming ? "Pending..." : "Swap"}
        </button>

        {hash && (
          <p className="text-muted-foreground text-xs text-center break-all">
            TX:{" "}
            <a href={`https://scan.bohr.life/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {hash.slice(0, 10)}...
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

function LiquidityForm({ address }: { address: string }) {
  const [amount, setAmount] = useState("");
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: confirming } = useWaitForTransactionReceipt({ hash });

  const { data: gttBalance } = useReadContract({
    address: MOCK_TOKEN, abi: MOCK_ABI, functionName: "balanceOf", args: [address as `0x${string}`],
  });

  async function handleAdd() {
    if (!amount) return;
    const amt = BigInt(Math.floor(parseFloat(amount) * 1e18));
    writeContract({ address: ZEROSWAP, abi: SWAP_ABI, functionName: "addLiquidity", args: [MOCK_TOKEN, amt] });
  }

  const bal = gttBalance ? (Number(gttBalance) / 1e18).toFixed(2) : "0.00";

  return (
    <div className="bg-foreground/5 rounded-xl border border-foreground/10 p-6">
      <h2 className="text-lg font-bold uppercase tracking-[0.1em] mb-5">Add Liquidity</h2>
      <div className="space-y-4">
        <div className="bg-background rounded-lg border border-foreground/10 p-4">
          <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-2">Amount</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent flex-1 text-2xl font-mono outline-none"
              step="0.01"
              min="0"
            />
            <span className="bg-foreground/10 rounded-full px-3 py-1 text-xs font-bold uppercase">GTT</span>
          </div>
          <p className="text-muted-foreground text-xs mt-2">Balance: {bal} GTT</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={isPending || confirming || !amount}
          className="bg-foreground w-full cursor-pointer rounded-lg py-3.5 text-sm font-bold text-background uppercase tracking-wider hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {isPending ? "Confirm in wallet..." : confirming ? "Pending..." : "Add Liquidity"}
        </button>
        {hash && (
          <p className="text-muted-foreground text-xs text-center break-all">
            <a href={`https://scan.bohr.life/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              View on Explorer →
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

function ApproveForm({ address }: { address: string }) {
  const [amount, setAmount] = useState("");
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: confirming } = useWaitForTransactionReceipt({ hash });

  async function handleApprove() {
    if (!amount) return;
    const amt = BigInt(Math.floor(parseFloat(amount) * 1e18));
    writeContract({ address: MOCK_TOKEN, abi: MOCK_ABI, functionName: "approve", args: [ZEROSWAP, amt] });
  }

  return (
    <div className="bg-foreground/5 rounded-xl border border-foreground/10 p-6">
      <h2 className="text-lg font-bold uppercase tracking-[0.1em] mb-5">Approve Spending</h2>
      <div className="space-y-4">
        <div className="bg-background rounded-lg border border-foreground/10 p-4">
          <label className="text-muted-foreground text-xs uppercase tracking-wider block mb-2">Allow ZeroSwap to spend</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent flex-1 text-2xl font-mono outline-none"
              step="0.01"
              min="0"
            />
            <span className="bg-foreground/10 rounded-full px-3 py-1 text-xs font-bold uppercase">GTT</span>
          </div>
        </div>
        <button
          onClick={handleApprove}
          disabled={isPending || confirming || !amount}
          className="bg-foreground/20 w-full cursor-pointer rounded-lg py-3 text-sm font-bold uppercase tracking-wider hover:bg-foreground/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Confirm in wallet..." : confirming ? "Pending..." : "Approve"}
        </button>
        {hash && (
          <p className="text-muted-foreground text-xs text-center break-all">
            <a href={`https://scan.bohr.life/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              View on Explorer →
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
