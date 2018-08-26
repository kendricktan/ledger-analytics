import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'
import fetch from 'node-fetch'

import ScatterChart from './components/scatter-chart'
import PieChart from './components/pie-chart'
import Timeline from './components/timeline'
import OverviewComments from './components/overview-comments'

import './App.css'

const TYPING_INTERVAL = 1000

const OVERVIEW = '0'
const COMPARISON = '1'
const GROWTH = '2'

class QueryBox extends Component {
  // Different hints for different types
  getPlaceholderText = () => {
    switch (this.props.queryType) {
      case OVERVIEW:
        return 'assets:bank1'

      case COMPARISON:
        return 'assets,expenses,...'

      case GROWTH:
        return 'assets:bank2'

      default:
        return 'Unknown Input Type'
    }
  }

  handleQuerying = (e) => {
    this.props.updateIsTyping(true)
    clearTimeout(this.timer)

    // Thanks JavaScript
    const v = e.target.value

    this.timer = setTimeout(() => {
      this.props.updateQueryString({target: {value: v}})
      this.props.updateIsTyping(false)
    }, TYPING_INTERVAL)
  }

  render () {
    // 1. Overview is a simple area chart with assets/expenses trending over time
    // (should be able to click n zoom) (With a sunburst at the bottom)
    // (and a heatmap showing what days you're more likely to spend at the bottom)
    // 2. Comparison is a Bar chart with comparison between two items (e.g. assets vs expenses)
    // 3. Growth is stacked area chart (wealth growth)
    const placeholderText = this.getPlaceholderText()

    return (
      <Col xs={10}>
        <input style={{width: '65%'}}
          placeholder={placeholderText}
          onChange={this.handleQuerying}
        />&nbsp;&nbsp;
        <select style={{width: '15%'}} onChange={this.props.updateQueryType}>
          <option value={OVERVIEW}>Overview</option>
          <option value={COMPARISON}>Comparison</option>
          <option value={GROWTH}>Growth</option>
        </select>
        &nbsp;
        { this.props.commodities.length > 0
          ? (
            <select style={{width: '10%'}} onChange={this.props.updateBaseCommodity}>
              {
                this.props.commodities.map(x => <option key={x} value={x}>{x}</option>)
              }
            </select>
          ) : <div />
        }
      </Col>
    )
  }
}

class Overview extends Component {
  render () {
    return (
      <div>
        <Row>
          <Timeline {...this.props} updateTimelineZoom={this.props.updateTimelineZoom} />
        </Row>
        <Row>
          <ScatterChart {...this.props} />
        </Row>
        <Row>
          <Col xs={7}>
            <PieChart />
          </Col>
          <Col xs={5}>
            <OverviewComments />
          </Col>
        </Row>
      </div>
    )
  }
}

class App extends Component {
  state = {
    // QueryBox
    queryString: '',
    queryType: OVERVIEW,
    commodities: [],
    baseCommodity: undefined,
    isTyping: false,

    // Timeline
    timelineZoomStart: 0,
    timelineZoomEnd: 100,
    timelineData: [],
    timelineDates: [],
    fetchTimelineError: undefined,

    // Scatter Chart
    scatterAccounts: [],
    scatterData: [],
    fetchScatterError: undefined
  };

