# Ghasty

> **Universal Gasless Transaction Protocol for BOT Chain**

Ghasty is the first gas abstraction layer on BOT Chain, built natively on the EOA Paymaster infrastructure. It lets ANY dApp offer gasless transactions with a single SDK call — no smart contract wallets, no EIP-4337, no migration required.

```
npx ghasty init && npx ghasty deploy
```

---

## Why Ghasty?

BOT Chain has a **unique primitive no other chain has** — the EOA Paymaster. It allows regular externally-owned accounts (MetaMask, any wallet) to send gasless transactions sponsored by a third party. The infrastructure exists (MegaFuel by Nodereal), but there's **zero developer tooling** to actually use it.

Ghasty bridges that gap. It's the "Stripe for gasless" on BOT Chain.

| Without Ghasty | With Ghasty |
|---|---|
| Raw JSON-RPC (`pm_isSponsorable`, `eth_sendRawTransaction`) | `await ghasty.send(user, tx)` |
| No policy management — manual whitelist per tx | On-chain registry with per-contract policies |
| No spend tracking or analytics | Real-time dashboard with per-user metrics |
| Impossible for dApps to offer gasless UX | One line of code in your frontend |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  DApp / Agent                    │
│              (ghasty SDK installed)              │
└────────────────────┬────────────────────────────┘
                     │ ghasty.send(user, tx)
                     ▼
┌─────────────────────────────────────────────────┐
│               Ghasty SDK (TypeScript)             │
│   pm_isSponsorable() → sign(zeroGas) → relay    │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│  Sponsor  │ │  Sponsor  │ │  Sponsor  │
│  Policy A │ │  Policy B │ │  Policy C │
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘
      │             │             │
      └─────────────┼─────────────┘
                    ▼
┌─────────────────────────────────────────────────┐
│        GasPassRegistry.sol (on-chain)            │
│   Policies, credits, spend caps, analytics       │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│        BOT Chain EOA Paymaster (MegaFuel)         │
│   Bundles zero-gas user tx with sponsor tx       │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
              BOT Chain Block
         (0.75s, near-zero fees)
```

---

## Project Structure

```
ghasty/
├── contracts/                    # Solidity (Foundry)
│   ├── src/
│   │   ├── GasPassRegistry.sol   # On-chain sponsor policy registry
│   │   ├── ZeroSwap.sol          # Demo gasless DEX
│   │   └── GasPassToken.sol      # Credit token for gas accounting
│   ├── test/
│   │   ├── GasPassRegistry.t.sol
│   │   └── ZeroSwap.t.sol
│   ├── script/
│   │   ├── Deploy.s.sol          # Deployment script
│   │   └── RegisterSponsor.s.sol # Sponsor registration
│   └── foundry.toml
├── sdk/                          # TypeScript SDK
│   ├── src/
│   │   ├── index.ts              # Main entry
│   │   ├── paymaster.ts          # EOA Paymaster wrapper
│   │   ├── registry.ts           # Registry contract interface
│   │   ├── wallet.ts             # Wallet adapter
│   │   └── types.ts              # Type definitions
│   ├── package.json
│   └── tsconfig.json
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── dashboard/                # Sponsor dashboard
│   │   └── page.tsx
│   └── swap/                     # ZeroSwap demo
│       └── page.tsx
├── components/                   # React components
│   ├── hero.tsx                  # Landing hero
│   ├── header.tsx                # Navigation
│   └── ...
├── lib/
│   ├── config.ts                 # Site configuration
│   └── metadata.ts               # SEO metadata
├── package.json                  # Next.js deps
└── README.md                     # This file
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- Foundry (`curl -L https://foundry.paradigm.xyz | bash`)
- MetaMask or any EVM wallet configured for BOT Chain

### 1. Configure BOT Chain Network

Add to wallet:
```
Testnet: Chain ID 968 | RPC: https://rpc.bohr.life
Mainnet: Chain ID 677 | RPC: https://rpc.botchain.ai
```

### 2. Get Test Tokens

```
https://faucet.botchain.ai/basic
```

### 3. Deploy Contracts

```bash
cd contracts
forge install
forge script script/Deploy.s.sol --rpc-url https://rpc.bohr.life --broadcast
```

### 4. Install SDK

```bash
npm install ghasty-sdk
```

### 5. Use in Your dApp

```typescript
import { Ghasty } from 'ghasty-sdk';

const ghasty = new Ghasty({
  chainId: 968, // BOT Chain testnet
  sponsorPolicy: 'my-dapp-policy',
});

// Make ANY transaction gasless for users
await ghasty.send(userWallet, {
  to: contractAddress,
  data: swapCalldata,
});
```

---

## GasPassRegistry.sol

