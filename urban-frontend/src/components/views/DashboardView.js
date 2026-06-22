/**
 * Dashboard View
 * Main dashboard with current pollution data and overview
 */

import React, { useState, useEffect } from 'react';
import CitySelector from '../CitySelector';
import AlertBanner from '../AlertBanner';
import PollutionChart from '../PollutionChart';
import ForecastChart from '../ForecastChart';
import UploadDataset from '../UploadDataset';
import { getPollutionByCity, getPollutantForecast } from '../../services/api';

const DashboardView = ({
  selectedCity,
  selectedPollutant,
  cities,
  pollutants,
  onCityChange,
  onPollutantChange,
  onMongoDBImport,
  onUploadSuccess,
  alerts
}) => {
  const [pollutionData, setPollutionData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aqi, setAqi] = useState(null);

  /**
   * Fetch pollution data when city changes
   */
  useEffect(() => {
    if (!selectedCity) {
      console.log('[DashboardView] No city selected, skipping fetch');
      return;
    }

    console.log('[DashboardView] Fetching data for city:', selectedCity);
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch current pollution data
        console.log('[DashboardView] Calling getPollutionByCity...');
        const pollutionResponse = await getPollutionByCity(selectedCity);
        console.log('[DashboardView] Response received:', pollutionResponse);
        
        setPollutionData(pollutionResponse.data.data);
        setAqi(pollutionResponse.data.data.aqi);
        console.log('[DashboardView] Pollution data set successfully');

        // Fetch 7-day forecast for selected pollutant
        console.log('[DashboardView] Calling getPollutantForecast...');
        const forecastResponse = await getPollutantForecast(selectedCity, selectedPollutant);
        setForecastData(forecastResponse.data.data);
        console.log('[DashboardView] Forecast data set successfully');
      } catch (err) {
        const errorMsg = 
          err.response?.data?.message ||
          err.message ||
          'Error fetching data. Make sure the backend is running.';
        console.error('[DashboardView] Error fetching data:', err, 'Message:', errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity, selectedPollutant]);

  /**
   * Handle successful dataset upload
   */
  const handleUploadSuccess = async (uploadData) => {
    await onUploadSuccess();

    if (selectedCity && uploadData.recordsInserted > 0) {
      // Refresh data for the current city after upload
      setTimeout(() => {
        const fetchData = async () => {
          try {
            const pollutionResponse = await getPollutionByCity(selectedCity);
            setPollutionData(pollutionResponse.data.data);
            setAqi(pollutionResponse.data.data.aqi);

            const forecastResponse = await getPollutantForecast(selectedCity, selectedPollutant);
            setForecastData(forecastResponse.data.data);
          } catch (err) {
            console.error('Error refreshing after upload:', err);
          }
        };
        fetchData();
      }, 500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Debug Info - Remove in production */}
      <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
        <strong>DEBUG INFO:</strong><br/>
        selectedCity: {selectedCity || 'NONE'} | loading: {loading ? 'TRUE' : 'false'} | hasData: {pollutionData ? 'YES' : 'NO'} | hasError: {error ? 'YES' : 'NO'}
      </div>

      {/* Controls */}
      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <CitySelector
            selectedCity={selectedCity}
            onCityChange={onCityChange}
            cities={cities}
          />
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
          ⏳ Loading data for {selectedCity}...
        </div>
      )}

      {/* No City Selected */}
      {!selectedCity && !loading && (
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
          👈 Select a city from the dropdown to view air quality data
        </div>
      )}

      {/* No Data Available */}
      {selectedCity && !loading && !pollutionData && !error && (
        <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', color: '#92400e', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
          No data available for {selectedCity}. Please try uploading data or selecting another city.
        </div>
      )}

      {/* Main Content */}
      {selectedCity && !loading && pollutionData && (
        <>
          {/* Alert Banner */}
          <AlertBanner
            aqi={aqi?.aqi}
            category={aqi?.category}
            severity={aqi?.severity}
          />

          {/* AQI Summary Card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                Current AQI: {aqi?.aqi}
              </h2>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: aqi?.color }}>
                Category: <strong>{aqi?.category}</strong>
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Updated: {new Date(pollutionData.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <PollutionChart pollutionData={pollutionData} />
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <ForecastChart
                forecastData={forecastData}
                pollutantLabel={pollutants.find((p) => p.value === selectedPollutant)?.label || selectedPollutant}
              />
            </div>
          </div>

          {/* Detailed Metrics */}
          <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              Detailed Pollutant Breakdown
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>CO₂</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{pollutionData.co2}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ppm</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>CO</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{pollutionData.co}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ppm</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>PM2.5</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{pollutionData.pm25}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>µg/m³</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>PM10</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{pollutionData.pm10}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>µg/m³</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>NO₂</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{pollutionData.no2}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ppb</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>SO₂</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{pollutionData.so2}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ppb</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center', gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>O₃</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{pollutionData.o3}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ppb</div>
              </div>
            </div>
          </div>
        </>
      )}

      <UploadDataset onUploadSuccess={handleUploadSuccess} onMongoDBImport={onMongoDBImport} />
    </div>
  );
};

export default DashboardView;