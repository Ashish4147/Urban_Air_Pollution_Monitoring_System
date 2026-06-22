/**
 * City Selector Component
 * Allows user to select which city to monitor
 */

import React from 'react';

const CitySelector = ({ selectedCity, onCityChange, cities }) => {
  return (
    <div style={styles.container}>
      <label style={styles.label}>Select City to Monitor:</label>
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        style={styles.select}
      >
        <option value="">-- Choose a city --</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city.charAt(0).toUpperCase() + city.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  select: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '2px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
    minWidth: '200px',
  },
};

export default CitySelector;
