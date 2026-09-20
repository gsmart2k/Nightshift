# NIGHTSHIFT: complete research-task walkthrough

[Open demo](https://nightshift-sooty-one.vercel.app)

Track: AI Trading Desk / Decision Stress Testing. This is a reproducible walkthrough of the implemented research task, not a record of executed trades.

## Question

“How could a Fed policy announcement affect my overnight portfolio? Compare the scenarios and explain the source limitations.”

## 1. Inspect the starting assumptions

Open Stress lab with the default example:

| Input | Value |
| --- | ---: |
| NVDA exposure | $5,000 |
| TSLA exposure | $3,000 |
| AAPL exposure | $2,000 |
| Cash | $2,000 |
| Assumed shocks | −12%, −9%, −5% respectively |
| Proportional reduction before the shock | 30% |
| Full spread / fee / extra slippage | 1% / 0.1% / 0.2% |
| Assumed executable depth | $5,000 |

Dollar exposures are unlevered illustrative positions. They are not connected account balances. Shocks and executable depth are assumptions, not observed prices or order-book measurements.

## 2. Ask the question and inspect evidence

Submit the question above. Keyword retrieval ranks the Federal Reserve's March 15, 2020 Sunday announcement first. Open the original source in Evidence:
https://www.federalreserve.gov/newsevents/pressreleases/monetary20200315a.htm

The sourced fact is a Sunday policy announcement setting the target range at 0–0.25%. It supports the observation that important news can arrive outside the regular equity session. It does not establish how today's holdings would react. The collection contains three curated records; no live-news search occurs.

Gemini explains the provided sources and calculated comparison. Wording varies between requests. A successful deployed test returned HTTP 200 with Gemini mode and the baseline values below. If the provider is unavailable, the UI reports that failure. With no configured key, analysis is explicitly labeled deterministic.

## 3. Compare outcomes

The deterministic engine calculates:

- Holding impact: $5,000 × −12% + $3,000 × −9% + $2,000 × −5% = **−$970**.
- Assumed sale before the shock: $10,000 × 30% = **$3,000**.
- Sale costs: $3,000 × (0.5% half-spread + 0.1% fee + 0.2% extra slippage) = **$24**.
- Reduced-exposure impact: −$970 × 70% − $24 = **−$703**.
- Difference: **$267** under these particular assumptions.

This difference is hypothetical. Neither loss is a worst-case bound or guaranteed cap. A positive shock can make reducing exposure worse than holding. The chart interpolates scenario endpoints; it is not a prediction of the path.

## 4. Challenge the thesis

Click **Make it worse** once from the defaults. Expected assumptions are −17%, −14%, −10%, a 1.5% full spread, and $3,250 depth.

Expected outcomes: holding impact **−$1,470**, costs **$31.50**, reduced impact **−$1,060.50**. These values were checked during browser validation.

Turn source verification off. The research plan is flagged as blocked. A planned sale above assumed depth or a full spread over 2% also triggers review. These are research guardrails, not enforced trading controls: the application does not execute orders.

## 5. Form a human-reviewed conclusion

Open Night plan and Methodology. A defensible conclusion is:

“Under the chosen negative shocks, reducing exposure before the shock lowers the modeled loss after assumed costs. That result depends on being able to transact beforehand, on the selected shocks and on the execution assumptions. Verify the event, actual instrument, executable liquidity and costs before making a decision. The historical Fed announcement is context, not a forecast.”

The action from this research task is to verify or revise assumptions, not to place an AI-directed trade. Plan-download receipt has not been independently verified.

## Known limits

No automatic overnight monitoring, order execution, persistent portfolio, user study or performance backtest. Bitget futures quotes are contextual and differ from tokenized spot. Live fetches from the deployed runtime have been unreliable; fallback quotes display their original timestamp and stale status. Leverage, liquidation, funding, FX, tax and issuer/redemption risks are not modeled. Qwen activation/KYC prevented successful Qwen testing; the deployed tested model is Gemini.

## Technical verification

Baseline arithmetic, reduction boundaries, cash-only positions, finite/nonnegative inputs, guardrail boundaries and keyword retrieval passed automated assertions. TypeScript and production builds passed in the original Sites environment. UI checks covered portfolio editing, worsening scenarios, verification flags and source ranking. The standard Next.js migration also passed its production build, TypeScript validation, homepage HTTP 200, deterministic research API and invalid-input HTTP 400 checks on September 20. On September 20, the public Vercel homepage returned HTTP 200 without authentication. A public research POST returned HTTP 200 in Gemini mode (gemini-3.6-flash), with −$970 holding impact, −$703 reduced impact and $24 costs. This verifies HTTP/API behavior; it is not a full visual browser test.
