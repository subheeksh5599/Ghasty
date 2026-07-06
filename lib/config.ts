/**
 * Site Configuration — Ghasty
 */

export const siteConfig = {
  name: "Ghasty",
  tagline: "Gasless, but fast.",
  description:
    "Universal gasless transaction protocol for BOT Chain. Deploy gasless dApps with one line of code. Built natively on BOT Chain's EOA Paymaster.",
  url: "https://ghasty.dev",
  social: {
    twitter: "@BOTChain_ai",
    github: "https://github.com/subheeksh5599/Ghasty",
  },
  nav: {
    cta: {
      text: "Start Building",
      href: "/dashboard",
    },
    signIn: {
      text: "Docs",
      href: "https://dev-docs.botchain.ai",
    },
  },
} as const;

export const heroConfig = {
  headline: {
    prefix: "Deploy",
    accent: "Gasless",
    suffix: "on BOT Chain",
  },
  description:
    "Users pay ZERO gas. You sponsor tx fees. Ghasty wraps BOT Chain's EOA Paymaster into a single SDK call. No smart contract wallets. No EIP-4337. Just gasless.",
  cta: {
    primary: {
      text: "Try ZeroSwap Demo",
      href: "/swap",
    },
    secondary: {
      text: "View on GitHub",
      href: "https://github.com/subheeksh5599/Ghasty",
    },
  },
  carousel: [
    "Zero Gas Swaps",
    "Gasless Approvals",
    "Sponsored Liquidity",
    "AI Agent Txs",
    "DePIN Payments",
    "NFT Mints",
    "Game Actions",
    "DAO Votes",
    "Token Claims",
    "Bridge Txs",
    "Oracle Updates",
    "Batch Ops",
  ],
} as const;

export const howItWorksConfig = {
  title: "Three layers to gasless",
  description: "Ghasty sits between your dApp and BOT Chain's EOA Paymaster, handling all the complexity.",
  cta: {
    text: "Read the Docs",
    href: "https://dev-docs.botchain.ai",
  },
} as const;

export const featuresConfig = {
  title: "Built Deep on BOT Chain",
  description: "Ghasty leverages 4 unique BOT Chain primitives that don't exist on any other EVM chain.",
} as const;

export const statsConfig = {
  title: "Why BOT Chain + Ghasty",
  description: "The only chain where gasless transactions work for regular wallets — at near-zero cost.",
} as const;

export const pricingConfig = {
  title: "Open Source. Always.",
  description: "Ghasty is MIT licensed. Deploy it, fork it, build on it. The protocol is yours.",
  cta: {
    primary: {
      text: "Star on GitHub",
      href: "https://github.com/subheeksh5599/Ghasty",
    },
    secondary: {
      text: "Read the Contracts",
      href: "https://github.com/subheeksh5599/Ghasty/tree/main/contracts",
    },
  },
} as const;

export const faqConfig = {
  title: "Questions",
  contact: {
    text: "Building on BOT Chain? Join the builders community.",
    cta: {
      text: "Join Telegram",
      href: "https://t.me/BOTChainBuilders",
    },
  },
} as const;

export const finalCtaConfig = {
  headline: "Ready to go gasless?",
  description: "Deploy your first gasless dApp on BOT Chain in under 5 minutes. Zero BOT needed for your users.",
  cta: {
    text: "Start Building",
    href: "/dashboard",
  },
} as const;

export const footerConfig = {
  description:
    "Ghasty is the universal gasless transaction protocol for BOT Chain. Built for the BOT Chain Builder Challenge #1.",
  cta: {
    text: "View on GitHub",
    href: "https://github.com/subheeksh5599/Ghasty",
  },
  links: {
    product: [
      { label: "SDK Docs", href: "https://github.com/subheeksh5599/Ghasty#readme" },
      { label: "ZeroSwap Demo", href: "/swap" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Contracts", href: "https://github.com/subheeksh5599/Ghasty/tree/main/contracts" },
    ],
    company: [
      { label: "BOT Chain", href: "https://www.botchain.ai" },
      { label: "Dev Docs", href: "https://dev-docs.botchain.ai" },
      { label: "Explorer", href: "https://scan.botchain.ai" },
      { label: "Faucet", href: "https://faucet.botchain.ai/basic" },
    ],
  },
  contact: {
    location: "BOT Chain Testnet",
    address: "Chain ID 968\nRPC: rpc.bohr.life",
    hours: "0.75s block time · Near-zero fees",
    email: "builders@botchain.ai",
  },
  copyright: `\u00A9 ${new Date().getFullYear()} Ghasty Protocol. Built on BOT Chain.`,
} as const;

export const features = {
  smoothScroll: true,
  darkMode: true,
  ditherCursor: false,
  statsSection: true,
} as const;
