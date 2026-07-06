# Ghasty — BOT Chain Testnet Deployment

## Deployer
- **Address:** `0x8b348803DA3e81E2d18d91f9443EE7AAbEc092E8`
- **Network:** BOT Chain Testnet (Chain ID: 968)
- **RPC:** `https://rpc.bohr.life`

## Contracts

### GasPassRegistry
- **Address:** `0x85C2dB87F93827a057838b788D28B89dA4fD8c19`
- **Deploy TX:** `0xb05cb7be6cc073b2f44643579e99a879816a43ae531025ca51fd55f27bff9f6f`
- **Explorer:** https://scan.bohr.life/address/0x85C2dB87F93827a057838b788D28B89dA4fD8c19

### ZeroSwap
- **Address:** `0x9ef56cef4043ABfDBf72acB3C928BC560fCc91a0`
- **Deploy TX:** `0x9364564184a9fed73b97ecf8452ff4fdb415bbd45c43ce779b5f084e422a2c27`
- **Explorer:** https://scan.bohr.life/address/0x9ef56cef4043ABfDBf72acB3C928BC560fCc91a0

## Sponsor Policy
- **Policy Name:** `ghasty-demo`
- **Daily Cap:** 0.1 BOT
- **Gas Pool:** 1 BOT (funded)
- **Covered Contract:** ZeroSwap (max 300,000 gas/tx)
- **Register TX:** `0xc1cf8ff854df1fdac8bc2aabf956f563af1a7ff276678963422f547940ea58be`
- **Cover TX:** `0x514626d81e745cda23dbaa5217c041e4d131b744727606508e96a2a694a736cf`
- **Fund TX:** `0x4ee39587236aaf7b2589648e7ce660e4f8c48778a2b4a53ba425aa665d8a989f`

## Verification
- `isSponsorable("ghasty-demo", user, ZeroSwap)` → **true**
- Gas pool: 1 BOT
- Policy active: yes

## Quick Test
```bash
# Check sponsorship
cast call 0x85C2dB87F93827a057838b788D28B89dA4fD8c19 \
  "isSponsorable(string,address,address)" \
  "ghasty-demo" \
  YOUR_ADDRESS \
  0x9ef56cef4043ABfDBf72acB3C928BC560fCc91a0 \
  --rpc-url https://rpc.bohr.life
```
