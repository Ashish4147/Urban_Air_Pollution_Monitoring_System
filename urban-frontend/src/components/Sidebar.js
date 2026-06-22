/**
 * Sidebar Component
 * Navigation sidebar with menu items
 */

import React from 'react';

const Sidebar = ({ activeView, onViewChange, alertsCount }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Overview and current data',
    },
    {
      id: 'average',
      label: 'Average Pollutant',
      icon: '📈',
      description: 'Daily average analysis',
    },
    {
      id: 'peakhours',
      label: 'Peak Hours',
      icon: '⏰',
      description: 'Hourly pollution patterns',
    },
    {
      id: 'compare',
      label: 'Compare Cities',
      icon: '🏙️',
      description: 'City comparison analysis',
    },
    {
      id: 'forecast',
      label: 'Forecast',
      icon: '🔮',
      description: 'AI-powered predictions',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: '🚨',
      description: 'Pollution warnings',
      badge: alertsCount > 0 ? alertsCount : null,
    },
  ];

  return (
    <div style={{ width: '16rem', backgroundColor: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Air Quality Monitor</h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Urban Pollution System</p>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: '1rem' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s',
                  backgroundColor: activeView === item.id ? '#eff6ff' : 'transparent',
                  color: activeView === item.id ? '#1d4ed8' : '#374151',
                  borderRight: activeView === item.id ? '4px solid #3b82f6' : 'none',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeView !== item.id) {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.color = '#111827';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeView !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#374151';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem', marginRight: '0.75rem' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                    {item.label}
                    {item.badge && (
                      <span style={{ marginLeft: '0.5rem', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{item.description}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;