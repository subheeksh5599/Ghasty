"use client";

import { useAccount, useReadContract } from "wagmi";
import Link from "next/link";
import { useState, type ReactNode } from "react";

const ZEROSWAP_ADDRESS = "0x9ef56cef4043ABfDBf72acB3C928BC560fCc91a0" as `0x${string}`;

const ZEROSWAP_ABI = [
  {
    type: "function",
    name: "liquidity",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export default function SwapPage() {
  const { isConnected, address } = useAccount();
  const [txStatus, setTxStatus] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center px-6 pt-32 pb-24">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            &larr; Back
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-5xl font-medium tracking-tighter md:text-7xl">
              Zero<span className="text-accent">Swap</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              A mini DEX where users with <strong>zero BOT</strong> can swap, approve, and add liquidity — all gas sponsored by Ghasty.
            </p>
          </div>
          {isConnected ? (
            <div className="text-right">
              <p className="text-sm text-green-500 font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
              <p className="text-muted-foreground text-xs mt-1">Connected</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Connect wallet to interact</p>
          )}
        </div>

        {!isConnected ? (
          <div className="bg-foreground/5 mt-12 rounded-xl border border-foreground/10 p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">Connect your wallet to get started</p>
            <p className="text-muted-foreground text-sm">
              Use the <span className="text-accent font-medium">Connect Wallet</span> button in the header.
              Make sure your wallet is on BOT Chain testnet (Chain ID 968).
            </p>
          </div>
        ) : (
          <>
            <div className="bg-foreground/5 mt-10 rounded-xl border border-foreground/10 p-8">
              <h2 className="mb-6 text-xl font-semibold">Swap Tokens</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Interact with the ZeroSwap contract deployed at{" "}
                <code className="bg-foreground/10 rounded px-1 py-0.5 text-xs font-mono">
                  {ZEROSWAP_ADDRESS}
                </code>
              </p>
              <div className="space-y-4">
                <div className="rounded-lg bg-black/5 p-4 font-mono text-sm dark:bg-white/5">
                  <span className="text-accent">Contract:</span> ZeroSwap.sol
                </div>
                <div className="rounded-lg bg-black/5 p-4 font-mono text-sm dark:bg-white/5">
                  <span className="text-accent">Functions:</span> swap(), addLiquidity(), gaslessApprove()
                </div>
                <div className="rounded-lg bg-black/5 p-4 font-mono text-sm dark:bg-white/5">
                  <span className="text-accent">Fee:</span> 0.3% (30 bps)
                </div>
              </div>
              <a
                href="https://scan.bohr.life/address/0x9ef56cef4043ABfDBf72acB3C928BC560fCc91a0"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent mt-6 inline-block cursor-pointer rounded-md px-5 py-2.5 text-sm font-medium text-black transition-all hover:rounded-3xl"
              >
                Interact on Explorer →
              </a>
            </div>

            <div className="bg-foreground/5 mt-8 rounded-xl border border-foreground/10 p-8">
              <h2 className="mb-6 text-xl font-semibold">How Gasless Works</h2>
              <div className="space-y-4">
                <StepBox num="1" text="Your wallet signs a transaction with gasPrice = 0" />
                <StepBox num="2" text="Ghasty SDK sends it to MegaFuel Paymaster via pm_isSponsorable" />
                <StepBox num="3" text="Paymaster bundles your tx + sponsor tx, submits to builders" />
                <StepBox num="4" text="Block included in ~0.75s — your swap confirmed, zero gas paid" />
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}

function StepBox({ num, text }: { num: string; text: string }) {
  return (
    <div className="rounded-lg bg-black/5 p-5 font-mono text-sm tracking-tight dark:bg-white/5">
      <span className="text-accent font-bold">{num}.</span>{" "}
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}
