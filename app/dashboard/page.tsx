"use client";

import { useAccount, useBalance, useReadContract } from "wagmi";
import Link from "next/link";

const REGISTRY_ADDRESS = "0x85C2dB87F93827a057838b788D28B89dA4fD8c19" as `0x${string}`;

const REGISTRY_ABI = [
  {
    type: "function",
    name: "policies",
    inputs: [{ name: "", type: "string" }],
    outputs: [
      { name: "owner", type: "address" },
      { name: "dailyCap", type: "uint256" },
      { name: "dailySpent", type: "uint256" },
      { name: "lastResetDay", type: "uint256" },
      { name: "gasPool", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSponsorStats",
    inputs: [{ name: "policyName", type: "string" }],
    outputs: [
      { name: "totalSponsored", type: "uint256" },
      { name: "totalTxs", type: "uint256" },
      { name: "dailySpent", type: "uint256" },
      { name: "dailyCap", type: "uint256" },
      { name: "gasPool", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    stateMutability: "view",
  },
] as const;

const POLICIES = ["ghasty-demo"];

function formatBOT(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(4);
}

export default function DashboardPage() {
  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <main className="flex min-h-screen flex-col px-6 pt-32 pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            &larr; Back
          </Link>
        </div>

        <div className="border border-foreground/10 p-5 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-xs uppercase tracking-[0.2em] font-bold">
                {isConnected ? "Connected" : "Not Connected"}
              </span>
              {isConnected && address && (
                <>
                  <span className="text-muted-foreground text-xs font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  {balance && (
                    <span className="text-muted-foreground text-xs font-mono">
                      {(Number(balance.value) / 10 ** balance.decimals).toFixed(4)} {balance.symbol}
                    </span>
                  )}
                </>
              )}
            </div>
            {!isConnected && (
              <Link
                href="/wallet"
                className="text-[10px] uppercase tracking-[0.2em] text-accent hover:text-accent/80 border-b border-accent/30 pb-0.5"
              >
                Connect Wallet
              </Link>
            )}
          </div>
        </div>

        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-medium tracking-tighter md:text-7xl">
              GasPass <span className="text-accent">Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
              Sponsor policies, gas spend, and contract coverage on BOT Chain testnet.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <StatBox label="Active Policies" value="1" />
          <StatBox label="Testnet Chain ID" value="968" />
          <StatBox label="Block Time" value="~0.75s" />
          <StatBox label="Registry Address" value={REGISTRY_ADDRESS.slice(0, 10) + "..."} />
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Policy Details</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-foreground/10">
                <th className="pb-3 pr-6 font-medium">Policy</th>
                <th className="pb-3 pr-6 font-medium">Daily Cap</th>
                <th className="pb-3 pr-6 font-medium">Gas Pool</th>
                <th className="pb-3 pr-6 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {POLICIES.map((policy) => (
                <PolicyRow key={policy} policyName={policy} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-accent/10 mt-12 rounded-xl border border-accent/20 p-6">
          <p className="text-accent text-sm font-medium uppercase tracking-wider">
            BOT Chain Testnet
          </p>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Reading live data from GasPassRegistry at{" "}
            <code className="bg-foreground/10 rounded px-1.5 py-0.5 text-xs">{REGISTRY_ADDRESS}</code>
            {" "}on BOT Chain testnet (Chain ID 968).
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://scan.bohr.life/address/0x85C2dB87F93827a057838b788D28B89dA4fD8c19"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground/10 hover:bg-foreground/20 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              View on Explorer
            </a>
            <a
              href="https://faucet.botchain.ai/basic"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground/10 hover:bg-foreground/20 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Get Test Tokens
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-foreground/5 rounded-xl border border-foreground/10 p-6">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-3xl font-bold font-mono">{value}</p>
    </div>
  );
}

function PolicyRow({ policyName }: { policyName: string }) {
  const { data, isError, isLoading } = useReadContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: "getSponsorStats",
    args: [policyName],
    query: { retry: 2, refetchInterval: false },
  });

  if (isLoading) {
    return (
      <tr className="border-b border-foreground/5 animate-pulse">
        <td className="py-4 pr-6 font-mono font-medium">{policyName}</td>
        <td className="py-4 pr-6 text-muted-foreground">loading...</td>
        <td className="py-4 pr-6 text-muted-foreground">loading...</td>
        <td className="py-4 text-muted-foreground">...</td>
        <td className="py-4" />
      </tr>
    );
  }

  if (isError || !data) {
    return (
      <tr className="border-b border-foreground/5">
        <td className="py-4 pr-6 font-mono font-medium">{policyName}</td>
        <td className="py-4 pr-6 text-muted-foreground">—</td>
        <td className="py-4 pr-6 text-muted-foreground">—</td>
        <td className="py-4 pr-6 text-yellow-500/80 text-xs">RPC read failed</td>
        <td className="py-4">
          <a
            href="https://scan.bohr.life/address/0x85C2dB87F93827a057838b788D28B89dA4fD8c19"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline text-xs"
          >
            Explorer →
          </a>
        </td>
      </tr>
    );
  }

  const result = data as unknown as [bigint, bigint, bigint, bigint, bigint, boolean];
  const [totalSponsored, totalTxs, dailySpent, dailyCap, gasPool, active] = result;

  return (
    <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
      <td className="py-4 pr-6 font-mono font-medium">{policyName}</td>
      <td className="py-4 pr-6">{formatBOT(dailyCap)} BOT/day</td>
      <td className="py-4 pr-6">{formatBOT(gasPool)} BOT</td>
      <td className="py-4">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            active
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-foreground/10 text-muted-foreground"
          }`}
        >
          {active ? "Active" : "Paused"}
        </span>
      </td>
      <td className="py-4">
        <a
          href="https://scan.bohr.life/address/0x85C2dB87F93827a057838b788D28B89dA4fD8c19"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline text-xs"
        >
          Explorer →
        </a>
      </td>
    </tr>
  );
}
