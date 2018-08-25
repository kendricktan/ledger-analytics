import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'

class ScatterChart extends Component {
  render () {
    var dataBJ = [
      [1, 55, 'Expenses:Fees'],
      [2, 25, 'Expenses:Fees'],
      [3, 56, 'Expenses:Fees'],
      [4, 33, 'Expenses:Fees'],
      [5, 42, 'Expenses:Fees'],
      [6, 82, 'Expenses:Fees'],
      [6, 74, 'Expenses:Fees'],
      [1, 78, 'Expenses:Fees'],
      [1, 267, 'Expenses:Fees'],
      [1, 185, 'Expenses:Fees'],
      [1, 39, 'Expenses:Fees'],
      [1, 41, 'Expenses:Fees'],
      [1, 64, 'Expenses:Fees'],
      [1, 108, 'Expenses:Fees'],
      [1, 108, 'Expenses:Fees'],
      [1, 33, 'Expenses:Fees'],
      [1, 94, 'Expenses:Fees'],
      [1, 186, 'Expenses:Fees'],
      [1, 57, 'Expenses:Fees'],
      [2, 22, 'Expenses:Fees'],
      [2, 39, 'Expenses:Fees'],
      [2, 94, 'Expenses:Fees'],
      [2, 99, 'Expenses:Fees'],
      [2, 31, 'Expenses:Fees'],
      [2, 42, 'Expenses:Fees'],
      [2, 154, 'Expenses:Fees'],
      [2, 234, 'Expenses:Fees'],
      [2, 160, 'Expenses:Fees'],
      [2, 134, 'Expenses:Fees'],
      [3, 52, 'Expenses:Fees'],
      [3, 46, 'Expenses:Fees']
    ]

    var dataGZ = [
      [1, 26, 'Expenses:Hotdogs'],
      [2, 85, 'Expenses:Hotdogs'],
      [3, 78, 'Expenses:Hotdogs'],
      [4, 21, 'Expenses:Hotdogs'],
      [5, 41, 'Expenses:Hotdogs'],
      [6, 56, 'Expenses:Hotdogs'],
      [6, 64, 'Expenses:Hotdogs'],
      [2, 55, 'Expenses:Hotdogs'],
      [4, 76, 'Expenses:Hotdogs'],
      [1, 91, 'Expenses:Hotdogs'],
      [1, 84, 'Expenses:Hotdogs'],
      [1, 64, 'Expenses:Hotdogs'],
      [1, 70, 'Expenses:Hotdogs'],
      [1, 77, 'Expenses:Hotdogs'],
      [0, 109, 'Expenses:Hotdogs'],
      [0, 73, 'Expenses:Hotdogs'],
      [0, 54, 'Expenses:Hotdogs'],
      [0, 51, 'Expenses:Hotdogs'],
      [0, 91, 'Expenses:Hotdogs'],
      [2, 73, 'Expenses:Hotdogs'],
      [2, 73, 'Expenses:Hotdogs'],
      [2, 84, 'Expenses:Hotdogs'],
      [2, 93, 'Expenses:Hotdogs'],
      [2, 99, 'Expenses:Hotdogs'],
      [2, 146, 'Expenses:Hotdogs'],
      [2, 113, 'Expenses:Hotdogs'],
      [2, 81, 'Expenses:Hotdogs'],
      [2, 56, 'Expenses:Hotdogs'],
      [2, 82, 'Expenses:Hotdogs'],
      [3, 106, 'Expenses:Hotdogs'],
      [3, 118, 'Expenses:Hotdogs']
    ]

    var dataSH = [
      [1, 91, 'Assets:Gold'],
      [2, 65, 'Assets:Gold'],
      [3, 83, 'Assets:Gold'],
      [4, 109, 'Assets:Gold'],
      [5, 106, 'Assets:Gold'],
      [6, 109, 'Assets:Gold'],
      [6, 106, 'Assets:Gold'],
      [6, 89, 'Assets:Gold'],
      [2, 53, 'Assets:Gold'],
      [1, 80, 'Assets:Gold'],
      [1, 117, 'Assets:Gold'],
      [1, 99, 'Assets:Gold'],
      [1, 95, 'Assets:Gold'],
      [1, 116, 'Assets:Gold'],
      [1, 108, 'Assets:Gold'],
      [1, 134, 'Assets:Gold'],
      [1, 79, 'Assets:Gold'],
      [1, 71, 'Assets:Gold'],
      [1, 97, 'Assets:Gold'],
      [2, 84, 'Assets:Gold'],
      [2, 87, 'Assets:Gold'],
      [2, 104, 'Assets:Gold'],
      [2, 105, 'Assets:Gold,'],
      [2, 168, 'Assets:Gold'],
      [2, 65, 'Assets:Gold'],
      [2, 39, 'Assets:Gold'],
      [2, 39, 'Assets:Gold'],
      [2, 93, 'Assets:Gold'],
      [2, 188, 'Assets:Gold'],
      [3, 174, 'Assets:Gold'],
      [3, 187, 'Assets:Gold']
    ]

    const itemStyle = {
      normal: {
        opacity: 0.8
      }
    }

    const option = {
      color: [
        '#dd4444', '#fec42c', '#80F1BE'
      ],
      legend: {
        y: 'top',
        data: ['Assets:Bank1', 'Assets:Bank2', 'Assets:Gold'],
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
                    obj.seriesName + ' ' + value[0] + '日' +
                    '</div>' +
                    value[2] + '<br>'
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
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ]
      },
      yAxis: {
        type: 'value',
        name: 'Amount',
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
      series: [
        {
          name: 'Assets:Bank1',
          type: 'scatter',
          itemStyle: itemStyle,
          data: dataBJ
        },
        {
          name: 'Assets:Bank2',
          type: 'scatter',
          itemStyle: itemStyle,
          data: dataSH
        },
        {
          name: 'Assets:Gold',
          type: 'scatter',
          itemStyle: itemStyle,
          data: dataGZ
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

export default ScatterChart
