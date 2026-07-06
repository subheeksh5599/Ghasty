# How to Max Your Presentation Score (20% of Judging)

## The 4 Dimensions That Get Scored

| Dimension | Weight | What They Actually Look At |
|-----------|--------|----------------------------|
| Demo | 12.5% | Is there a WORKING demo they can verify? Can you show it live? |
| Docs | 2.5% | Is the README clear? Can they understand what you built in 30 seconds? |
| Video | 2.5% | Is there a demo video? Is it short? Does it show the product, not a slide deck? |
| Public Showcase | 2.5% | Is the X post clear? Does it have a screenshot? |

**The presentation score is won or lost on the demo video. Don't overthink it.**

---

## How to Record a Website Demo Video (No Tools, No Loom, No Bullshit)

You're showing a website. The best recording method is **browser-native**. Here's every option, ranked from best to worst:

### Option 1: Chrome DevTools Recorder (Best — FREE, built-in, produces a replayable recording)
```
1. Open Chrome → F12 → "Recorder" tab (it's built in, no extension)
2. Click "Create a new recording"
3. Hit record, do your demo, hit stop
4. Export as @puppeteer/replay or just replay it while screen-recording
```
This also proves your demo works because the recorder captures actual network requests and DOM state, not just pixels.

### Option 2: OBS Studio (Desktop screen record — FREE, industry standard)
```
1. Download OBS Studio (obsproject.com)
2. Add Source → "Window Capture" → pick your browser window
3. Hit "Start Recording"
4. Do your demo
5. Hit "Stop Recording"
6. Trim the first/last 2 seconds (no "let me click record" awkwardness)
```
**Pro tip:** Resize your browser to exactly 1280x720 before recording. This forces clean framing.

### Option 3: macOS QuickTime (if you're on Mac)
```
1. Open QuickTime Player
2. File → New Screen Recording
3. Select your browser window
4. Record
```

### Option 4: Windows Xbox Game Bar (Win+G)
```
1. Press Win+G
2. Click the record button
3. It records your active window
```

---

## The 90-Second Demo Video Formula (This Is What Wins)

**Structure: (30s + 30s + 30s = 90 seconds total)**

### First 30s — The "Why Should I Care" (Hook)
- Show the problem: MetaMask with 0 BOT balance, can't do anything on most chains
- One line of narration: "On every other chain, you need gas tokens to do anything. Not here."
- NO logos. NO title cards. NO "Hi my name is..." — straight to the product.

### Middle 30s — The "How It Works" (The Meat)
- Screen-record the actual dApp working. Show:
  1. Wallet connected with 0 BOT
  2. Click "Swap" — transaction goes through
  3. Click "Add Liquidity" — transaction goes through
  4. Show the explorer link confirming the tx was included (in <1s blocks)
- Narration: "Ghasty wraps BOT Chain's EOA Paymaster. One SDK call. Zero gas from the user."

### Last 30s — The "Why It Matters" (The Landing)
- Pull up the code on GitHub side-by-side with the demo
- One line: "One line of code. Any dApp. Any wallet. Gasless."
- End with the project name + "Built on BOT Chain" text on screen

---

## What NOT to Do (Things That Lose Points)

- ❌ 5-minute intro with your life story. Judges watch the first 15 seconds and decide.
- ❌ Vertical phone recording of your laptop screen. It looks sloppy.
- ❌ Reading bullet points from a slide deck. This isn't a pitch — it's a demo.
- ❌ "Sorry the audio is bad" — record in a quiet room, use your laptop mic, it's fine.
- ❌ Loom watermark. It screams "homework assignment."
- ❌ Unlisted YouTube link that requires login. Host it somewhere public.

---

## The X Post Formula (This Is Also Judged)

**Required elements for the showcase tweet:**
1. Project name
2. One line on what you built (no jargon)
3. How it uses BOT Chain (be specific)
4. Demo screenshot or GIF
5. GitHub link
6. Tag @BOTChain_ai

**The GIF trick:** Convert your 90s demo video to a GIF under 15MB (use `ffmpeg -i demo.mp4 -vf "fps=10,scale=640:-1" demo.gif`). Twitter auto-plays GIFs. Videos need a click.

---

## Bonus: How to Farm the Best Content Award (+50 USDT)

The Best Content award is independent of Track Awards. You can win both. Here's how:

1. **The demo GIF in the tweet** — auto-playing demo catches eyes in the feed
2. **A 2-minute loom-free Loom alternative** — record the screen + your face in a small circle (use OBS with your webcam as a second source, Picture-in-Picture style in the corner)
3. **One "How I built it" thread** — 5 tweets max, showing: the idea → the contract → the deploy → the test → the result. Each tweet gets a code screenshot. This doubles as technical documentation.
4. **A 30-second "Zero BOT, Real Swap" clip** — just the wallet with 0 balance doing a swap. This is the viral one. Post it separately from the main demo.

---

## tl;dr
- Record your browser window with OBS (free, no watermark)
- 90 seconds max: hook → demo → why it matters
- Convert to GIF for the X post (auto-plays)
- One code screenshot per tweet in the build thread
- Tag @BOTChain_ai
