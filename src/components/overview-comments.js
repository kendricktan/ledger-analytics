import React, { Component } from 'react'
import { Row, Col } from 'react-flexbox-grid'

class OverviewComments extends Component {
  render () {
    return (
      <div style={{borderLeft: '1px solid black', height: '100%', width: '100%', paddingLeft: '20px', verticalAlign: 'middle'}}>
        <Row middle='xs'>
          <Col>
            <p>
          Your largest expenditure: $600, <br />
          which was for xyz <br />
            </p>
            <p>
          You most frequently accessed account: account, <br />
          In total you've payed <strong>xyz</strong> money to that account <br />
            </p>
          </Col>
        </Row>
      </div>
    )
  }
}

export default OverviewComments
