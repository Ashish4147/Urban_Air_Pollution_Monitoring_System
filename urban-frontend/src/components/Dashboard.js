/**
 * Dashboard Component
 * Main component that orchestrates all UI elements and data fetching
 * Modern dashboard with sidebar navigation and multiple analysis views
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardView from './views/DashboardView';
import AverageAnalysisView from './views/AverageAnalysisView';
import PeakHoursView from './views/PeakHoursView';
import CityComparisonView from './views/CityComparisonView';
import ForecastView from './views/ForecastView';
import AlertsView from './views/AlertsView';
import {
  getCities,
  getAlerts,
} from '../services/api';

const Dashboard = () => {
  // State management
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPollutant, setSelectedPollutant] = useState('pm25');
  const [cities, setCities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pollutant options
  const pollutants = [
    { value: 'co2', label: 'CO₂' },
    { value: 'co', label: 'CO' },
    { value: 'pm25', label: 'PM2.5' },
    { value: 'pm10', label: 'PM10' },
    { value: 'no2', label: 'NO₂' },
    { value: 'so2', label: 'SO₂' },
    { value: 'o3', label: 'O₃' },
  ];

  /**
   * Load initial data
   */
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Load cities and alerts data
   */
  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('[Dashboard] Loading initial data...');
      const [citiesResponse, alertsResponse] = await Promise.all([
        getCities(),
        getAlerts(),
      ]);

      const cities = citiesResponse.data.data || [];
      const alerts = alertsResponse.data.data.alerts || [];
      
      console.log('[Dashboard] Cities loaded:', cities);
      console.log('[Dashboard] Alerts loaded:', alerts);
      
      setCities(cities);
      setAlerts(alerts);

      // Set default city if available
      if (cities && cities.length > 0) {
        console.log('[Dashboard] Setting default city:', cities[0]);
        setSelectedCity(cities[0]);
      }
    } catch (err) {
      console.error('[Dashboard] Error loading initial data:', err);
      setError('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle view change
   */
  const handleViewChange = (view) => {
    setActiveView(view);
    setError(null);
  };

  /**
   * Handle city selection
   */
  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  /**
   * Handle pollutant selection
   */
  const handlePollutantChange = (pollutant) => {
    setSelectedPollutant(pollutant);
  };

  const handleMongoDBImport = async () => {
    await loadInitialData();
  };

  /**
   * Render active view
   */
  const renderActiveView = () => {
    const viewProps = {
      selectedCity,
      selectedPollutant,
      cities,
      pollutants,
      onCityChange: handleCityChange,
      onPollutantChange: handlePollutantChange,
      onMongoDBImport: handleMongoDBImport,
      onUploadSuccess: loadInitialData,
      alerts,
    };

    switch (activeView) {
      case 'dashboard':
        return <DashboardView {...viewProps} />;
      case 'average':
        return <AverageAnalysisView {...viewProps} />;
      case 'peakhours':
        return <PeakHoursView {...viewProps} />;
      case 'compare':
        return <CityComparisonView {...viewProps} />;
      case 'forecast':
        return <ForecastView {...viewProps} />;
      case 'alerts':
        return <AlertsView {...viewProps} />;
      default:
        return <DashboardView {...viewProps} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        alertsCount={alerts.length}
      />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
              🌍 Urban Air Pollution Monitor
            </h1>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Real-time air quality monitoring with AI-powered forecasting
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          {error && (
            <div style={{ marginBottom: '1.5rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem' }}>
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
              <div style={{ animation: 'spin 1s linear infinite', borderRadius: '9999px', height: '3rem', width: '3rem', borderTop: '2px solid #3b82f6', borderRight: '2px solid transparent', borderBottom: '2px solid transparent', borderLeft: '2px solid transparent' }}></div>
              <span style={{ marginLeft: '0.75rem', color: '#6b7280' }}>Loading...</span>
            </div>
          ) : (
            renderActiveView()
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
