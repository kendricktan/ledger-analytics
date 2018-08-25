import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'

import ScatterChart from './components/scatter-chart'
import PieChart from './components/pie-chart'
import Timeline from './components/timeline'
import OverviewComments from './components/overview-comments'

import './App.css'

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

  render () {
    // 1. Overview is a simple area chart with assets/expenses trending over time
    // (should be able to click n zoom) (With a sunburst at the bottom)
    // (and a heatmap showing what days you're more likely to spend at the bottom)
    // 2. Comparison is a Bar chart with comparison between two items (e.g. assets vs expenses)
    // 3. Growth is stacked area chart (wealth growth)
    const placeholderText = this.getPlaceholderText()

    return (
      <Col xs={10}>
        <input style={{width: '75%'}}
          placeholder={placeholderText}
          onChange={this.props.updateQueryString}
        />&nbsp;&nbsp;
        <select style={{width: '20%'}} onChange={this.props.updateQueryType}>
          <option value={OVERVIEW}>Overview</option>
          <option value={COMPARISON}>Comparison</option>
          <option value={GROWTH}>Growth</option>
        </select>
      </Col>
    )
  }
}

class Overview extends Component {
  render () {
    return (
      <div>
        <Row>
          <Timeline />
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
    baseCommodity: 'AUD'
  };

  updateQueryString = (e) => {
    this.setState({queryString: e.target.value})
  }

  updateQueryType = (e) => {
    this.setState({queryType: e.target.value})
  }

  getInnerContent = () => {
    switch (this.state.queryType) {
      case OVERVIEW:
        return <Overview />
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
          />
        </Row>
        {
          this.getInnerContent()
        }
        <Row>
          <hr style={{width: '85%'}} />
          {
            <div style={{textAlign: 'center', padding: '20px', width: '100%'}}>
              Made by <a href='https://kndrck.co'>Kendrick Tan</a> | <a href='#'>Source Code</a> | MIT Licensed
            </div>
          }
        </Row>
      </Grid>
    )
  }
}

export default App
