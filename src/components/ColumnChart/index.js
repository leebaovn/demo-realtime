import React from 'react'
import { Bar } from 'react-chartjs-2'
function ColumnChart({ label, data }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        margin: 'auto',
        marginBottom: 30,
      }}
    >
      <Bar
        data={{
          labels: label,
          // labels: Object.keys(data),
          datasets: [
            {
              label: 'Total',
              backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9'],
              data: data,
              // data: Object.keys(data).map((key) => data[key]),
            },
          ],
        }}
        options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          legend: { display: false },
          title: {
            display: true,
            fontSize: 20,
            text: 'Online Voting Results!',
          },
        }}
      />
    </div>
  )
}

export default ColumnChart
