"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import Link from "next/link";
import { useState, type ReactNode } from "react";

export default function WalletPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const [loading, setLoading] = useState<string | null>(null);

  const availableConnectors = connectors.filter(
    (c) => c.id === "injected" || c.id === "metaMask" || c.id === "coinbaseWallet"
  );

  async function handleConnect(connectorId: string) {
    setLoading(connectorId);
    try {
      const c = connectors.find((x) => x.id === connectorId);
      if (c) await connect({ connector: c });
    } catch {
      // user rejected
    }
    setLoading(null);
  }

  return (
    <main className="flex min-h-screen flex-col px-6 pt-32 pb-24">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            &larr; Back
          </Link>
        </div>

        {!isConnected ? (
          <>
            <div className="mb-8 text-center">
              <div className="text-[8rem] leading-none font-black text-foreground/5 mb-6 select-none">
                &diams;
              </div>
              <h1 className="text-2xl font-bold uppercase tracking-[0.2em] mb-4">
                Connect Wallet
              </h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Connect your EVM wallet to interact with Ghasty on BOT Chain testnet.
                Make sure your wallet is on Chain ID 968.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto">
              {availableConnectors.length === 0 && (
                <div className="col-span-full text-center">
                  <p className="text-muted-foreground text-sm mb-3">
                    No wallet detected. Install MetaMask or another EVM wallet.
                  </p>
                  <a
                    href="https://metamask.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent text-xs hover:underline"
                  >
                    Get MetaMask →
                  </a>
                </div>
              )}

              {availableConnectors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleConnect(c.id)}
                  disabled={loading !== null}
                  className="bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-xl p-6 text-left transition-all disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">
                      {c.id === "injected" ? "Browser Wallet" : c.name}
                    </span>
                    <span className="text-green-400 text-xs">● Detected</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {c.id === "injected"
                      ? "MetaMask, Rabby, BO Wallet, or any injected provider."
                      : `Connect via ${c.name}.`}
                  </p>
                  {loading === c.id && (
                    <p className="text-accent text-xs mt-2">Connecting...</p>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-12 border-t border-foreground/10 pt-8 text-center">
              <p className="text-muted-foreground text-xs mb-3">
                Need test tokens? Use the BOT Chain faucet.
              </p>
              <a
                href="https://faucet.botchain.ai/basic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline text-xs font-medium"
              >
                faucet.botchain.ai →
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6">
                Wallet
              </h1>
            </div>

            <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-500 h-3 w-3 rounded-full" />
                <span className="text-sm uppercase tracking-[0.2em] font-bold">Connected</span>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-foreground">{address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span>BOT Chain Testnet (968)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="text-5xl font-bold tracking-tighter">
                    {balance ? (Number(balance.value) / 10 ** balance.decimals).toFixed(4) : "0.0000"}
                    <span className="text-muted-foreground text-lg ml-1">{balance?.symbol ?? "BOT"}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => disconnect()}
                className="mt-8 border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer rounded-md px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                Disconnect
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/swap"
                className="bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-xl p-6 transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em]">ZeroSwap →</span>
                <p className="text-muted-foreground text-xs mt-2">Gasless DEX demo.</p>
              </Link>
              <Link
                href="/dashboard"
                className="bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-xl p-6 transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Dashboard →</span>
                <p className="text-muted-foreground text-xs mt-2">Policy management &amp; analytics.</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
