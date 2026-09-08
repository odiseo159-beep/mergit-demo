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
