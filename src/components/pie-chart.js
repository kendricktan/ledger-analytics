import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'

class PieChart extends Component {
  render () {
    const innerdata = ['Apple', 'Banana', 'Oranges', 'Cakes', 'Mint']

    const data = {
      legendData: innerdata,
      selected: innerdata.reduce((pv, cv) => {
        pv[cv] = true
        return pv
      }, {}),
      seriesData: innerdata.map((x) => {
        return {name: x, value: Math.round(Math.random() * 10)}
      })
    }

    const option = {
      title: {
        text: 'QueryText',
        subtext: 'Breakdown',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
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
          name: '姓名',
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
