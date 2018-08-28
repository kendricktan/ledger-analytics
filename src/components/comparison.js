import React, { Component } from 'react'
import { Row } from 'react-flexbox-grid'

import BarChart from './charts/bar-chart'

class Comparison extends Component {
  render () {
    return (
      <Row>
        <BarChart {...this.props} />
      </Row>
    )
  }
}

export default Comparison