  componentDidMount = () => {
    // On mount, fetch a list of base commodities
    fetch(`http://127.0.0.1:3000/commodities`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          commodities: json.commodities,
          baseCommodity: json.commodities.length > 0 ? json.commodities[0] : undefined
        })
      })
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    const { queryString, baseCommodity } = this.state

    // Update component only if queryString is not ''
    if (queryString === undefined || queryString.length === 0) {
      return
    }

    // And if queryString/baseCommodity has changed
    if (queryString === prevState.queryString && baseCommodity === prevState.baseCommodity) {
      return
    }

    const commodityArg = (baseCommodity !== undefined ? `/` + baseCommodity : '')

    // Fetches timeline data
    // Commodity can be defined if user only has one commodity
    fetch(`http://localhost:3000/timeline/` + queryString + commodityArg)
      .then(x => x.json())
      .then(json => {
        this.setState({
          timelineData: json.data,
          timelineDates: json.date,
          fetchTimelineError: undefined
        })
      })
      .catch(e => {
        this.setState({timelineDates: [], timelineData: [], fetchTimelineError: e})
      })

    // Fetches Scatter Chart Data
    let accounts = []
    fetch(`http://localhost:3000/accounts?account=` + queryString)
      .then(x => x.json())
      .then(json => {
        // Some mutation, but ceebs
        accounts = json.accounts
        // Map everything to a promise
        // Then execute everything concurrently
        const promises = json.accounts.map((x) => {
          return fetch(`http://localhost:3000/timeline/` + x + commodityArg)
            .then(x => x.json())
        })

        return Promise.all(promises)
      })
      .then(timelineDataArray => {
        /* We get:

        accounts: ["Account1:Type", "Account2:Type" ... ]
        values : [
          { data: [amount1, amount2...], date: [2018/08/1, 2018/08/2 ...] }
        ]

        Want:

        [
          [(day), (amount), Date(2018/08/01), "Account1:Type"],
          [(day), (amount), Date(2018/08/02), "Account2:Type"],
        ]
        */

        const formattedData = timelineDataArray.map((timelineData, idx) => {
          const dates = timelineData.date.map((d) => {
            const dateParts = d.split('/')
            // JavaScript counts months from 0, go figure
            return new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
          })
          const days = dates.map(x => x.getDay())
          const data = timelineData.data
          const account = accounts[idx]

          return days.map((x, idx) => [x, data[idx], dates[idx], account])
        })

        this.setState({
          scatterAccounts: accounts,
          scatterData: formattedData,
          fetchScatterError: undefined
        })
      })
      .catch((e) => {
        this.setState({
          scatterAccounts: [],
          scatterData: [],
          fetchScatterError: e
        })
      })
  }

  updateQueryString = (e) => {
    this.setState({queryString: e.target.value})
  }

  updateQueryType = (e) => {
    this.setState({queryType: e.target.value})
  }

  updateBaseCommodity = (e) => {
    this.setState({baseCommodity: e.target.value})
  }

  updateIsTyping = (b) => {
    this.setState({isTyping: b})
  }

  updateTimelineZoom = (obj) => {
    this.setState({
      timelineZoomStart: obj.start,
      timelineZoomEnd: obj.end
    })
  }

  getInnerContent = () => {
    const str = this.state.isTyping ? 'Loading...' : 'Enter an account in the searchbar to get started'

    if (this.state.queryString.length === 0) {
      return (
        <Row center='xs'>
          <Col>
            {str}
          </Col>
        </Row>
      )
    }

    switch (this.state.queryType) {
      case OVERVIEW:
        return <Overview {...this.state} updateTimelineZoom={this.updateTimelineZoom} />
      default:
        return (
          <Row center='xs'>
            <Col xs='6'>
              Unimplemented
            </Col>
          </Row>
        )
    }
  }

  render () {
    return (
      <Grid>
        <Row center='xs'>
          <QueryBox
            {...this.state}
            updateQueryString={this.updateQueryString}
            updateQueryType={this.updateQueryType}
            updateBaseCommodity={this.updateBaseCommodity}
            updateIsTyping={this.updateIsTyping}
          />
        </Row>
        {
          this.getInnerContent()
        }
        <Row center='xs'>
          <hr style={{width: '85%'}} />
          {
            <div style={{textAlign: 'center', padding: '20px', width: '100%'}}>
              Made by <a href='https://kndrck.co'>Kendrick Tan</a> | <a href='https://github.com/kendricktan/ledger-analytics'>Source Code</a> | MIT Licensed
            </div>
          }
        </Row>
      </Grid>
    )
  }
}

export default App
