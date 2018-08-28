import React, { Component } from 'react'
import { Row, Col } from 'react-flexbox-grid'

import ScatterChart from './charts/scatter-chart'
import PieChart from './charts/pie-chart'
import Timeline from './charts/timeline'
import OverviewComments from './charts/overview-comments'

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
            <PieChart {...this.props} />
          </Col>
          <Col xs={5}>
            <OverviewComments {...this.props} />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Overview
