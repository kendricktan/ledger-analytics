const util = require('util')
const exec = util.promisify(require('child_process').exec)

// TODO: Make this component composable as opposed to passing in multiple args
// Since most of the arguments are redundant anyway

// Wrapper functions
const cloneInstance = (instance) => {
  return Object.assign(Object.create(Object.getPrototypeOf(instance)), instance)
}

const padSpace = (str) => {
  return str.padStart(str.length + 1, ' ')
}

// Cleans the string so that it removes
// all spaces before and after the string
// then adds a space in front of it
const cleanInput = (str) => {
  return padSpace(str.trim())
}

class LedgerApi {
  constructor () {
    this._file = ``
    this._commodity = ``
    this._period = ``
    this._extraArgs = ``
    this._query = ``

    this.BY_MONTH = 0
    this.BY_DAY = 1
  };

  file (_file) {
    const clone = cloneInstance(this)
    clone._file = cleanInput(_file)
    return clone
  };

  commodity (_commodity = ``) {
    const clone = cloneInstance(this)
    const commodityArg = (_commodity.length > 0) ? `-X` + cleanInput(_commodity) : ``
    clone._commodity = cleanInput(commodityArg)
    return clone
  };

  // Month by default
  period (_period = this.BY_MONTH) {
    const clone = cloneInstance(this)
    const periodType = _period === this.BY_MONTH ? '-M' : '-D'
    clone._period = cleanInput(periodType)
    return clone
  };

  extraArgs (_extraArgs = ``) {
    const clone = cloneInstance(this)
    clone._extraArgs = cleanInput(_extraArgs)
    return clone
  };

  setQuery (_query) {
    const clone = cloneInstance(this)
    clone._query = cleanInput(_query)
    return clone
  };

  async getAccounts (filterExpr = ``) {
    const cleanedFilterExpr = cleanInput(filterExpr)
    const { stdout } = await exec(`ledger accounts -f` + this._file + cleanedFilterExpr + this._extraArgs)

    const accounts = stdout.split('\n').filter(x => x.length > 0)
    return { accounts }
  };

  async getTimeline () {
    // Convert datetime format from:
    /*
    2018-08-17 -63.26
    2018-08-18 -2032.85
    2018-08-20 -32.36
    2018-08-21 -2050.08

    to

    [
      {
        date: [2018/08/17, 2018/08/18, 2018/08/20, 2018/08/21],
        data: [-63.26 ,-2032.85 ,-32.36 ,-2050.08]
      }
    ]
    */

    const { stdout } = await exec(`ledger reg -f` +
      this._file +
      this._query +
      this._commodity +
      ` -j` +
      this._period +
      this._extraArgs +
      ` --collapse` +
      ` --plot-total-format="%(format_date(date, "%Y-%m-%d")) %(abs(quantity(scrub(display_total))))"`.split('\n').join('')
    )

    return stdout
      .split('\n')
      .filter(x => x.length > 0)
      .reduce((obj, x) => {
        const s = x.split(' ')
        const date = s[0].split('-').join('/')
        const data = parseFloat(s[1])

        return {
          date: obj.date.concat([date]),
          data: obj.data.concat([data])
        }
      }, {date: [], data: []})
  };

  async getCommodities () {
    const { stdout } = await exec('ledger commodities -f' + this._file + this._extraArgs)
    const commodities = stdout.split('\n').filter(x => x.length > 0)
    return { commodities }
  };

  async getGrowth () {
    const { stdout } = await exec(`ledger reg -f` +
      this._file +
      this._query +
      this._commodity +
      ` -J -M` +
      this._extraArgs +
      ` --collapse`.split('\n').join('')
    )

    const growth = stdout
      .split('\n')
      .filter(x => x.length > 0)
      .reduce((acc, x) => {
        const xSplit = x.split(' ')
        const date = xSplit[0].split('-').splice(0, 2).join('/')
        const value = parseFloat(xSplit[1])

        acc[date] = value

        return acc
      }, {})
    return { growth }
  };
}

const ledgerApi = new LedgerApi()

module.exports = ledgerApi
