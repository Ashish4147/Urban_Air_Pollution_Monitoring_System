/**
 * City Comparison View
 * Compares pollutant averages across different cities with bar chart
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
import { getCityComparison } from '../../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CityComparisonView = ({
  selectedCity,
  selectedPollutant,
  cities,
  pollutants,
  onCityChange,
  onPollutantChange
}) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  /**
   * Fetch comparison data when parameters change
   */
  useEffect(() => {
    if (!selectedPollutant) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getCityComparison(selectedPollutant, days);
        setComparisonData(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Error fetching comparison data.'
        );
        console.error('Error fetching comparison data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPollutant, days]);

  /**
   * Prepare chart data
   */
  const getChartData = () => {
    if (!comparisonData?.comparisons) {
      return null;
    }

    const pollutantLabel = pollutants.find(p => p.value === selectedPollutant)?.label || selectedPollutant.toUpperCase();

    return {
      labels: comparisonData.comparisons.map(item => item.city.charAt(0).toUpperCase() + item.city.slice(1)),
      datasets: [
        {
          label: `${pollutantLabel} Average`,
          data: comparisonData.comparisons.map(item => item.average),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: '#22C55E',
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
        text: `City Comparison - Average ${pollutants.find(p => p.value === selectedPollutant)?.label || selectedPollutant.toUpperCase()} Levels`,
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
          text: 'City',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          ⏳ Loading comparison data...
        </div>
      )}

      {/* Chart */}
      {comparisonData && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              City Comparison Analysis
            </h3>
            <p className="text-sm text-gray-600">
              Average {pollutants.find(p => p.value === selectedPollutant)?.label} levels across cities - Last {days} days
            </p>
          </div>

          <div className="h-96">
            <Bar data={getChartData()} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Data Table */}
      {comparisonData?.comparisons && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">City Rankings</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Average {pollutants.find(p => p.value === selectedPollutant)?.label}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisonData.comparisons.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {item.city.charAt(0).toUpperCase() + item.city.slice(1)}
                    </td>
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

export default CityComparisonView;