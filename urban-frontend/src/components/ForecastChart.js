/**
 * Forecast Chart Component
 * Displays 7-day PM2.5 forecast using line chart
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ForecastChart = ({ forecastData, pollutantLabel = 'PM2.5' }) => {
  if (!forecastData || !forecastData.forecast || forecastData.forecast.length === 0) {
    return <div style={styles.noData}>No forecast data available</div>;
  }

  // Generate labels for next 7 days
  const labels = Array.from({ length: forecastData.forecast.length }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() + i + 1);
    return day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const chartLabel = `${pollutantLabel} Forecast`;
  const yAxisLabel = `${pollutantLabel} (${pollutantLabel === 'CO₂' || pollutantLabel === 'CO' ? 'ppm' : 'µg/m³'})`;

  // Prepare chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: chartLabel,
        data: forecastData.forecast,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#FF6384',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
    ],
  };

  const unitLabel = pollutantLabel === 'CO₂' || pollutantLabel === 'CO' ? 'ppm' : 'µg/m³';
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `7-Day ${chartLabel}`,
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
          text: yAxisLabel,
        },
        max: Math.max(...forecastData.forecast) * 1.2, // Add 20% buffer to max
      },
    },
  };

  return (
    <div style={styles.container}>
      <Line data={chartData} options={options} />
      <p style={styles.info}>
        Forecasted Average: {(
          forecastData.forecast.reduce((a, b) => a + b) / forecastData.forecast.length
        ).toFixed(2)} {unitLabel}
      </p>
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
  info: {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
    color: '#666',
  },
};

export default ForecastChart;
