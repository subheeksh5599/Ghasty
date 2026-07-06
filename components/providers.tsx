"use client";

import { Web3Provider } from "@/components/web3-provider";
import { ReducedMotionProvider } from "@/lib/motion";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReducedMotionProvider>
        <Web3Provider>
          <SmoothScroll>{children}</SmoothScroll>
        </Web3Provider>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
