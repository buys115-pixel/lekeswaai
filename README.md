# LekeSwaai 🏌️‍♂️

Golf swing analysis for South African golfers — upload a swing video, get an
instant breakdown of what's going wrong, and drills to fix it.

## What's actually in this starter project

- **Frontend**: React + Vite + Tailwind CSS
- **Swing analysis**: runs entirely in the browser using [TensorFlow.js](https://www.tensorflow.org/js)
  and the MoveNet pose-detection model — no video ever leaves the user's device
- **Fault detection**: simple, explainable heuristics (angles and positions
  compared against loose thresholds), not a trained ML classifier
- **Drill library**: hand-written content in `src/data/faultLibrary.js`,
  split into free and premium (`Pro Swaai`) tiers
- **Subscription/paywall**: tier-gating UI is built, with a Stripe Checkout
  stub — **you must finish wiring this up before charging real money**

## Getting started

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Important limitations — read before you ship this

**The swing analysis is a heuristic approximation, not a biomechanics lab.**
A single 2D camera can't see depth, so every angle here is an estimate.
It works best with:
- a face-on view, camera at chest height
- good, even lighting
- the golfer's full body in frame the whole time
- minimal motion blur (higher shutter speed / good light helps a lot)

Treat every flagged fault as "worth a closer look," not a diagnosis. Consider
adding a visible disclaimer in the UI (a short one is already in the footer)
and, if you want to get more rigorous, validating the heuristics against
labelled video of known faults before trusting the numbers publicly.

**The free/premium split is client-side only right now.** `SubscriptionContext.jsx`
stores the tier in `localStorage`, which is fine for demoing the UI but is
trivial for a user to bypass by editing browser storage. Before charging
real money you need:

1. A backend (Node/Express, Supabase, Firebase, etc.) with a `users` table
   storing subscription status
2. Stripe webhooks (`checkout.session.completed`, subscription cancelled/updated
   events) that update that table server-side
3. Your frontend fetching tier status from that backend on load, not from
   localStorage

`api/create-checkout-session.js` is a stub — see the comments inside for the
exact steps to wire up real Stripe billing.

**Video links point to YouTube search results, not specific hardcoded videos.**
This avoids ever linking to a video that's been deleted or is wrong, but it
also means the content isn't curated. Once you've picked real South African
(or any) instructors you trust, replace `youtubeSearchUrl(fault.videoQuery)`
in `DrillCard.jsx` with direct links to specific videos you've vetted —
just make sure you have the rights/permission to link to them and that you're
not implying an endorsement that doesn't exist.

## Extending the fault library

Add new entries to `src/data/faultLibrary.js` following the existing shape,
then add a matching detection heuristic in `src/lib/swingAnalysis.js`'s
`detectFaults()`. Keep thresholds loose and test against real clips —
these numbers were chosen as reasonable starting points, not tuned against
a dataset.

## Deployment

This is a static Vite app plus one serverless function, so it deploys
cleanly to Vercel or Netlify:

```bash
npm run build
```

Deploy the `dist/` folder as a static site, and deploy `api/create-checkout-session.js`
as a serverless function (Vercel picks up files in `/api` automatically).

## Suggested next features for the SA angle

- A directory of local coaches/pro shops who offer in-person lessons,
  linked from each fault card ("want a real coach to look at this?")
- ZAR-only pricing is already in `PricingSection.jsx` — adjust to your
  real numbers
- Local golf calendar/course integration if you want to go beyond swing analysis
