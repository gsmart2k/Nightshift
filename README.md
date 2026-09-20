# NIGHTSHIFT

An overnight portfolio stress-testing workspace for Bitget AI Hackathon S2, AI Trading Desk / Decision Stress Testing.

[Live demo](https://nightshift-lab.digitaledge00.chatgpt.site) · [Judge walkthrough](docs/JUDGE_WALKTHROUGH.md)

## Built
- Editable unlevered NVDA, TSLA, AAPL dollar exposures plus cash.
- Deterministic stress and proportional pre-shock reduction engine.
- Explicit spread, fee, slippage and executable-depth assumptions.
- Compounding “Make it worse” control, with liquidity and source checks.
- Three curated primary-source historical episodes, keyword retrieval and source limitations.
- Read-only Bitget futures market context (`/api/market`); never presented as tokenized spot.
- Portfolio research endpoint with optional Qwen integration; deterministic mode labeled when not configured.
- Downloadable night plan; no portfolio persistence, trading, or background monitoring.

## Qwen connection
Set private server runtime values `QWEN_API_KEY`, `QWEN_BASE_URL` and `QWEN_MODEL`. Base URL must be the region-specific Alibaba Model Studio HTTPS compatible-mode/v1 endpoint associated with the key. No keys enter browser code. `/api/research` GET reports whether configuration exists; it does not validate credentials. POST sends validated hypothetical positions, question, computed results and curated evidence to the configured model. Qwen failures are explicit, without silently pretending the model ran.

Provider documentation: https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope

## Calculations
For position values V, decimal shocks r, reduction fraction a:
- Hold P&L = sum(V*r).
- Sale notional = sum(V)*a.
- Sale cost = sale notional * (full spread/2 + fee + extra slippage), all as decimals.
- Reduced P&L = hold P&L*(1-a) - sale cost.
- Cash unchanged; sale assumed before shock; no borrowing/leverage.

The chart interpolates the endpoint, not a predicted or historical price series. Duration changes labels only. No liquidation, funding, taxes, FX, issuer/redemption risk or order book execution model. Price assumptions are not measured historical returns. Quote timestamps are displayed; quotes older than 5 minutes are marked stale. When a live request fails, a labeled previously retrieved Bitget snapshot is returned. The local Worker live fetch failed during QA; the snapshot fallback was added rather than inventing current prices.

## Validation
Financial/boundary assertions passed during implementation: default ($12,000 capital, -$970 hold, -$703 reduced, $24 costs), zero/full reduction, cash-only, source/depth/spread gates, opposite-direction shock, negative/nonfinite input rejection. TypeScript and production build passed. Browser scenario escalation, source flag, research question retrieval and generated deterministic brief checked. Download click exercised, but the cloud browser did not expose a download event; receipt of the file is not verified. WebMCP registration is feature-detected; the available browser does not support modelContext, so WebMCP validation is unavailable.

No user study, real investment performance or backtest is claimed. A deployed Gemini research request passed with HTTP 200 and the expected numerical outputs. Qwen testing was blocked by provider activation/KYC. The demo audience is public; an automated unauthenticated check returned HTTP 403, so independent visitor access still needs confirmation. The X post and competition form are not yet submitted.

## Submission thesis
Self-directed traders with concentrated US technology exposures cannot continuously monitor overnight events. NIGHTSHIFT turns a vague question into inspectable scenarios, source limitations, cost-aware comparisons and a human-reviewed night plan. Its hypothesis is that a source-grounded stress workflow improves task completion and exposure understanding; this remains to be tested.

## Run
Requires Node.js >=22.13 and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Set provider values in your local `.env` if you want model-backed research. Leave credentials empty for the labeled deterministic mode. Use `pnpm build` for the Next.js production build. Server deployment requires environment secrets on your hosting provider. The owner-specific Sites manifest is excluded from this public source snapshot. Production secrets and uploaded screenshots are excluded. The GitHub version now uses standard Next.js and Node.js server environment variables. A production build, TypeScript checks, homepage HTTP 200, deterministic research results and invalid-input rejection passed locally on September 20. Vercel deployment and provider-backed research on Vercel remain to be verified.

## Alternative provider
Set AI_PROVIDER=gemini and GEMINI_API_KEY as a server secret to use Google Gemini. GEMINI_MODEL defaults to gemini-3.6-flash. Requests use the fixed Google OpenAI-compatible endpoint. No silent cross-provider fallback is performed. Model key creation and account eligibility must be validated before declaring AI operational.

## Deploy to Vercel

Import `gsmart2k/Nightshift` into Vercel. The included `vercel.json` selects Next.js, a frozen-lockfile install, and the production build. Keep the root directory at the repository root.

Set these server-side environment variables in Vercel before deploying:

```text
AI_PROVIDER=gemini
GEMINI_MODEL=gemini-3.6-flash
GEMINI_API_KEY=<your private key>
```

Never prefix the key with `NEXT_PUBLIC_` or commit it. The app runs in explicitly labeled deterministic mode without a configured key. Ensure the production URL is accessible without Vercel login before submission. Test a research question after deployment; provider eligibility and quota still apply. The existing Sites deployment remains a separate backup.
