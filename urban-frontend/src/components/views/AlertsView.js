/**
 * Alerts View
 * Shows pollution alerts for cities exceeding safe thresholds
 */

import React from 'react';

const AlertsView = ({
  alerts,
  cities
}) => {
  // Define thresholds for display
  const thresholds = {
    pm25: { limit: 100, unit: 'µg/m³' },
    pm10: { limit: 150, unit: 'µg/m³' },
    co: { limit: 9, unit: 'ppm' },
    no2: { limit: 80, unit: 'ppb' },
    so2: { limit: 80, unit: 'ppb' },
    o3: { limit: 120, unit: 'ppb' },
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default:
        return 'bg-orange-100 border-orange-500 text-orange-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pollution Alerts</h2>
        <p className="text-gray-600">
          Cities currently exceeding safe pollution thresholds
        </p>
      </div>

      {/* Thresholds Reference */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Safe Thresholds</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(thresholds).map(([pollutant, config]) => (
            <div key={pollutant} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 uppercase">
                {pollutant}
              </div>
              <div className="text-lg font-bold text-blue-600">
                {config.limit}
              </div>
              <div className="text-xs text-gray-500">
                {config.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length === 0 ? (
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg text-center">
          <div className="text-2xl mb-2">✅</div>
          <div className="font-medium">All Clear</div>
          <div className="text-sm">No cities are currently exceeding safe pollution thresholds.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-6 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-3">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">
                    {alert.city.charAt(0).toUpperCase() + alert.city.slice(1)}
                  </h4>
                  <p className="text-sm mb-3">
                    Last updated: {new Date(alert.timestamp).toLocaleString()}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {alert.exceeded.map((exceedance, idx) => (
                      <div key={idx} className="bg-white bg-opacity-50 rounded p-3">
                        <div className="text-sm font-medium uppercase">
                          {exceedance.pollutant}
                        </div>
                        <div className="text-lg font-bold">
                          {exceedance.value.toFixed(1)}
                          <span className="text-sm ml-1">
                            {thresholds[exceedance.pollutant]?.unit}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Limit: {exceedance.threshold}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Summary */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Alert Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{alerts.length}</div>
              <div className="text-sm text-gray-600">Cities with Alerts</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {alerts.filter(a => a.severity === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Severity</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {alerts.filter(a => a.severity === 'medium').length}
              </div>
              <div className="text-sm text-gray-600">Medium Severity</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsView;