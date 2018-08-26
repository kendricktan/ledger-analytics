import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts'
import { frenchPallate } from './colors'

export default class BarChart extends Component {
  render () {
    const { barData, fetchBarError } = this.props

    // If scatter fetch has an error, its likely
    // because of multiple commodities
    if (fetchBarError !== undefined) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Unable to fetch bar chart data (try changing your base currency/commodity)
        </div>
      )
    }

    if (barData.length === 0 || barData.length === 0) {
      return (
        <div style={{textAlign: 'center', width: '100%'}}>
          Insufficient data to construct bar chart
        </div>
      )
    }

    const posList = [
      'left', 'right', 'top', 'bottom',
      'inside',
      'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
      'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
    ]

    const app = {
      configParameters: {
        rotate: {
          min: -90,
          max: 90
        },
        align: {
          options: {
            left: 'left',
            center: 'center',
            right: 'right'
          }
        },
        verticalAlign: {
          options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
          }
        },
        position: {
          options: echarts.util.reduce(posList, (map, pos) => {
            map[pos] = pos
            return map
          }, {})
        },
        distance: {
          min: 0,
          max: 100
        }
      },
      config: {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15
      }
    }

    const labelOption = {
      normal: {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
          name: {
            textBorderColor: '#fff'
          }
        }
      }
    }

    // Bar Data
    /*
    [
      {
        date: ['2018/06', ...],
        data: [300, ...]
        acc: "name"
      },
      ...
    ]
    */
    const barAccounts = barData.map(x => x.account)

    // Fill out empty data
    // 0. Convert existing data into {date: data} type
    // 1. Get a dict with all dates
    // 2. Fill in the blank dates
    // 3. Convert back from {date: date} to {date:[], data: []}

    // Step 0
    const barDataDict = barData.map(x => {
      return {
        account: x.account,
        data: x.date.reduce((acc, y, idx) => {
          acc[y] = x.data[idx]
          return acc
        }, {})
      }
    })

    // Step 1
    const allDates = barData.reduce((acc, x) => {
      const d2 = x.date.reduce((acc2, y) => {
        acc2[y] = 0
        return acc2
      }, {})

      return Object.assign(d2, acc)
    }, {})

    // Step 2
    const barDataDictFixed = barDataDict.map(x => {
      return {
        account: x.account,
        data: Object.keys(allDates).reduce((acc, d) => {
          acc[d] = x.data[d] || 0
          return acc
        }, {})
      }
    })

    // Step 3
    const datesAscending = Object.keys(allDates).sort()
    const barSeriesData = barDataDictFixed.map(x => {
      return {
        name: x.account,
        type: 'bar',
        barGap: 0,
        label: labelOption,
        data: datesAscending.map(d => x.data[d])
      }
    })

    const option = {
      color: frenchPallate,
      title: {
        text: 'Monthly Comparison Between Accounts',
        x: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: barAccounts,
        top: '10%'
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: {show: false},
          data: datesAscending
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: barSeriesData
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
