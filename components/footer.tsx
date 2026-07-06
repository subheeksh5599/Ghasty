"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.5 },
  transition: { duration: 0.8, ease: easeOut },
};

const links = [
  { label: "SDK Docs", href: "https://github.com/subheeksh5599/Ghasty#readme" },
  { label: "ZeroSwap", href: "/swap" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Contracts", href: "https://github.com/subheeksh5599/Ghasty/tree/main/contracts" },
];

const ecosystem = [
  { label: "BOT Chain", href: "https://www.botchain.ai" },
  { label: "Dev Docs", href: "https://dev-docs.botchain.ai" },
  { label: "Explorer", href: "https://scan.botchain.ai" },
  { label: "Faucet", href: "https://faucet.botchain.ai/basic" },
];

export function Footer(): ReactNode {
  return (
    <footer className="bg-accent px-6 py-16 text-black md:px-12 lg:px-20 rounded-tr-4xl rounded-tl-4xl">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div className="max-w-md" {...fadeInUp}>
            <p className="text-lg leading-relaxed text-black/80">
              Universal gasless transaction protocol for BOT Chain. Built natively on the EOA Paymaster.
            </p>
            <Link
              href="https://github.com/subheeksh5599/Ghasty"
              className="group mt-8 inline-flex items-center gap-3 rounded-md bg-white px-5 py-3 font-medium shadow-lg shadow-black/10 transition-all duration-500 ease-out hover:rounded-[50px] hover:bg-white/90"
            >
              View on GitHub
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 lg:justify-items-end">
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/50">
                Ghasty
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block text-black/80 transition-all duration-300 hover:translate-x-1 hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/50">
                BOT Chain
              </h4>
              <ul className="space-y-3">
                {ecosystem.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block text-black/80 transition-all duration-300 hover:translate-x-1 hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="my-16 h-px bg-black/10" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div {...fadeInUp}>
            <h2 className="text-6xl font-medium leading-none tracking-tight md:text-7xl lg:text-8xl">
              Get in
              <br />
              Touch
            </h2>
            <p className="mt-8 text-sm text-black/50">
              &copy; {new Date().getFullYear()} Ghasty Protocol. Built on BOT Chain.
            </p>
          </motion.div>

          <div className="flex flex-col justify-end gap-8 lg:items-end lg:text-right">
            <motion.div className="space-y-6" {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}>
              <a
                href="mailto:komasubheeksh@gmail.com"
                className="inline-block text-lg font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                komasubheeksh@gmail.com
              </a>
              <div className="flex items-center gap-4 lg:justify-end">
                <a
                  href="https://x.com/BOTChain_ai"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black transition-all duration-300 hover:scale-110 hover:bg-black hover:text-accent"
                  aria-label="Twitter"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/subheeksh5599/Ghasty"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black transition-all duration-300 hover:scale-110 hover:bg-black hover:text-accent"
                  aria-label="GitHub"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