The on-chain registry is the backbone of Ghasty. It manages:

- **Sponsor Policies**: Who can sponsor, which contracts are covered, spending caps
- **Credit System**: Pre-funded gas pools with per-policy accounting
- **Analytics**: On-chain usage tracking for sponsor dashboards

```solidity
interface IGasPassRegistry {
    function registerSponsor(string calldata policyName, uint256 dailyCap) external;
    function addCoveredContract(string calldata policyName, address contractAddr) external;
    function isSponsorable(address sender, address to, uint256 gas) external view returns (bool);
    function recordSponsorship(address sender, uint256 gasUsed) external;
    function getSponsorStats(address sponsor) external view returns (SponsorStats memory);
}
```

---

## BOT Chain Integration Depth

Ghasty is **deeply native** to BOT Chain, leveraging 4 unique primitives:

| Feature | How Ghasty Uses It | Impact |
|---|---|---|
| **EOA Paymaster** | Core gasless transaction flow — all user txs go through MegaFuel | Enables zero-gas UX for regular wallets |
| **Blob API** | Stores sponsor policy metadata and audit logs as blobs for ~1000x cheaper storage | Makes on-chain policy storage economically viable |
| **0.75s Blocks** | Transaction confirmation is near-instant — gasless UX feels like Web2 | No loading spinners; swaps confirm in <1s |
| **Near-zero Fees** | Sponsor costs are negligible even at scale — 1000 gasless txs cost ~$0.01 | Makes business model viable for dApps |

---

## ZeroSwap Demo

ZeroSwap is a mini DEX where users with **zero BOT in their wallet** can:

1. **Swap tokens** — gasless via Ghasty + EOA Paymaster
2. **Approve tokens** — gasless (no BOT needed for approval txs)
3. **Add liquidity** — gasless

The demo proves that BOT Chain's EOA Paymaster enables UX that's impossible on Ethereum, Arbitrum, or any other EVM chain.

---

## SDK API Reference

### `Ghasty` class

```typescript
class Ghasty {
  constructor(config: GhastyConfig);
  
  // Check if a transaction is sponsorable
  isSponsorable(tx: TransactionRequest): Promise<boolean>;
  
  // Send a gasless transaction
  send(wallet: Wallet, tx: TransactionRequest): Promise<TransactionReceipt>;
  
  // Batch multiple gasless transactions
  sendBatch(wallet: Wallet, txs: TransactionRequest[]): Promise<TransactionReceipt[]>;
  
  // Get sponsor stats
  getSponsorStats(): Promise<SponsorStats>;
}
```

### `GhastyConfig`

```typescript
interface GhastyConfig {
  chainId: 968 | 677;        // BOT Chain testnet | mainnet
  sponsorPolicy: string;      // Your registered policy name
  paymasterRpc?: string;      // Defaults to MegaFuel endpoint
  registryAddress?: string;   // GasPassRegistry contract
  maxGasPerTx?: bigint;       // Per-transaction gas cap
  dailyLimit?: bigint;        // Daily sponsorship limit
}
```

---

## Sponsor Dashboard

The Ghasty Dashboard (built into this repo at `/app/dashboard`) provides:

- **Policy Management**: Create/edit/delete sponsor policies
- **Coverage Tracking**: See which contracts are covered by each policy
- **Spend Analytics**: Real-time gas spend per user, per day, per contract
- **Top-Up Interface**: Fund your gas pool with BOT tokens
- **Export**: CSV export of all sponsored transactions

---

## Track & Prize Strategy

Ghasty targets **all three prize categories**:

### Track: EVM Deployment / AI Agent
Deepest BOT Chain integration possible — EOA Paymaster + Blob API + fast blocks. Not a port; natively built for BOT Chain.

### Best Content
Demo video: "Zero BOT. Real swaps." — a MetaMask user with 0 BOT balance executing real DEX trades. Tutorial: "How to add gasless to your BOT Chain dApp in 5 minutes."

### PR / Bug / Optimization Bounty
While building, identify and document:
- Paymaster API edge cases
- Docs gaps in the Quick Start guide
- Wallet integration friction points
- Blob API usage patterns and limitations

---

## Development

```bash
# Frontend (Next.js)
npm install && npm run dev

# Contracts (Foundry)
cd contracts
forge build && forge test

# SDK
cd sdk
npm install && npm run build
```

### Lint & Typecheck

```bash
npm run lint
npm run typecheck
```

---

## License

MIT — built for the BOT Chain Builder Challenge #1.

---

<p align="center">
  <b>Ghasty</b> — Gasless, but fast.<br/>
  Built on <a href="https://www.botchain.ai">BOT Chain</a> for the 2026 Builder Challenge.
</p>
