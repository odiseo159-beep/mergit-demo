# mergit-demo

Add median: the median time from merge to payment

## Overview

Mergit reports the median time from merge to payment. Add `median(values)` in `src/median.js`.

**Done when**
- `median([20, 19, 41])` is `20`, and `median([1, 2, 3, 4])` is `2.5`.
- It does not change the array it receives.
- It throws `RangeError` for an empty array and `TypeError` when `values` is not an array or holds something that is not a finite number.
- Tests in `test/median.test.js` cover every case above, and `npm test` passes.

---

**Fund it: this one is for you.** The Mergit team w

## Installation

```bash
# Clone the repository
git clone https://github.com/odiseo159-beep/mergit-demo.git
cd mergit-demo

# Install dependencies (if applicable)
pip install -r requirements.txt  # Python
# or
npm install  # Node.js
```

## Usage

```bash
# Run the project
python main.py  # Python
# or
node index.js  # Node.js
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

See [LICENSE](LICENSE) for details.
