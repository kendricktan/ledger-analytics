import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import fetch from 'node-fetch'
import assert from 'assert'

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

it('renders charts without crashing', () => {
  const div = document.createElement('div')
  const wrapper = Enzyme.shallow(<App />)

  wrapper.setState({ queryType: '0', queryString: 'expenses', baseCommodity: '$' })
  ReactDOM.render(<App />, div)

  wrapper.setState({ queryType: '1', queryString: 'expenses,assets', baseCommodity: '$' })
  ReactDOM.render(<App />, div)

  wrapper.setState({ queryType: '2', queryString: 'assets', baseCommodity: '$' })
  ReactDOM.render(<App />, div)

  ReactDOM.unmountComponentAtNode(div)
})

it('Get commodity tests', async () => {
  // Commodities
  const { commodities } = await fetch('http://localhost:3000/commodities')
    .then(x => x.json())
  assert.deepEqual(commodities, ['$', 'SNP'])
})

it('Get Account tests', async () => {
  // Accounts
  const correctAccountData = { accounts: [ 'Assets:Bank1', 'Assets:Stocks', 'Expenses:Apps & Games', 'Expenses:Books', 'Expenses:Cash', 'Expenses:Coffee', 'Expenses:Dining Out', 'Expenses:Drinks', 'Expenses:Gadgets', 'Expenses:Gifts', 'Expenses:Groceries', 'Expenses:Rent', 'Expenses:Services and Equipment', 'Expenses:Subscriptions', 'Expenses:Transport', 'Income:Bonus', 'Income:Job' ] }
  const accountData = await fetch('http://localhost:3000/accounts').then(x => x.json())
  assert.deepEqual(correctAccountData, accountData)
})

it('Get timeline tests', async () => {
  // Timeline Data (Day)
  const correctTimelineDayData = {
    data: [ 80, 1103.65, 120, 44, 320.32, 3.65, 322.2, 3.65, 7.99, 23, 100, 48, 3.65, 14, 2, 65, 45, 30, 55, 15, 80, 1103.65, 120, 44, 320.32, 3.65, 822.2, 3.65, 7.99, 13, 120, 44, 5.65, 14, 2, 65, 25, 132 ],
    date: [ '2015/01/01', '2015/01/02', '2015/01/03', '2015/01/04', '2015/01/05', '2015/01/07', '2015/01/12', '2015/01/13', '2015/01/14', '2015/01/15', '2015/01/17', '2015/01/18', '2015/01/19', '2015/01/20', '2015/01/21', '2015/01/22', '2015/01/27', '2015/01/28', '2015/01/29', '2015/01/31', '2015/02/01', '2015/02/02', '2015/02/03', '2015/02/04', '2015/02/05', '2015/02/07', '2015/02/12', '2015/02/13', '2015/02/14', '2015/02/15', '2015/02/17', '2015/02/18', '2015/02/19', '2015/02/20', '2015/02/21', '2015/02/22', '2015/02/27', '2015/02/28' ]
  }
  const timelineDayData = await fetch('http://localhost:3000/timeline/$?query=expenses').then(x => x.json())
  assert.deepEqual(timelineDayData, correctTimelineDayData)

  // Timeline Data (Month)
  const correctTimelineMonthData = {
    data: [ 2406.11, 2926.11 ],
    date: [ '2015/01/01', '2015/02/01' ]
  }
  const timelineMonthData = await fetch('http://localhost:3000/timeline/$?type=month&query=expenses').then(x => x.json())
  assert.deepEqual(timelineMonthData, correctTimelineMonthData)
})

it('Get growth tests', async () => {
  // Growth Data
  const correctGrowthData = { growth: { '2015/01': 1093.89, '2015/02': 2573.89 } }
  const growthData = await fetch(`http://localhost:3000/growth/$?query=assets`).then(x => x.json())
  assert.deepEqual(growthData, correctGrowthData)
})
