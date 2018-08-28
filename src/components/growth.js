import React, { Component } from 'react'
import { Row } from 'react-flexbox-grid'

import StackedArea from './charts/stacked-area'

class Growth extends Component {
  render () {
    return (
      <Row>
        <StackedArea {...this.props} />
      </Row>
    )
  }
}

export default Growth
