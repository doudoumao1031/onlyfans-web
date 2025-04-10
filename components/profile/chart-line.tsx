import React from "react"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
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

export const options: ChartOptions<"line"> & { borderWidth: number } = {
  borderWidth: 2,
  //   responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false
  },
  // stacked: false,
  // title: {
  //   display: false
  // },
  plugins: {
    title: {
      display: false,
      text: "数据流量"
    },
    legend: {
      display: false
    },
    tooltip: {
      enabled: true, // 启用 tooltip
      usePointStyle: true,
      // displayColors: true, // 是否显示颜色方块
      backgroundColor: "rgba(0, 0, 0, 0.6)", // tooltip 背景颜色
      titleColor: "#fff", // 标题文字颜色
      bodyColor: "#fff", // 内容文字颜色
      // borderColor: "rgba(75, 192, 192, 1)", // 边框颜色
      // borderWidth: 0, // 边框宽度
      padding: { top: 5, right: 10, bottom: 5, left: 10 }, // 内边距
      // caretSize: 8, // 提示箭头的尺寸
      boxWidth: 4, // 提示框内指示点的宽度
      boxHeight: 4, // 提示框内指示点的高度
      bodyFont: {
        size: 12// 提示框字体大小
      },
      callbacks: {
        labelColor: () => {
          return {
            borderColor: "#00aef3",
            backgroundColor: "#00aef3" // 颜色方块的背景颜色
            // borderWidth: 0, // 颜色方块的边框宽度
            // borderRadius: 1, // 颜色方块的圆角半径
            // width: 1, // 方块宽度（默认是 10）
            // height: 1 // 方块高度（默认是 10）
          }
        }
      }
    }
  },
  scales: {
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
      grid: {
        tickBorderDash: [250, 250]
      },
      min: 0, // 设置 Y 轴的最小值
      // max: 100, // 设置 Y 轴的最大值
      ticks: {
        // stepSize: 20, // 设置默认步长为 5
        precision: 0 // 确保刻度值不显示小数
        // callback: (value: number) => {
        //   // 前两个刻度（0 和 5）显示
        //   if (value <= 10) {
        //     return value;
        //   }
        //   // 之后的刻度以 25 为步长显示（25, 50, 75, 100）
        //   if (value % 50 === 0) {
        //     return value;
        //   }
        //   // 其他刻度不显示
        //   return null;
        // },
      }
    },
    x: {
      grid: {
        display: false
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

  },
  // 统一配置指示点样式
  elements: {
    point: {
      pointStyle: "circle", // 数据点形状
      radius: 0, // 数据点大小
      hoverRadius: 4 // 鼠标悬停时数据点大小
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
      // borderColor: "#00AEF3",
      // backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y"
    }
  ]
}

export default function Page() {
  return <Line options={options} data={data} />
}
