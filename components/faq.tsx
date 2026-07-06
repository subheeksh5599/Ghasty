"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const faqs = [
  {
    question: "What is Ghasty?",
    answer:
      "Ghasty is a gasless transaction protocol built natively on BOT Chain. It wraps the EOA Paymaster into a one-line SDK, letting any dApp offer zero-gas transactions for regular wallets — no smart contract wallets, no EIP-4337 required.",
  },
  {
    question: "How does gasless work on BOT Chain?",
    answer:
      "BOT Chain has a native EOA Paymaster that bundles zero-gas user transactions with a sponsor's fee-paying transaction. The builder includes both in a block atomically. Ghasty handles the pm_isSponsorable check, signing, and relay — all behind a single function call.",
  },
  {
    question: "Which wallets are supported?",
    answer:
      "Any EVM wallet — MetaMask, BO Wallet, Rabby, Frame. Since BOT Chain's paymaster works with regular EOAs, there's no migration or smart contract wallet needed. If your users have a wallet, it works.",
  },
  {
    question: "What does it cost to sponsor transactions?",
    answer:
      "BOT Chain has near-zero fees. Sponsoring roughly 1,000 transactions costs less than a cent. The real cost is your gas pool — you set daily caps per policy so there are no surprises.",
  },
  {
    question: "Where are the contracts deployed?",
    answer:
      "GasPassRegistry and ZeroSwap are live on BOT Chain testnet. Check DEPLOY.md in the repo for addresses, transaction hashes, and explorer links. The GitHub repo has the full source.",
  },
];

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}): ReactNode {
  return (
    <motion.div
      className="border-foreground/10 border-b last:border-b-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: easeOut }}
    >
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-foreground text-lg font-medium pr-8 md:text-xl">
          {faq.question}
        </span>
        <motion.div
          className="text-foreground/50 shrink-0"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground pb-6 text-base leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ(): ReactNode {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-foreground px-6 py-16 md:py-32 rounded-4xl">
      <div className="mx-auto max-w-3xl">
        <motion.div
          ref={headerRef}
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <h2 className="text-background text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            Questions
          </h2>
        </motion.div>

        <motion.div
          className="bg-background rounded-2xl px-6 md:px-10 py-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
