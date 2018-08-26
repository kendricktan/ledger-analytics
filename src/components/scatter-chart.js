import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'

class ScatterChart extends Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      (
        !nextProps.isTyping &&
        nextProps.scatterData !== this.props.scatterData &&
        nextProps.scatterAccounts !== this.props.scatterAccounts
      ) ||
      nextProps.timelineZoomEnd !== this.props.timelineZoomEnd ||
      nextProps.timelineZoomStart !== this.props.timelineZoomStart
    )
  }

  render () {
    const { timelineDates, timelineZoomStart, timelineZoomEnd, baseCommodity, scatterData, scatterAccounts, fetchScatterError } = this.props

    const itemStyle = {
      normal: {
        opacity: 0.8
      }
    }

    const series = scatterAccounts.map((acc, idx) => {
      const dateLength = timelineDates.length

      // Make scatter plot representative of timeline zoom
      const startIndex = parseInt(timelineZoomStart * dateLength / 100) - 1
      const startDateParts = timelineDates[Math.max(0, startIndex)].split('/')

      const endIndex = parseInt(timelineZoomEnd * dateLength / 100) - 1
      const endDateParts = timelineDates[Math.max(0, endIndex)].split('/')

      const startDate = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2])
      const endDate = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2])

      // scatterData[idx] is of type
      /*
      [
        [x, y, Date, account],
        [x, y, Date, account],
        [x, y, Date, account],
        [x, y, Date, account],
      ]
      */
      const scatterDataWithinRange = scatterData[idx].filter((arr) => {
        return arr[2] >= startDate && arr[2] <= endDate
      })

      return {
        name: acc,
        type: 'scatter',
        itemStyle: itemStyle,
        data: scatterDataWithinRange
      }
    })

    const option = {
      legend: {
        y: 'top',
        data: scatterAccounts,
        textStyle: {
          color: '#000',
          fontSize: 16
        }
      },
      grid: {
        x: '10%',
        x2: 150,
        y: '18%',
        y2: '10%'
      },
      tooltip: {
        padding: 10,
        backgroundColor: '#222',
        borderColor: '#777',
        borderWidth: 1,
        formatter: (obj) => {
          var value = obj.value
          return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                    obj.seriesName +
                    '</div>' +
                    value[2].toDateString() + '<br>' +
                    baseCommodity + ' ' + value[1] + '<br>'
        }
      },
      xAxis: {
        type: 'category',
        name: 'Days',
        nameGap: 1,
        nameTextStyle: {
          color: '#000',
          fontSize: 14
        },
        max: 6,
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#000'
          }
        },
        data: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ]
      },
      yAxis: {
        type: 'value',
        name: 'Amount (' + baseCommodity + ')',
        nameLocation: 'end',
        nameGap: 20,
        nameTextStyle: {
          color: '#000',
          fontSize: 16
        },
        axisLine: {
          lineStyle: {
            color: '#000'
          }
        },
        splitLine: {
          show: false
        }
      },
      series: series
    }

    // If scatter fetch has an error, its likely
    // because of multiple commodities
    if (fetchScatterError !== undefined) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Unable to fetch Scatter data (try changing your base currency/commodity)
        </div>
      )
    }

    if (scatterAccounts.length === 0 || scatterAccounts.length === 0) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Insufficient data to construct ScatterPlot
        </div>
      )
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

export default ScatterChart
