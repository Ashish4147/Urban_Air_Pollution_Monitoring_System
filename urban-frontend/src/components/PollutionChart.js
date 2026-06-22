/**
 * Pollution Chart Component
 * Displays current pollutant levels using bar chart
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PollutionChart = ({ pollutionData }) => {
  if (!pollutionData) {
    return <div style={styles.noData}>No data available</div>;
  }

  // Prepare chart data
  const chartData = {
    labels: ['CO₂', 'CO', 'PM2.5', 'PM10', 'NO₂', 'SO₂', 'O₃'],
    datasets: [
      {
        label: 'Pollutant Level',
        data: [
          pollutionData.co2,
          pollutionData.co,
          pollutionData.pm25,
          pollutionData.pm10,
          pollutionData.no2,
          pollutionData.so2,
          pollutionData.o3,
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
        borderColor: '#333',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current Pollutant Levels',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Concentration Level',
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '16px',
  },
};

export default PollutionChart;
