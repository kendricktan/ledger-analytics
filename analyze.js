const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports.getCommodities = async (file) => {
  const { stdout } = await exec('ledger -f ' + file + ' commodities')
  const commodities = stdout.split('\n').filter(x => x.length > 0)
  return commodities
}

// Commodity can be empty
module.exports.getTimelineData = async (file, account, commodity = undefined, byMonth = false) => {
  const commodityArg = (commodity !== undefined) ? ` -X ` + commodity : ``
  const byLengthArgs = byMonth ? '-M' : '-D'
  const { stdout } = await exec(`ledger -f ` + file + commodityArg + ` -j reg "` + account + `" ` + byLengthArgs + ` --collapse --plot-total-format="%(format_date(date, "%Y-%m-%d")) %(abs(quantity(scrub(display_total))))\n"`)
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

module.exports.getAccounts = async (file, account) => {
  const accountArg = account === undefined ? '' : account
  const { stdout } = await exec(`ledger -f ` + file + ' accounts ' + accountArg)
  const accounts = stdout.split('\n').filter(x => x.length > 0)
  return accounts
}

module.exports.getGrowth = async (file, account, commodity = undefined) => {
  const commodityArg = (commodity !== undefined) ? ` -X ` + commodity : ``

  const { stdout } = await exec(`ledger -f ` + file + ` ` + commodityArg + ` -J reg "` + account + `" -M --collapse`)
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
