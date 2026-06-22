/**
 * Peak Hours View
 * Shows average pollutant levels by hour of day with bar chart
 */

import React, { useState, useEffect } from 'react';
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
import { getPeakHours } from '../../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PeakHoursView = ({
  selectedCity,
  selectedPollutant,
  cities,
  pollutants,
  onCityChange,
  onPollutantChange
}) => {
  const [peakHoursData, setPeakHoursData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  /**
   * Fetch peak hours data when parameters change
   */
  useEffect(() => {
    if (!selectedCity || !selectedPollutant) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getPeakHours(selectedCity, selectedPollutant, days);
        setPeakHoursData(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Error fetching peak hours data.'
        );
        console.error('Error fetching peak hours data:', err);
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
    if (!peakHoursData?.peakHours) {
      return null;
    }

    const pollutantLabel = pollutants.find(p => p.value === selectedPollutant)?.label || selectedPollutant.toUpperCase();

    return {
      labels: peakHoursData.peakHours.map(item => `${item.hour}:00`),
      datasets: [
        {
          label: `${pollutantLabel} Average`,
          data: peakHoursData.peakHours.map(item => item.average),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: '#3B82F6',
          borderWidth: 1,
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
        text: `Hourly Average ${pollutants.find(p => p.value === selectedPollutant)?.label || selectedPollutant.toUpperCase()} Levels - ${selectedCity}`,
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
          text: 'Average Level',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Hour of Day',
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
              Time Period
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
          ⏳ Loading peak hours data...
        </div>
      )}

      {/* Chart */}
      {peakHoursData && !loading && peakHoursData.peakHours?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Peak Hours Analysis
            </h3>
            <p className="text-sm text-gray-600">
              {selectedCity} - {pollutants.find(p => p.value === selectedPollutant)?.label} levels by hour of day
            </p>
          </div>

          <div className="h-96">
            <Bar data={getChartData()} options={chartOptions} />
          </div>
        </div>
      )}
      {peakHoursData && !loading && peakHoursData.peakHours?.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          No hourly pollutant history available for {selectedCity}.
        </div>
      )}

      {/* Data Table */}
      {peakHoursData?.peakHours && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Hourly Averages</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hour</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Average {pollutants.find(p => p.value === selectedPollutant)?.label}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {peakHoursData.peakHours.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{item.hour}:00</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.average.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeakHoursView;