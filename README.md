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

The library exports two helper functions that are useful when dealing with fees
on the GIWA chain.

### `split(amount: bigint, feeRate: number): bigint`

Calculates the fee for a given `amount` and a `feeRate` expressed in basis points
(1/100 of a percent). The fee is **rounded down** to the nearest integer.

**Example**

```ts
const amount = 500000000000000n; // 0.5 GIWA
const feeRate = 150; // 1.5 % (150 basis points)
const fee = split(amount, feeRate);
console.log(fee); // 7500000000000n
```

The calculation performed is:

```
fee = (amount * feeRate) / 10_000
```

Resulting in a fee of `7 500 000 000 000n` (1.5 % of the amount).

### `grossFor(net: bigint, feeRate: number): bigint`

Returns the smallest gross amount such that after subtracting the fee (computed
with `split`) the remaining net amount is **at least** the requested `net`. It
**rounds up** to guarantee the net is not less than desired.

**One‑line reason for rounding up**: `grossFor` rounds up because integer division
truncates the fee, and we need to ensure the net after fee is never below the
requested value.

**Example**

```ts
const net = 500000000000000n; // desired net amount
const feeRate = 150; // 1.5 % (150 basis points)
const gross = grossFor(net, feeRate);
console.log(gross); // 507614427860697n
```

The function computes:

```
gross = ceil( net * 10_000 / (10_000 - feeRate) )
```

For the values above, the smallest gross that leaves at least `500000000000000n`
after a 1.5 % fee is `507614427860697n`.

## Paid on merge

`.github/workflows/mergit.yml` runs the Mergit agent when a pull request is merged or
its CI finishes. To claim a bounty, a pull request says which one in its description:

```
Bounty: #5
```

The payout goes to the author's wallet as registered in `mergit.json`. On payment the
agent comments on the pull request with the amount, the evidence hash and the
transaction on GIWA Sepolia.
