# Ledger Analytics

Analytics/Visualization tool for ledger-cli.

# Installation and Usage
Make sure [npm](https://docs.npmjs.com/cli/install) and [ledger-cli](https://www.ledger-cli.org/) is installed (`npm --help` and `ledger --help` should display some information if its installed).

```
npm install -g ledger-analytics

ledger-analytics -f <your journal file>
```

Navigate to http://127.0.0.1:3000 in your browser

# Query Examples
Don't insert the `$` character.

You can query multiple accounts by separating each account with a space, or exclude certain accounts by adding `and not <account>` in front of them.

### Overview
```
$ expenses:food expenses:flights
$ assets and not assets:super and not assets:stock
$ expenses and not expenses:travel
```

### Comparison
```
$ income,expenses,assets:stocks
$ expenses:food,expenses:fun
```

### Growth
```
$ income
$ assets
$ expenses
```

# Preview
<center style="width: 100%">
  <img width="75%" src="https://thumbs.gfycat.com/PaleHeartfeltLice-size_restricted.gif"/>
</center>

<center style="width: 100%">
  <img width="75%" src="https://thumbs.gfycat.com/InbornRaggedCarpenterant-size_restricted.gif"/>
</center>

# Releases

### 0.1.4a (2018/08/29)
- Growth Chart
  - Fixed position of tooltip hover
  - Added total amont to tooltip
- BugFixes:
  - Fixed `PUBLIC_URL` append on NPM build

### 0.1.3a (2018/08/27)
- Added MIT LICENSE

### 0.1.2a (2018/08/27)
- Bug fixes
  - Fixed `index.html` with weird prefix appending
  - Fixed timeline zoom sync with piechart and overview comments data

### 0.1.1a (2018/08/26)
- Bug fixes
  - Fixed app crash on `asset and not asset:pension` 

### 0.1.0a (2018/08/26)
- First release of ledger-analytics
- Basic features for data visualization

# Development

## Frontend

- [react](https://reactjs.org/)
- [echarts](https://ecomfe.github.io/echarts-examples/public/index.html)

## Backend

- [express](https://expressjs.com/)
- [ledger-cli](https://www.ledger-cli.org/)

```bash
npm run start   # For frontend
npm run express # For backend
```

# Acknowledgements

Icon by [flaticon.com](https://www.flaticon.com)
