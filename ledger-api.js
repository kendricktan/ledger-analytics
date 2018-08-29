const util = require('util')
const exec = util.promisify(require('child_process').exec)

// TODO: Make this component composable as opposed to passing in multiple args
// Since most of the arguments are redundant anyway

module.exports.getCommodities = async (file, extraArgs = ``) => {
  const { stdout } = await exec('ledger commodities -f ' + file + extraArgs)
  const commodities = stdout.split('\n').filter(x => x.length > 0)
  return commodities
}

// Commodity can be empty
module.exports.getTimelineData = async (file, query, commodity = undefined, byMonth = false, extraArgs = ``) => {
  const commodityArg = (commodity !== undefined) ? ` -X ` + commodity : ``
  const periodType = byMonth ? '-M' : '-D'

  const { stdout } = await exec(`ledger reg -f ` + file + ` ` + query + commodityArg + ` -j ` + periodType + extraArgs + ` --collapse --plot-total-format="%(format_date(date, "%Y-%m-%d")) %(abs(quantity(scrub(display_total))))\n"`)

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

  const timelineData = stdout
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

  return timelineData
}

module.exports.getGrowthData = async (file, query, commodity = undefined, extraArgs = ``) => {
  const commodityArg = (commodity !== undefined) ? ` -X ` + commodity : ``

  const { stdout } = await exec(`ledger reg -f ` + file + ` ` + query + commodityArg + ` -j -M ` + extraArgs + ` --collapse`)
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
  return growth
}

module.exports.getAccounts = async (file, account, extraArgs = ``) => {
  const accountArg = account || ''
  const { stdout } = await exec(`ledger accounts -f ` + file + ' ' + accountArg + extraArgs)
  const accounts = stdout.split('\n').filter(x => x.length > 0)
  return accounts
}
