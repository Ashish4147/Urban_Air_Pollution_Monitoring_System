/**
 * Forecast View
 * Shows historical data and AI-powered forecast with line chart
 */

import React, { useState, useEffect } from 'react';
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
import { getPollutionHistory, getPollutantForecast } from '../../services/api';

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

const ForecastView = ({
  selectedCity,
  selectedPollutant,
  cities,
  pollutants,
  onCityChange,
  onPollutantChange
}) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  /**
   * Fetch forecast and historical data when parameters change
   */
  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch historical data and forecast in parallel
        const [historyResponse, forecastResponse] = await Promise.all([
          getPollutionHistory(selectedCity, days),
          getPollutantForecast(selectedCity, selectedPollutant),
        ]);

        setHistoricalData(historyResponse.data.data);
        setForecastData(forecastResponse.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Error fetching forecast data.'
        );
        console.error('Error fetching forecast data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity, selectedPollutant, days]);

  /**
   * Prepare chart data
   */
  const getChartData = () => {
    if (!historicalData || !forecastData) {
      return null;
    }

    // Prepare historical data points
    const historicalPoints = historicalData.map(item => ({
      x: new Date(item.timestamp).toLocaleDateString(),
      y: item[selectedPollutant],
    }));

    // Prepare forecast data points (next 7 days)
    const forecastPoints = [];
    const lastHistoricalDate = new Date(historicalData[historicalData.length - 1]?.timestamp || new Date());

    for (let i = 0; i < forecastData.forecast.length; i++) {
      const forecastDate = new Date(lastHistoricalDate);
      forecastDate.setDate(forecastDate.getDate() + i + 1);
      forecastPoints.push({
        x: forecastDate.toLocaleDateString(),
        y: forecastData.forecast[i],
      });
    }

    const pollutantLabel = pollutants.find(p => p.value === selectedPollutant)?.label || selectedPollutant.toUpperCase();

    return {
      datasets: [
        {
          label: `Historical ${pollutantLabel}`,
          data: historicalPoints,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        },
        {
          label: `Forecast ${pollutantLabel}`,
          data: forecastPoints,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${pollutants.find(p => p.value === selectedPollutant)?.label || selectedPollutant.toUpperCase()} Forecast - ${selectedCity} (${days} days)`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: `${pollutants.find(p => p.value === selectedPollutant)?.label} Level`,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pollutant
            </label>
            <select
              value={selectedPollutant}
              onChange={(e) => onPollutantChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pollutants.map((pollutant) => (
                <option key={pollutant.value} value={pollutant.value}>
                  {pollutant.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Historical Period
            </label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-center">
          ⏳ Loading forecast data...
        </div>
      )}

      {/* Chart */}
      {historicalData && forecastData && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              AI-Powered Pollution Forecast
            </h3>
            <p className="text-sm text-gray-600">
              {selectedCity} - {pollutants.find(p => p.value === selectedPollutant)?.label} levels with {days}-day historical range and 7-day prediction
            </p>
            <div className="mt-2 text-xs text-gray-500">
              <span className="inline-block w-4 h-1 bg-blue-500 mr-2"></span>
              Historical data ({days} days)
              <span className="inline-block w-4 h-1 bg-red-500 border-dashed border-t-2 ml-4 mr-2"></span>
              AI Forecast
            </div>
          </div>

          <div className="h-96">
            <Line data={getChartData()} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Forecast Details */}
      {forecastData && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">7-Day Forecast</h4>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {forecastData.forecast.map((value, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index + 1);
              return (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-lg font-bold text-red-600 mt-1">
                    {value.toFixed(1)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastView;