import React from 'react'
import { Bar } from 'react-chartjs-2'
import { ANSWER_COLORS } from './../../utils'
function ColumnChart({ label, data = {} }) {
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
          labels: Object.keys(data),
          datasets: [
            {
              label: 'Total vote',
              backgroundColor: ANSWER_COLORS,
              // data: data,
              data: Object.keys(data).map((key) => data[key]),
            },
          ],
        }}
        options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0,
                  beginAtZero: true,
                },
              },
            ],
          },
          legend: { display: false },
          title: {
            display: true,
            fontSize: 20,
            text: 'Voting Results!',
          },
        }}
      />
    </div>
  )
}

export default ColumnChart
