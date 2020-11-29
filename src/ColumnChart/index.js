import React from 'react';
import { Bar } from 'react-chartjs-2';
function ColumnChart({ label, data }) {
  return (
    <Bar
      data={{
        labels: ['A', 'B', 'C', 'D'],
        datasets: [
          {
            label: 'Total',
            backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9'],
            data: data,
          },
        ],
      }}
      options={{
        legend: { display: false },
        title: {
          display: true,
          text: 'Total count',
        },
      }}
    />
  );
}

export default ColumnChart;
