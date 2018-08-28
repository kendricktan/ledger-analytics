import React, { Component } from 'react'
import { Row, Col } from 'react-flexbox-grid'

class OverviewComments extends Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      (
        !nextProps.isTyping &&
        nextProps.scatterData !== this.props.scatterData &&
        nextProps.scatterAccounts !== this.props.scatterAccounts
      ) ||
      nextProps.timelineEndDate !== this.props.timelineEndDate ||
      nextProps.timelineStartDate !== this.props.timelineStartDate
    )
  }

  render () {
    // Reusing data from scatter plots (just xforming them more)
    const { timelineDates, timelineStartDate, timelineEndDate, baseCommodity, scatterData, scatterAccounts, fetchScatterError } = this.props

    // If scatter fetch has an error, its likely
    // because of multiple commodities
    if (fetchScatterError !== undefined) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Unable to fetch comments (try changing your base currency/commodity)
        </div>
      )
    }

    if (scatterAccounts.length === 0 || scatterAccounts.length === 0 || timelineDates.length === 0) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Insufficient data to construct comments
        </div>
      )
    }

    // Get most frequently access account
    const mostFrequent = scatterData.reduce((acc, cur, idx) => {
      const curFixed = scatterData[idx].filter((arr) => {
        return arr[2] >= timelineStartDate && arr[2] <= timelineEndDate
      })

      // More frequently accessed account
      if (curFixed.length > acc.frequency) {
        const spentOnAccount = curFixed.reduce((s, c) => s + c[1], 0).toFixed(2)
        return {
          accName: curFixed[0][3],
          spentOnAccount,
          frequency: curFixed.length
        }
      }
      return acc
    }, {frequency: 0})

    // Get largest transaction
    // Get most frequently access account
    const largestTransaction = scatterData.reduce((acc, cur, idx) => {
      const curFixed = scatterData[idx].filter((arr) => {
        return arr[2] >= timelineStartDate && arr[2] <= timelineEndDate
      })

      // Get largest within array
      const curLargest = curFixed.reduce((acc2, cur2, idx2) => {
        if (cur2[1] > acc2[1]) {
          return cur2
        }
        return acc2
      }, [0, 0])

      // More frequently accessed account
      if (curLargest[1] > acc.value) {
        return {
          accName: curLargest[3],
          value: curLargest[1].toFixed(2),
          date: curLargest[2].toDateString()
        }
      }
      return acc
    }, {value: 0})

    return (
      <div style={{borderLeft: '1px solid black', height: '100%', width: '100%', paddingLeft: '20px', verticalAlign: 'middle'}}>
        <Row middle='xs'>
          <Col>
            <p>
              <strong>{baseCommodity} {largestTransaction.value}</strong> (<strong>{largestTransaction.accName}</strong>) was your largest transaction, which was&nbsp;
              transacted on <strong>{largestTransaction.date}</strong>
            </p>
            <p>
              <strong>{mostFrequent.accName}</strong> is your most frequently accessed account.&nbsp;
              <strong>{baseCommodity} {mostFrequent.spentOnAccount}</strong> has been paid to that account across&nbsp;
              <strong>{mostFrequent.frequency}</strong> transactions.
            </p>
          </Col>
        </Row>
      </div>
    )
  }
}

export default OverviewComments
