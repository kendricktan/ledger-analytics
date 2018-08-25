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
  state = {
    commodities: [],
    typingTimer: undefined
  }

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

  // Get different commodities
  componentDidMount = () => {
    fetch(`http://127.0.0.1:3000/commodities`)
      .then(res => res.json())
      .then(json => {
        const c = json.commodities.length > 0 ? json.commodities[0] : undefined

        this.setState({ commodities: json.commodities })
        this.props.updateBaseCommodity({target: {value: c}})
      })
  }

  handleQuerying = (e) => {
    clearTimeout(this.timer)

    // Thanks JavaScript
    const v = e.target.value

    this.timer = setTimeout(() => {
      this.props.updateQueryString({target: {value: v}})
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
        { this.state.commodities.length > 0
          ? (
            <select style={{width: '10%'}} onChange={this.props.updateBaseCommodity}>
              {
                this.state.commodities.map(x => <option key={x} value={x}>{x}</option>)
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
          <Timeline {...this.props} />
        </Row>
        <Row>
          <ScatterChart />
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
    queryString: '',
    queryType: OVERVIEW,
    baseCommodity: undefined
  };

  updateQueryString = (e) => {
    this.setState({queryString: e.target.value})
  }

  updateQueryType = (e) => {
    this.setState({queryType: e.target.value})
  }

  updateBaseCommodity = (e) => {
    this.setState({baseCommodity: e.target.value})
  }

  getInnerContent = () => {
    switch (this.state.queryType) {
      case OVERVIEW:
        return <Overview {...this.state} />
      default:
        return <div>Unimplmented</div>
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
          />
        </Row>
        {
          this.getInnerContent()
        }
        <Row>
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
