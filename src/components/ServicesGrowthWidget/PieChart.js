import React, { useRef, useEffect } from 'react';
import Chart, { ChartData } from 'chart.js';
import _ from 'lodash';

const initChart = (canvas, labelList, dataList) => {
  const isLabelLength = _.get(labelList, 'length', 0) > 0;
  const charColorList = [
    'rgb(109, 113, 249)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)',
    'rgb(53, 228, 175)',
    'rgb(255, 99, 132)',
  ];

  const bgColor = isLabelLength ? charColorList : ['rgb(128,128,128)'];

  const chartData = {
    labels: isLabelLength ? labelList : ['0 Services'],
    datasets: [
      {
        label: '',
        data: isLabelLength ? dataList : ['1'],
        backgroundColor: bgColor,
        hoverOffset: 5,
      },
    ],
  };

  const chart = new Chart(canvas, {
    type: 'doughnut',
    data: chartData,
    options: {
      plugins: {
        legend: false,
      },
      maintainAspectRatio: false,
      tooltips: {
        displayColors: false,
        callbacks: {
          title: tooltipItems => {},
        },
      },
    },
  });

  return chart;
};

export default ({ labelList, dataList }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (canvasRef === null || canvasRef.current === null) return;

    if (chartRef === null || chartRef.current === null) {
      chartRef.current = initChart(canvasRef.current, labelList, dataList);
      return;
    }

    chartRef.current.destroy();
    chartRef.current = initChart(canvasRef.current, labelList, dataList);
  }, [canvasRef, chartRef]);

  return <canvas ref={canvasRef} />;
};
