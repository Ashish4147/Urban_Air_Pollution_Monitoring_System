"""
ARIMA Time Series Forecasting Model
Uses statsmodels ARIMA to forecast PM2.5 air pollution levels
"""

import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ArimaForecastModel:
    """
    Handles ARIMA model training and forecasting for air pollution data
    """

    def __init__(self, order=(1, 1, 1)):
        """
        Initialize ARIMA model with specified order
        
        Args:
            order: Tuple of (p, d, q) for ARIMA(p,d,q)
                   p: AR (autoregressive) order
                   d: I (integrated) order - differencing
                   q: MA (moving average) order
        """
        self.order = order
        self.model = None
        self.fitted_model = None
        logger.info(f"✓ ARIMA model initialized with order {order}")

    def fit(self, train_data):
        """
        Fit ARIMA model to historical data
        
        Args:
            train_data: Array or list of historical PM2.5 values
            
        Returns:
            Fitted model object
        """
        try:
            # Convert to numpy array if needed
            if isinstance(train_data, list):
                train_data = np.array(train_data)
            
            # Validate data
            if len(train_data) < 7:
                raise ValueError("Minimum 7 data points required for ARIMA")
            
            if np.isnan(train_data).any():
                raise ValueError("Data contains NaN values")
            
            # Create ARIMA model
            self.model = ARIMA(train_data, order=self.order)
            
            # Fit the model
            self.fitted_model = self.model.fit()
            
            logger.info("✓ ARIMA model fitted successfully")
            return self.fitted_model
            
        except Exception as e:
            logger.error(f"✗ Error fitting ARIMA model: {str(e)}")
            raise

    def forecast(self, train_data, steps=7):
        """
        Generate forecast for future time periods
        
        Args:
            train_data: Historical PM2.5 values
            steps: Number of days to forecast (default: 7 days)
            
        Returns:
            Array of forecasted PM2.5 values
        """
        try:
            # Fit model to training data
            self.fit(train_data)
            
            # Generate forecast
            forecast_result = self.fitted_model.get_forecast(steps=steps)
            forecast_values = forecast_result.predicted_mean.values
            
            # Ensure non-negative values (PM2.5 cannot be negative)
            forecast_values = np.maximum(forecast_values, 0)
            
            # Round to 2 decimal places
            forecast_values = np.round(forecast_values, 2)
            
            logger.info(f"✓ Forecast generated for {steps} days ahead")
            return forecast_values.tolist()
            
        except Exception as e:
            logger.error(f"✗ Error generating forecast: {str(e)}")
            raise

    def get_confidence_interval(self, train_data, steps=7, alpha=0.05):
        """
        Get confidence intervals for predictions
        
        Args:
            train_data: Historical PM2.5 values
            steps: Number of days to forecast
            alpha: Significance level (default: 0.05 for 95% CI)
            
        Returns:
            Dict with forecast, lower, and upper confidence bounds
        """
        try:
            # Fit model
            self.fit(train_data)
            
            # Get forecast with confidence intervals
            forecast_result = self.fitted_model.get_forecast(steps=steps)
            forecast_values = forecast_result.predicted_mean.values
            confidence_intervals = forecast_result.conf_int(alpha=alpha)
            
            return {
                'forecast': np.maximum(forecast_values, 0).tolist(),
                'lower_ci': np.maximum(confidence_intervals.iloc[:, 0].values, 0).tolist(),
                'upper_ci': np.maximum(confidence_intervals.iloc[:, 1].values, 0).tolist(),
            }
            
        except Exception as e:
            logger.error(f"✗ Error calculating confidence intervals: {str(e)}")
            raise
