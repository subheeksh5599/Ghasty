"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import type { ReactNode } from "react";

export function FloatingWallet(): ReactNode {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <div className="fixed right-0 top-1/2 z-50 -translate-y-1/2">
        <button
          onClick={() => {
            const injected = connectors.find((c) => c.id === "injected");
            if (injected) connect({ connector: injected });
          }}
          className="bg-accent cursor-pointer rounded-l-lg px-3 py-3 text-sm font-medium text-black shadow-lg shadow-accent/30 transition-all hover:px-5 hover:shadow-xl hover:shadow-accent/40"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-1/2 z-50 -translate-y-1/2">
      <div className="bg-foreground/90 flex flex-col items-center gap-2 rounded-l-xl border border-foreground/10 px-3 py-4 shadow-lg backdrop-blur-sm">
        <div className="bg-green-500 h-2.5 w-2.5 rounded-full" />
        <span
          className="text-muted-foreground cursor-pointer font-mono text-xs hover:text-red-400"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          onClick={() => disconnect()}
        >
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
    </div>
  );
}
