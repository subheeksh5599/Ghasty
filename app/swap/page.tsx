import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "ZeroSwap — Gasless DEX Demo",
  description: "Swap tokens on BOT Chain with ZERO gas. Powered by Ghasty + EOA Paymaster.",
  path: "/swap",
});

const STEPS = [
  { num: "01", title: "Connect your wallet", desc: "Any EVM wallet works — MetaMask, BO Wallet, Rabby." },
  { num: "02", title: "Get test tokens", desc: "Hit the BOT Chain faucet for free test tokens to swap with." },
  { num: "03", title: "Swap gas-free", desc: "Execute swaps, approvals, and liquidity adds — all with zero BOT paid in gas." },
];

export default function SwapPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-6 pt-32 pb-24">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            &larr; Back to Ghasty
          </Link>
        </div>

        <h1 className="mb-6 text-5xl font-medium tracking-tighter md:text-7xl">
          Zero<span className="text-accent">Swap</span>
        </h1>
        <p className="text-muted-foreground mb-12 max-w-2xl text-xl leading-relaxed">
          A mini DEX where users with <strong>zero BOT in their wallet</strong> can swap tokens,
          approve spenders, and add liquidity. All gas fees are sponsored through Ghasty&apos;s
          EOA Paymaster integration.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-foreground/5 rounded-xl border border-foreground/10 p-6"
            >
              <span className="text-accent text-3xl font-bold">{step.num}</span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-foreground/5 mt-12 rounded-xl border border-foreground/10 p-8">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">How It Works</h2>

          <div className="space-y-6">
            <div className="rounded-lg bg-black/5 p-5 font-mono text-sm tracking-tight dark:bg-white/5">
              <span className="text-accent">1.</span> Your wallet signs a transaction with{" "}
              <code className="bg-accent/10 text-accent rounded px-1.5 py-0.5">gasPrice = 0</code>
            </div>

            <div className="flex justify-center text-muted-foreground">&darr;</div>

            <div className="rounded-lg bg-black/5 p-5 font-mono text-sm tracking-tight dark:bg-white/5">
              <span className="text-accent">2.</span> Ghasty SDK sends it to the EOA Paymaster via{" "}
              <code className="bg-accent/10 text-accent rounded px-1.5 py-0.5">
                pm_isSponsorable
              </code>
            </div>

            <div className="flex justify-center text-muted-foreground">&darr;</div>

            <div className="rounded-lg bg-black/5 p-5 font-mono text-sm tracking-tight dark:bg-white/5">
              <span className="text-accent">3.</span> Paymaster bundles your tx with a sponsor tx
              and submits to MEV builders
            </div>

            <div className="flex justify-center text-muted-foreground">&darr;</div>

            <div className="rounded-lg bg-black/5 p-5 font-mono text-sm tracking-tight dark:bg-white/5">
              <span className="text-accent">4.</span> Block included in{" "}
              <strong>&lt;1 second</strong> — your swap confirmed with{" "}
              <strong>zero gas paid</strong>
            </div>
          </div>
        </div>

        <div className="bg-accent/10 mt-8 rounded-xl border border-accent/20 p-6">
          <p className="text-accent text-sm font-medium uppercase tracking-wider">
            BOT Chain Builder Challenge #1
          </p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            ZeroSwap is the demo dApp for the Ghasty protocol. It proves that BOT Chain&apos;s EOA
            Paymaster enables UX that&apos;s impossible on Ethereum, Arbitrum, or any other EVM
            chain. Deploy your own gasless dApp with the Ghasty SDK.
          </p>
        </div>
      </div>
    </main>
  );
}
