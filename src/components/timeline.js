import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts'

class Timeline extends Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      !nextProps.isTyping &&
      nextProps.timelineData !== this.props.timelineData &&
      nextProps.timelineDates !== this.props.timelineDates
    )
  }

  render () {
    const { queryString, timelineData, timelineDates, fetchTimelineError } = this.props

    const option = {
      tooltip: {
        trigger: 'axis',
        position: (pt) => {
          return [pt[0], '10%']
        }
      },
      title: {
        left: 'center',
        text: 'Daily Credit/Debit From Account(s) ' + queryString + '*'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        name: 'Date',
        type: 'category',
        boundaryGap: false,
        data: timelineDates
      },
      yAxis: {
        name: 'Amount (' + this.props.baseCommodity + ')',
        type: 'value',
        boundaryGap: [0, '10%']
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: [
        {
          name: 'Amount',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(255, 70, 131)'
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255, 158, 68)'
              }, {
                offset: 1,
                color: 'rgb(255, 70, 131)'
              }])
            }
          },
          data: timelineData
        }
      ]
    }

    // If timeline fetch has an error, its likely
    // because of multiple commodities
    if (fetchTimelineError !== undefined) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Unable to fetch timeline data (try changing your base currency/commodity)
        </div>
      )
    }

    if (timelineData.length === 0 || timelineDates.length === 0) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Insufficient data to construct Timeline
        </div>
      )
    }

    return (
      <div style={{width: '100%', height: '100%'}}>
        <ReactEcharts
          option={option}
          notMerge
          lazyUpdate
          onEvents={{
            dataZoom: (e) => this.props.updateTimelineZoom(e)
          }}
        />
      </div>
    )
  }
}

export default Timeline
