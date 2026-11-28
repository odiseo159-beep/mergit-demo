# mergit-demo

A small, real repository used to demonstrate [Mergit](https://github.com/odiseo159-beep/mergit).

Mergit is a trustless bounty protocol on GIWA Chain. A protocol locks a bounty
on-chain, a developer opens a pull request, and a verification agent checks the
work and releases the payment.

This repository is the work side of that loop. It has real tests and real CI, so
the agent has something real to verify: it reads the merged pull request, checks
that the CI for its head commit is green, hashes the evidence, and settles the
escrow.

```bash
npm test
```

Nothing here is a mock. If the tests fail, the agent does not pay.

## Library

`src/split.js` is the payout maths, mirroring `MergitEscrow`. Amounts are wei
as `bigint`, fees are basis points as a `number`.

```js
import { split, grossFor, MAX_FEE_BPS, BPS_DENOMINATOR } from "./src/index.js";

// What the developer receives, and what the protocol keeps.
split(500_000_000_000_000n, 150);
// { payout: 492_500_000_000_000n, fee: 7_500_000_000_000n }

// The smallest amount a funder must lock so the developer nets the target.
grossFor(492_500_000_000_000n, 150);
// 499_999_999_999_999n — split() of it pays exactly 492_500_000_000_000n
```

`grossFor` rounds up because `split` rounds the fee down, in the developer's
favour, so the inverse has to round the other way to leave the developer whole.

`MAX_FEE_BPS` is 500 and `BPS_DENOMINATOR` is 10 000: the fee is capped at 5%,
in code, and no caller can raise it.

## Paid on merge

`.github/workflows/mergit.yml` runs the Mergit agent when a pull request is merged or
its CI finishes. To claim a bounty, a pull request says which one in its description:

```
Bounty: #5
```

The payout goes to the author's wallet as registered in `mergit.json`. On payment the
agent comments on the pull request with the amount, the evidence hash and the
transaction on GIWA Sepolia.

New here? See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get paid.
