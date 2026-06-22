"""
Urban Air Pollution Forecasting Microservice
Flask API for ARIMA-based PM2.5 prediction
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import numpy as np
from model import ArimaForecastModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes (allow requests from React frontend)
CORS(app)

# Initialize ARIMA model instance
# Using order (2, 1, 2) - can be tuned based on data characteristics
forecast_model = ArimaForecastModel(order=(2, 1, 2))


@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    Returns status of the ML service
    """
    return jsonify({
        'success': True,
        'message': 'ML Microservice is running',
        'service': 'ARIMA PM2.5 Forecasting'
    }), 200


@app.route('/predict', methods=['POST'])
def predict():
    """
    Forecast PM2.5 concentrations for next 7 days
    
    Request JSON:
    {
        "values": [list of PM2.5 historical values]
    }
    
    Response JSON:
    {
        "success": true,
        "forecast": [7 forecasted PM2.5 values],
        "forecast_length": 7
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate request
        if not data:
            return jsonify({
                'success': False,
                'message': 'No JSON data provided'
            }), 400
        
        # Extract historical values
        historical_values = data.get('values')
        
        if not historical_values:
            return jsonify({
                'success': False,
                'message': 'No historical values provided'
            }), 400
        
        # Validate that values is a list
        if not isinstance(historical_values, list):
            return jsonify({
                'success': False,
                'message': 'Values must be a list'
            }), 400
        
        # Validate minimum data points
        if len(historical_values) < 7:
            return jsonify({
                'success': False,
                'message': f'Minimum 7 data points required, got {len(historical_values)}'
            }), 400
        
        # Validate that all values are numeric
        try:
            values_array = np.array([float(v) for v in historical_values])
        except (ValueError, TypeError):
            return jsonify({
                'success': False,
                'message': 'All values must be numeric'
            }), 400
        
        # Check for NaN values
        if np.isnan(values_array).any():
            return jsonify({
                'success': False,
                'message': 'Data contains NaN values'
            }), 400
        
        # Get optional parameters
        forecast_days = request.args.get('days', 7, type=int)
        use_confidence_intervals = request.args.get('ci', 'false').lower() == 'true'
        
        # Validate forecast_days
        if forecast_days < 1 or forecast_days > 30:
            forecast_days = 7
        
        logger.info(f"Generating forecast for {len(values_array)} data points, {forecast_days} days ahead")
        
        # Generate forecast
        if use_confidence_intervals:
            result = forecast_model.get_confidence_interval(
                historical_values,
                steps=forecast_days
            )
        else:
            result = {
                'forecast': forecast_model.forecast(
                    historical_values,
                    steps=forecast_days
                )
            }
        
        # Return successful response
        return jsonify({
            'success': True,
            'forecast': result['forecast'],
            'forecast_length': len(result['forecast']),
            'lower_ci': result.get('lower_ci'),
            'upper_ci': result.get('upper_ci'),
        }), 200
        
    except ValueError as e:
        # Handle validation errors
        logger.error(f"Validation error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Validation error: {str(e)}'
        }), 400
        
    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected error in predict: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error generating forecast',
            'error': str(e)
        }), 500


@app.route('/', methods=['GET'])
def root():
    """
    Root endpoint - API information
    """
    return jsonify({
        'success': True,
        'service': 'Urban Air Pollution Forecasting Microservice',
        'version': '1.0.0',
        'endpoints': {
            'POST /predict': 'Generate 7-day PM2.5 forecast',
            'GET /health': 'Health check'
        },
        'usage': {
            'endpoint': '/predict',
            'method': 'POST',
            'body': {
                'values': 'Array of historical PM2.5 values (min 7 points)'
            },
            'query_params': {
                'days': 'Number of days to forecast (1-30, default: 7)',
                'ci': 'Include confidence intervals (true/false, default: false)'
            }
        }
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'message': 'Endpoint not found',
        'path': request.path
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500


if __name__ == '__main__':
    # Run Flask app on port 5000
    logger.info("✓ Starting ML Microservice...")
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
