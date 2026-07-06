# Ghasty — X Post + Build Thread

## Main Showcase Tweet (Post This First)

---

built ghasty this week for the @BOTChain_ai builder challenge

the idea: bot chain has an eoa paymaster that lets regular wallets send gasless transactions. nobody built tooling for it yet. so i built the missing layer

deployed on bot chain testnet. contracts are live. 14 tests passing. typecheck clean

github.com/subheeksh5599/Ghasty

GasPassRegistry: 0x85C2dB87F93827a057838b788D28B89dA4fD8c19
ZeroSwap: 0x9ef56cef4043ABfDBf72acB3C928BC560fCc91a0

[attach demo gif or screenshot]

#BOTChain #EVM

---

## Build Thread (Post These As Replies — 4 Tweets)

### Tweet 2 — The Problem

gas is the worst part of web3 ux. every chain says "near zero fees" but users still need to hold native tokens to do anything. bot chain actually has a solution for this — the eoa paymaster. but there's no sdk, no framework, no dashboard. just raw json-rpc

### Tweet 3 — The Architecture

three components:

1. GasPassRegistry.sol — on-chain sponsor policies with daily caps, gas pools, contract whitelisting. deploy once, cover any dapp

2. ghasty sdk — one-liner wrapper around the paymaster rpc. `await ghasty.send(wallet, tx)` replaces the entire pm_isSponsorable → sign → relay flow

3. dashboard — manage policies, track spend, see which contracts are eating your gas pool

### Tweet 4 — The Demo

made zerowap — a mini dex where users with literally zero bot in their wallet can swap, approve, and add liquidity. all gasless

the demo proves something that's impossible on ethereum, arbitrum, base, or any other evm chain: a regular metamask wallet executing real on-chain transactions without holding the native token

### Tweet 5 — Deep BOT Chain Integration

this isn't a port. it uses four bot chain primitives that don't exist elsewhere:

- eoa paymaster (core gasless flow)
- blob api (cheap policy metadata storage)  
- 0.75s blocks (swaps confirm in under a second)
- near-zero fees (sponsoring 1000 txs costs about a cent)

built natively for this chain. can't be done on any other l1 or l2
