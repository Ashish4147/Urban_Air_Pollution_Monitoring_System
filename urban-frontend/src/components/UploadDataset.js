/**
 * Upload Dataset Component
 * Allows users to upload pollution data from JSON or CSV files
 * Supports local file uploads without requiring MongoDB
 */

import React, { useState, useEffect } from 'react';
import { uploadDataset, getUploadHistory, getDataSources } from '../services/api';

const UploadDataset = ({ onUploadSuccess = () => {}, onMongoDBImport = () => {} }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(null);
  const [dataSources, setDataSources] = useState(null);
  const [source, setSource] = useState('manual');
  const [mongoMessage, setMongoMessage] = useState(null);

  /**
   * Handle file selection
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const isJSON = selectedFile.name.endsWith('.json');
      const isCSV = selectedFile.name.endsWith('.csv');
      
      if (!isJSON && !isCSV) {
        setError('Please select a JSON or CSV file');
        setFile(null);
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  /**
   * Handle file upload
   */
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadDataset(formData);

      setMessage({
        type: 'success',
        text: `Successfully uploaded ${response.data.recordsInserted} records!`,
      });

      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('datasetFileInput');
      if (fileInput) {
        fileInput.value = '';
      }

      // Trigger callback
      onUploadSuccess(response.data);

      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Error uploading file. Please try again.'
      );
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch and display upload history
   */
  const handleViewHistory = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getUploadHistory();
      setUploadHistory(response.data.uploads || []);
      setShowHistory(true);
    } catch (err) {
      setError('Error fetching upload history');
      console.error('History error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDataSources = async () => {
    try {
      const response = await getDataSources();
      setDataSources(response.data.sources);
    } catch (err) {
      console.error('Error loading data source status:', err);
      setDataSources({ mongodb: false, uploadedData: false });
    }
  };

  const handleUseMongoDB = async () => {
    setMongoMessage(null);
    setError(null);
    setLoading(true);
    try {
      const response = await getDataSources();
      const sources = response.data.sources;
      setDataSources(sources);

      if (!sources.mongodb) {
        setMongoMessage('MongoDB is not connected or not available. Please start MongoDB and try again.');
      } else if (!sources.mongodbHasData) {
        setMongoMessage('MongoDB is connected but no pollution data was found. Import data in Compass first.');
      } else {
        setMongoMessage(`MongoDB is connected and has ${sources.mongodbRecords} records. Loading data now.`);
        onMongoDBImport();
      }
    } catch (err) {
      console.error('MongoDB import error:', err);
      setMongoMessage('Unable to connect to MongoDB. Check your backend and MongoDB connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataSources();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📁 Upload Pollution Dataset</h2>
        <p style={styles.subtitle}>
          Choose a data source: upload a file manually or use MongoDB Compass data.
        </p>

        <div style={styles.sourceToggle}>
          <button
            onClick={() => setSource('manual')}
            style={{
              ...styles.sourceButton,
              ...(source === 'manual' ? styles.sourceButtonActive : {}),
            }}
          >
            Manual Upload
          </button>
          <button
            onClick={() => setSource('mongodb')}
            style={{
              ...styles.sourceButton,
              ...(source === 'mongodb' ? styles.sourceButtonActive : {}),
            }}
          >
            MongoDB Import
          </button>
        </div>

        {source === 'manual' ? (
          <>
            {/* File Upload Section */}
            <div style={styles.uploadSection}>
              <div style={styles.fileInputWrapper}>
                <input
                  id="datasetFileInput"
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileChange}
                  style={styles.fileInput}
                />
                <label htmlFor="datasetFileInput" style={styles.fileLabel}>
                  {file ? (
                    <span style={styles.fileName}>✓ {file.name}</span>
                  ) : (
                    <span>Choose JSON or CSV File or Drag & Drop</span>
                  )}
                </label>
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                style={{
                  ...styles.uploadButton,
                  opacity: !file || loading ? 0.6 : 1,
                  cursor: !file || loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? '⏳ Uploading...' : '📤 Upload Dataset'}
              </button>
            </div>
          </>
        ) : (
          <div style={styles.mongodbSection}>
            <div style={styles.statusRow}>
              <div>
                <div style={styles.statusTitle}>MongoDB Status</div>
                <div style={styles.statusText}>
                  {dataSources?.mongodb
                    ? dataSources?.mongodbHasData
                      ? `MongoDB is connected and has ${dataSources.mongodbRecords} pollution records available.`
                      : 'MongoDB is connected but no pollution records were found. Import data in Compass first.'
                    : 'MongoDB is not connected. Start MongoDB and verify your connection.'}
                </div>
              </div>
              <button
                onClick={handleUseMongoDB}
                disabled={loading}
                style={{
                  ...styles.mongoButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? '⏳ Checking MongoDB...' : '🔁 Load from MongoDB'}
              </button>
            </div>

            {mongoMessage && (
              <div style={styles.infoMessage}>
                {mongoMessage}
              </div>
            )}

            {dataSources && (!dataSources.mongodb || !dataSources.mongodbHasData) && (
              <div style={styles.mongoHelp}>
                <p style={styles.instructions}>
                  To use MongoDB Compass data, import your CSV into the connected database and then click
                  &nbsp;<strong>Load from MongoDB</strong>.
                </p>
                <p style={styles.instructions}>
                  If Compass has already imported the data, this button will refresh the app using MongoDB.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {error && (
          <div style={styles.errorMessage}>
            <span>❌</span> {error}
          </div>
        )}

        {message && (
          <div style={styles.successMessage}>
            <span>✅</span> {message.text}
          </div>
        )}

        {/* Upload History */}
        <div style={styles.historySection}>
          <button
            onClick={handleViewHistory}
            style={styles.historyButton}
            disabled={loading}
          >
            {showHistory ? '▼ Hide Upload History' : '▶ Show Upload History'}
          </button>

          {showHistory && uploadHistory.length > 0 && (
            <div style={styles.historyList}>
              <p style={styles.historyCount}>
                Total Uploads: <strong>{uploadHistory.length}</strong>
              </p>
              {uploadHistory.map((upload, idx) => (
                <div key={idx} style={styles.historyItem}>
                  <div style={styles.historyItemContent}>
                    <p style={styles.historyItemTitle}>
                      📄 {upload.filename}
                    </p>
                    <p style={styles.historyItemDetails}>
                      Records: {upload.recordCount} | Cities:{' '}
                      {upload.cities.join(', ')}
                    </p>
                    <p style={styles.historyItemTime}>
                      Uploaded: {new Date(upload.uploadTimestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showHistory && uploadHistory.length === 0 && (
            <p style={styles.noHistory}>No datasets uploaded yet</p>
          )}
        </div>

        {/* Instructions */}
        <div style={styles.instructionsSection}>
          <h4 style={styles.instructionsTitle}>📋 Supported File Formats</h4>
          <p style={styles.instructions}>
            Your file can be in JSON or CSV format:
          </p>
          
          <div style={styles.formatTabs}>
            <div style={styles.formatTab}>
              <h5 style={styles.formatTitle}>JSON Format</h5>
              <div style={styles.codeBlock}>
                <pre style={styles.codeContent}>{`[
  {
    "city": "Delhi",
    "pm25": 85.5,
    "pm10": 120.3,
    "no2": 42.1,
    "so2": 15.7,
    "co": 0.8,
    "o3": 35.2,
    "timestamp": "2024-03-04T10:00:00Z"
  }
]`}</pre>
              </div>
            </div>

            <div style={styles.formatTab}>
              <h5 style={styles.formatTitle}>CSV Format</h5>
              <div style={styles.codeBlock}>
                <pre style={styles.codeContent}>{`city,pm25,pm10,no2,so2,co,o3,timestamp
Delhi,85.5,120.3,42.1,15.7,0.8,35.2,2024-03-04T10:00:00Z
Mumbai,62.3,95.1,35.2,12.1,0.6,38.5,2024-03-04T10:00:00Z`}</pre>
              </div>
            </div>
          </div>
          
          <p style={styles.note}>
            💡 <strong>Note:</strong> Timestamp is optional (uses current time if not provided)
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '25px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  uploadSection: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  fileInputWrapper: {
    flex: 1,
    minWidth: '250px',
    position: 'relative',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    display: 'block',
    padding: '12px 16px',
    border: '2px dashed #4CAF50',
    borderRadius: '6px',
    backgroundColor: '#f0fdf4',
    color: '#2d5016',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  fileName: {
    color: '#22863a',
    fontWeight: 'bold',
  },
  uploadButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    whiteSpace: 'nowrap',
  },
  errorMessage: {
    padding: '12px 16px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
  },
  successMessage: {
    padding: '12px 16px',
    backgroundColor: '#efe',
    color: '#3c3',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
  },
  historySection: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  historyButton: {
    padding: '10px 16px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  historyList: {
    marginTop: '15px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  historyCount: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '10px',
  },
  historyItem: {
    padding: '10px 12px',
    backgroundColor: '#f9f9f9',
    borderLeft: '3px solid #2196F3',
    marginBottom: '8px',
    borderRadius: '4px',
  },
  historyItemContent: {
    fontSize: '13px',
  },
  historyItemTitle: {
    margin: '0 0 4px 0',
    fontWeight: '600',
    color: '#333',
  },
  historyItemDetails: {
    margin: '0 0 3px 0',
    color: '#666',
  },
  historyItemTime: {
    margin: '0',
    color: '#999',
    fontSize: '12px',
  },
  noHistory: {
    fontSize: '13px',
    color: '#999',
    fontStyle: 'italic',
    marginTop: '10px',
  },
  instructionsSection: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  instructionsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  instructions: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 10px 0',
  },
  formatTabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '10px',
  },
  formatTab: {
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
  },
  formatTitle: {
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: '#f5f5f5',
    color: '#333',
    margin: '0',
    padding: '8px 12px',
    borderBottom: '1px solid #e0e0e0',
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '10px',
    overflow: 'auto',
    maxHeight: '200px',
  },
  codeContent: {
    margin: 0,
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: '1.4',
  },
  note: {
    fontSize: '13px',
    color: '#666',
    margin: '0',
    padding: '8px 12px',
    backgroundColor: '#fff9e6',
    borderRadius: '4px',
  },
  sourceToggle: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  sourceButton: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f8fafc',
    color: '#334155',
    fontWeight: '600',
    cursor: 'pointer',
  },
  sourceButtonActive: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderColor: '#2563eb',
  },
  mongodbSection: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '14px',
    marginBottom: '16px',
  },
  statusTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px',
  },
  statusText: {
    fontSize: '13px',
    color: '#475569',
  },
  mongoButton: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
  },
  infoMessage: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  mongoHelp: {
    padding: '14px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
  },
};

export default UploadDataset;
