# mergit-demo

Add validateMergitJson: check mergit.json before committing it

## Overview

Add `validateMergitJson(config)` in `src/mergit-json.js`: it checks a `mergit.json` before it is committed, and returns the list of problems (empty when it is fine).

**Rules**
- `config` must be a plain object. Only the keys `wallets` and `funders` are allowed.
- `wallets`, if present, maps GitHub logins to addresses. A login has 1 to 39 characters, letters, digits or single hyphens, and does not start or end with a hyphen. An address is `0x` and 40 hex characters.
- `funders`, if present, is a

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
