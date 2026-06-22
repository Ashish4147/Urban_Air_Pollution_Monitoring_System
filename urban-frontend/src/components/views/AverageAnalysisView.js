/**
 * Average Analysis View
 * Shows daily average pollutant levels with line chart
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
import { getAveragePollutant } from '../../services/api';

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

const AverageAnalysisView = ({
  selectedCity,
  selectedPollutant,
  cities,
  pollutants,
  onCityChange,
  onPollutantChange
}) => {
  const [averageData, setAverageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  /**
   * Fetch average data when parameters change
   */
  useEffect(() => {
    if (!selectedCity || !selectedPollutant) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAveragePollutant(selectedCity, selectedPollutant, days);
        setAverageData(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Error fetching average data.'
        );
        console.error('Error fetching average data:', err);
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
    if (!averageData?.averages) {
      return null;
    }

    const pollutantLabel = pollutants.find(p => p.value === selectedPollutant)?.label || selectedPollutant.toUpperCase();

    return {
      labels: averageData.averages.map(item => item.date),
      datasets: [
        {
          label: `${pollutantLabel} Daily Average`,
          data: averageData.averages.map(item => item.average),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
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
        text: `Daily Average ${pollutants.find(p => p.value === selectedPollutant)?.label || selectedPollutant.toUpperCase()} Levels - ${selectedCity}`,
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
          text: 'Date',
        },
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Controls */}
      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'}
              onBlur={(e) => e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'}
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Pollutant
            </label>
            <select
              value={selectedPollutant}
              onChange={(e) => onPollutantChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'}
              onBlur={(e) => e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'}
            >
              {pollutants.map((pollutant) => (
                <option key={pollutant.value} value={pollutant.value}>
                  {pollutant.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Time Period
            </label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'}
              onBlur={(e) => e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'}
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
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem' }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
          ⏳ Loading average data...
        </div>
      )}

      {/* Chart */}
      {averageData && !loading && averageData.averages?.length > 0 && (
        <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
              Average {pollutants.find(p => p.value === selectedPollutant)?.label} Analysis
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {selectedCity} - Last {days} days
            </p>
          </div>

          <div style={{ height: '24rem' }}>
            <Line data={getChartData()} options={chartOptions} />
          </div>
        </div>
      )}
      {averageData && !loading && averageData.averages?.length === 0 && (
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb', padding: '1.5rem', textAlign: 'center' }}>
          No average pollutant history available for {selectedCity}.
        </div>
      )}

      {/* Data Table */}
      {averageData?.averages && !loading && (
        <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Daily Averages</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '100%', tableLayout: 'auto' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                    Average {pollutants.find(p => p.value === selectedPollutant)?.label}
                  </th>
                  <th style={{ padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Records</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff', borderTop: '1px solid #e5e7eb' }}>
                {averageData.averages.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb' }}>
                    <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#111827' }}>{item.date}</td>
                    <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#111827' }}>{item.average.toFixed(2)}</td>
                    <td style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#111827' }}>{item.count}</td>
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

export default AverageAnalysisView;