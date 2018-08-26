#!/usr/bin/env node

const path = require('path')
const express = require('express')
const pkg = require(path.join(__dirname, 'package.json'))
const app = express()
const cors = require('cors')
const analyze = require('./analyze')
const port = 3000
const program = require('commander')

// CLI Args
program
  .version(pkg.version)
  .option('-f, --file <*.journal>', 'Journal file location')
  .parse(process.argv)

if (program.file === undefined) {
  console.log('Usage example:')
  console.log('ledger-analytics -f <ledger file location>')
  process.exit(-1)
}

// REST API

// Enable CORS
app.use(cors())

// Serve frontend
app.use('/', express.static(path.join(__dirname, 'build')))

// Get number of commodities
app.get('/commodities', async (req, res, next) => {
  try {
    const commodities = await analyze.getCommodities(program.file)
    res.json({commodities})
  } catch (e) {
    next(e)
  }
})

// Get accounts
app.get('/accounts', async (req, res, next) => {
  try {
    const accounts = await analyze.getAccounts(program.file, req.query.account)
    res.json({accounts})
  } catch (e) {
    next(e)
  }
})

// Get timeline data
app.get('/timeline/:account/:commodity?', async (req, res, next) => {
  try {
    const { commodity, account } = req.params
    const { data, date } = await analyze.getTimelineData(program.file, account, commodity)
    res.json({data, date})
  } catch (e) {
    next(e)
  }
})

app.listen(3000)

console.log('ledger-analytics is running on port ' + port)
