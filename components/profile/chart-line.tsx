import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
  borderWidth:2,
  //   responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false
  },
  stacked: false,
  title: {
    display: false
  },
  plugins: {
    title: {
      display: false,
      text: "数据流量"
    },
    legend:{
      display:false
    }
  },
  scales: {
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
      grid: {
        tickBorderDash:[250,250]
      }

    },
    x:{
      grid: {
        display:false
      }
    },
    y1: {
      type: "linear" as const,
      display: false,
      position: "right" as const,
      grid: {
        drawOnChartArea: false
      }
    }

  }
}

const labels = ["01-01", "01-02", "01-03", "01-04", "01-05", "01-06", "01-07"]

export const data = {
  labels,
  datasets: [
    {
      label: "播放量",
      data: [188, 233, 555, 767, 111, 222, 666],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y"
    }
  ]
}

export default function Page() {
  return <Line options={options} data={data} />
}
