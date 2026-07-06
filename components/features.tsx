"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const features = [
  {
    number: "01",
    title: "EOA Paymaster Wrapper",
    description:
      "BOT Chain lets regular wallets send gasless transactions. Ghasty wraps the raw JSON-RPC into a one-line SDK call. No EIP-4337. No smart contract wallet migration.",
  },
  {
    number: "02",
    title: "On-Chain Sponsor Registry",
    description:
      "GasPassRegistry manages sponsor policies on-chain — daily caps, gas pools, contract whitelisting. Deploy once, cover any dApp. All auditable on the explorer.",
  },
  {
    number: "03",
    title: "ZeroSwap Demo DEX",
    description:
      "A working DEX where users swap, approve, and add liquidity with zero BOT in their wallet. Proves gasless UX that is impossible on Ethereum or any other EVM chain.",
  },
];

export function Features(): ReactNode {
  return (
    <section className="bg-background px-6 py-16 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        <motion.div
          className="lg:sticky lg:top-60 lg:w-96 lg:shrink-0"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <h2 className="mb-4 text-2xl font-medium tracking-tight md:mb-6 md:text-3xl lg:text-4xl">
            Built deep on BOT Chain
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm text-base md:mb-8 md:text-lg">
            Ghasty leverages primitives that do not exist on any other EVM chain.
          </p>
          <a
            href="https://github.com/subheeksh5599/Ghasty"
            className="bg-foreground group inline-flex w-full items-center justify-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium text-background transition-all duration-500 ease-out hover:rounded-[50px] sm:w-auto"
          >
            <span>View on GitHub</span>
          </a>
        </motion.div>

        <div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-32">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              className="bg-muted grid grid-cols-1 gap-2 overflow-hidden rounded-2xl p-8 transition-colors duration-300 hover:bg-muted/80"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: easeOut,
              }}
            >
              <span className="text-muted-foreground bg-foreground/5 mb-4 block w-fit rounded-md px-2 py-1 text-sm font-medium">
                {feature.number}
              </span>
              <h3 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">
                {feature.title}
              </h3>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
