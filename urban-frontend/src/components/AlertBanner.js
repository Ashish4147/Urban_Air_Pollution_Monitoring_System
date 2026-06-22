/**
 * Alert Banner Component
 * Displays air quality alerts when AQI exceeds safe thresholds
 */

import React from 'react';

const AlertBanner = ({ aqi, category, severity }) => {
  if (!aqi || aqi < 100) {
    return null; // Don't show alert if AQI is low
  }

  // Determine alert styling based on severity
  const getAlertStyle = () => {
    switch (severity) {
      case 'medium':
        return styles.alertWarning;
      case 'high':
        return styles.alertDanger;
      case 'very_high':
        return styles.alertSevere;
      case 'hazardous':
        return styles.alertHazardous;
      default:
        return styles.alertInfo;
    }
  };

  const getMessage = () => {
    switch (severity) {
      case 'medium':
        return '⚠️ Air Quality Alert: Members of sensitive groups should limit outdoor activities';
      case 'high':
        return '🔴 Air Quality Warning: Everyone should reduce outdoor activities';
      case 'very_high':
        return '🚨 Severe Air Quality WARNING: Avoid outdoor activities';
      case 'hazardous':
        return '☠️ HAZARDOUS AIR QUALITY: Stay indoors';
      default:
        return 'Air Quality Advisory';
    }
  };

  return (
    <div style={{ ...styles.banner, ...getAlertStyle() }}>
      <div style={styles.content}>
        <h3 style={styles.title}>{getMessage()}</h3>
        <p style={styles.details}>
          Current AQI: <strong>{aqi}</strong> ({category})
        </p>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '2px solid',
  },
  alertInfo: {
    backgroundColor: '#d1ecf1',
    borderColor: '#0c5460',
    color: '#0c5460',
  },
  alertWarning: {
    backgroundColor: '#fff3cd',
    borderColor: '#856404',
    color: '#856404',
  },
  alertDanger: {
    backgroundColor: '#f8d7da',
    borderColor: '#721c24',
    color: '#721c24',
  },
  alertSevere: {
    backgroundColor: '#ff6b6b',
    borderColor: '#c92a2a',
    color: '#fff',
  },
  alertHazardous: {
    backgroundColor: '#7e0023',
    borderColor: '#4a0000',
    color: '#fff',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  details: {
    margin: '0',
    fontSize: '14px',
  },
};

export default AlertBanner;
