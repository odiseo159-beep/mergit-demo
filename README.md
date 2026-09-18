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

## Paid on merge

`.github/workflows/mergit.yml` runs the Mergit agent when a pull request is merged or
its CI finishes. To claim a bounty, a pull request says which one in its description:

```
Bounty: #5
```

The payout goes to the author's wallet as registered in `mergit.json`. On payment the
agent comments on the pull request with the amount, the evidence hash and the
transaction on GIWA Sepolia.
