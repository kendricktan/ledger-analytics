import React, { Component } from 'react'
import { frenchPallate } from './colors'
import ReactEcharts from 'echarts-for-react'

export default class StackedArea extends Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      !nextProps.isTyping &&
      nextProps.growthData !== this.props.growthData &&
      nextProps.growthAccounts !== this.props.growthAccounts
    )
  }

  render () {
    // Reusing data from scatter plots (just xforming them more)
    const { queryString, baseCommodity, growthAccounts, growthData, fetchGrowthError } = this.props

    // If comma in queryString then ask them to remove it
    if (queryString.indexOf(',') !== -1) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Please remove the comma. The comma is only used in `Comparison` mode.
        </div>
      )
    }

    // If scatter fetch has an error, its likely
    // because of multiple commodities
    if (fetchGrowthError !== undefined) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Unable to fetch stacked area chart data (try changing your base currency/commodity)
        </div>
      )
    }

    if (growthAccounts.length === 0 || growthAccounts.length === 0) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Insufficient data to construct stacked area
        </div>
      )
    }

    // Growth data is in format
    /*
    [
      { growth: {2018/02: 400, 2018/03: 500} },
      { growth: {2018/03: 500} }
    ]

    Want

    [
      [400, 500]
      [0, 500]
    ]
    */

    // Need to fill in empty dates
    // Start by finding all dates
    const allDates = growthData.reduce((acc, x) => {
      // In-place mutation. Ugh
      Object.keys(x.growth).map(k => {
        acc[k] = 0
        return 0
      })

      return acc
    }, {})

    // Fill in empty dates
    const stackedDataFixed = growthData.map(x => {
      return Object.keys(allDates).reduce((acc, k) => {
        acc[k] = x.growth[k] || allDates[k]
        return acc
      }, {})
    })

    // Convert to series data
    const dateSorted = Object.keys(allDates).sort()
    const stackedSeriesData = stackedDataFixed.map((x, idx) => {
      return {
        name: growthAccounts[idx],
        type: 'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data: dateSorted.map(y => stackedDataFixed[idx][y].toFixed(2))
      }
    })

    const option = {
      color: frenchPallate,
      title: {
        text: 'Monthly Growth'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#000'
          }
        }
      },
      legend: {
        data: growthAccounts
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: dateSorted
        }
      ],
      yAxis: [
        {
          name: 'Value (' + baseCommodity + ')',
          type: 'value'
        }
      ],
      series: stackedSeriesData
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
