import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Dashboard — Ghasty Protocol",
  description: "Manage your gasless transaction sponsor policies on BOT Chain.",
  path: "/dashboard",
});

const MOCK_POLICIES = [
  { name: "ghasty-demo", owner: "0x1234...5678", cap: "0.1 BOT/day", pool: "0.85 BOT", txs: 142, active: true },
  { name: "defi-app", owner: "0xabcd...ef01", cap: "1.0 BOT/day", pool: "5.2 BOT", txs: 89, active: true },
  { name: "nft-drop", owner: "0x9876...5432", cap: "0.5 BOT/day", pool: "2.1 BOT", txs: 34, active: false },
];

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col px-6 pt-32 pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            &larr; Back to Ghasty
          </Link>
        </div>

        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-medium tracking-tighter md:text-7xl">
              GasPass <span className="text-accent">Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
              Manage your sponsor policies, track gas spend, and monitor covered contracts.
            </p>
          </div>
          <button className="bg-accent hover:bg-accent/90 h-fit cursor-pointer rounded-md px-6 py-3 font-medium text-black transition-colors">
            + New Policy
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="bg-foreground/5 rounded-xl border border-foreground/10 p-6">
            <p className="text-muted-foreground text-sm">Active Policies</p>
            <p className="mt-2 text-3xl font-bold">2</p>
          </div>
          <div className="bg-foreground/5 rounded-xl border border-foreground/10 p-6">
            <p className="text-muted-foreground text-sm">Total Transactions</p>
            <p className="mt-2 text-3xl font-bold">265</p>
          </div>
          <div className="bg-foreground/5 rounded-xl border border-foreground/10 p-6">
            <p className="text-muted-foreground text-sm">Gas Saved (Users)</p>
            <p className="mt-2 text-3xl font-bold">~0.04 BOT</p>
          </div>
          <div className="bg-foreground/5 rounded-xl border border-foreground/10 p-6">
            <p className="text-muted-foreground text-sm">Pool Balance</p>
            <p className="mt-2 text-3xl font-bold">8.15 BOT</p>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-foreground/10">
                <th className="pb-3 pr-6 font-medium">Policy</th>
                <th className="pb-3 pr-6 font-medium">Owner</th>
                <th className="pb-3 pr-6 font-medium">Daily Cap</th>
                <th className="pb-3 pr-6 font-medium">Gas Pool</th>
                <th className="pb-3 pr-6 font-medium">TXs</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_POLICIES.map((p) => (
                <tr key={p.name} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                  <td className="py-4 pr-6 font-mono font-medium">{p.name}</td>
                  <td className="py-4 pr-6 font-mono text-muted-foreground text-xs">{p.owner}</td>
                  <td className="py-4 pr-6">{p.cap}</td>
                  <td className="py-4 pr-6">{p.pool}</td>
                  <td className="py-4 pr-6">{p.txs}</td>
                  <td className="py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.active
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-foreground/10 text-muted-foreground"
                      }`}
                    >
                      {p.active ? "Active" : "Paused"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-accent/10 mt-12 rounded-xl border border-accent/20 p-6">
          <p className="text-accent text-sm font-medium uppercase tracking-wider">
            Connect to BOT Chain
          </p>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            This dashboard connects to the GasPassRegistry contract deployed on BOT Chain.
            To manage your policies, connect your wallet and ensure it&apos;s configured for
            BOT Chain testnet (Chain ID 968, RPC: rpc.bohr.life).
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://faucet.botchain.ai/basic"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground/10 hover:bg-foreground/20 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Get Test Tokens
            </a>
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground/10 hover:bg-foreground/20 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Block Explorer
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
