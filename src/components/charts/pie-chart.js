import React, { Component } from 'react'
import { frenchPallate } from './colors'
import ReactEcharts from 'echarts-for-react'

class PieChart extends Component {
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
    const { queryString, timelineDates, timelineStartDate, timelineEndDate, baseCommodity, scatterData, scatterAccounts, fetchScatterError } = this.props

    // If scatter fetch has an error, its likely
    // because of multiple commodities
    if (fetchScatterError !== undefined) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Unable to fetch pie chart data (try changing your base currency/commodity)
        </div>
      )
    }

    if (scatterAccounts.length === 0 || scatterAccounts.length === 0 || timelineDates.length === 0) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Insufficient data to construct PieChart
        </div>
      )
    }

    const data = {
      legendData: scatterAccounts,
      selected: scatterAccounts.reduce((pv, cv) => {
        pv[cv] = true
        return pv
      }, {}),
      seriesData: scatterAccounts.map((x, idx) => {
        const sumOfDataWithinRange = scatterData[idx].filter((arr) => {
          return arr[2] >= timelineStartDate && arr[2] <= timelineEndDate
        }).reduce((acc, obj) => acc + Math.abs(obj[1]), 0)

        if (sumOfDataWithinRange <= 0) {
          return {}
        }

        return {name: x, value: sumOfDataWithinRange.toFixed(2)}
      }).filter(x => Object.keys(x).length > 0)
    }

    const option = {
      title: {
        text: queryString,
        subtext: 'Transaction Breakdown',
        x: 'center'
      },
      color: frenchPallate,
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>' + baseCommodity + ': {c} ({d}%)'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: data.legendData,

        selected: data.selected
      },
      series: [
        {
          name: 'Account',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: data.seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    return (
      <div style={{width: '100%', height: '100%'}}>
        <ReactEcharts
          option={option}
          notMerge
          lazyUpdate
        />
      </div>
    )
  }
}

export default PieChart
