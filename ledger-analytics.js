#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const express = require('express')
const pkg = require(path.join(__dirname, 'package.json'))
const app = express()
const cors = require('cors')
const ledgerApi = require('./ledger-api') // TODO: Make Api composable
const port = 3000
const program = require('commander')

// CLI Args
program
  .version(pkg.version)
  .allowUnknownOption()
  .option('-f, --file <*.journal>', 'Journal file location')
  .parse(process.argv)

if (program.file === undefined) {
  console.log('Usage example:')
  console.log('ledger-analytics -f <ledger file location> <additional args for ledger-cli>')
  process.exit(-1)
}

// Check if file exists
if (!fs.existsSync(program.file)) {
  console.log('File supplied does not exist!')
  process.exit(-1)
}

// Get additional args for ledger CLI
const additionalLedgerArgs = process.argv.slice(4).reduce((acc, c) => acc + ' ' + c, '')

// REST API

// Enable CORS
app.use(cors())

// Serve frontend
app.use('/', express.static(path.join(__dirname, 'frontend')))

// Get number of commodities
app.get('/commodities', async (req, res, next) => {
  try {
    const commodities = await ledgerApi.getCommodities(program.file, additionalLedgerArgs)
    res.json({commodities})
  } catch (e) {
    next(e)
  }
})

// Get accounts
app.get('/accounts', async (req, res, next) => {
  try {
    const accounts = await ledgerApi.getAccounts(program.file, req.query.account, additionalLedgerArgs)
    res.json({accounts})
  } catch (e) {
    next(e)
  }
})

// Get timeline data
app.get('/timeline/:commodity?', async (req, res, next) => {
  try {
    const { commodity } = req.params
    const query = req.query.query
    const byMonth = (req.query.type || '').toLowerCase() === 'month'
    const { data, date } = await ledgerApi.getTimelineData(program.file, query, commodity, byMonth, additionalLedgerArgs)
    res.json({data, date})
  } catch (e) {
    next(e)
  }
})

// Get growth data
app.get('/growth/:commodity?', async (req, res, next) => {
  try {
    const { commodity } = req.params
    const query = req.query.query
    const growth = await ledgerApi.getGrowthData(program.file, query, commodity, additionalLedgerArgs)
    res.json({growth})
  } catch (e) {
    next(e)
  }
})

app.listen(3000)

console.log('ledger-analytics is running on port ' + port)
