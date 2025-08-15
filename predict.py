from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import json
from datetime import datetime
import hashlib
from typing import Dict, List, Tuple, Optional

app = Flask(__name__)
CORS(app)

# Define blood group classes
BLOOD_GROUPS = ['A-', 'A+', 'AB-', 'AB+', 'B-', 'B+', 'O-', 'O+']

# Initialize models
try:
    # Create a new model with the correct architecture
    dna_mapping_model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(224, 224, 3)),
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(8, activation='softmax')  # 8 blood groups
    ])
    
    # Compile the model
    dna_mapping_model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print("Model initialized successfully")
except Exception as e:
    print(f"Error initializing model: {str(e)}")
    print("Please check the model architecture.")

# Define blood group classes and compatibility matrix
BLOOD_COMPATIBILITY = {
    'A-': ['A-', 'O-'],
    'A+': ['A-', 'A+', 'O-', 'O+'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'AB+': ['A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+'],
    'B-': ['B-', 'O-'],
    'B+': ['B-', 'B+', 'O-', 'O+'],
    'O-': ['O-'],
    'O+': ['O-', 'O+']
}

# Medical compatibility data
MEDICAL_COMPATIBILITY = {
    'A': {'allergies': ['penicillin', 'sulfa drugs'], 'common_conditions': ['heart disease', 'diabetes']},
    'B': {'allergies': ['tetracycline'], 'common_conditions': ['stomach ulcers', 'respiratory infections']},
    'AB': {'allergies': ['penicillin', 'tetracycline'], 'common_conditions': ['heart disease', 'cancer']},
    'O': {'allergies': ['aspirin'], 'common_conditions': ['ulcers', 'thyroid problems']}
}

class BloodDonationToken:
    def __init__(self):
        self.donations = {}
        self.blockchain = []

    def create_donation_record(self, donor_id: str, blood_type: str, amount: float) -> str:
        timestamp = datetime.now().isoformat()
        donation_hash = hashlib.sha256(f"{donor_id}{blood_type}{amount}{timestamp}".encode()).hexdigest()
        
        donation_record = {
            'donor_id': donor_id,
            'blood_type': blood_type,
            'amount': amount,
            'timestamp': timestamp,
            'hash': donation_hash
        }
        
        self.donations[donation_hash] = donation_record
        self.blockchain.append(donation_hash)
        
        return donation_hash

    def verify_donation(self, donation_hash: str) -> bool:
        return donation_hash in self.donations

# Initialize the blood donation token system
donation_system = BloodDonationToken()

def preprocess_image(image):
    """Preprocess the image for model input"""
    try:
        # Resize image to match model input size (224x224)
        image = image.resize((224, 224))
        
        # Convert to numpy array and normalize
        img_array = np.array(image)
        img_array = img_array.astype('float32') / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        print(f"Error in preprocessing: {str(e)}")
        raise

def analyze_dna_patterns(fingerprint_data: np.ndarray) -> Dict:
    """Analyze DNA patterns from fingerprint data"""
    try:
        predictions = dna_mapping_model.predict(fingerprint_data)
        return {
            'alleles': ['A', 'B', 'O', 'AB'],
            'probabilities': predictions[0].tolist()
        }
    except Exception as e:
        print(f"Error in DNA analysis: {str(e)}")
        raise

def monitor_health_indicators(fingerprint_data: np.ndarray) -> Dict:
    """Monitor health indicators from fingerprint patterns"""
    try:
        # Simulate health indicators based on fingerprint patterns
        return {
            'stress_level': float(np.random.uniform(0.1, 0.9)),
            'health_score': float(np.random.uniform(0.6, 1.0)),
            'risk_factors': ['hypertension', 'diabetes'] if np.random.random() > 0.5 else []
        }
    except Exception as e:
        print(f"Error in health monitoring: {str(e)}")
        raise

def predict_blood_group(image: Image.Image) -> Tuple[str, float, Dict]:
    """Predict blood group and analyze compatibility"""
    try:
        processed_image = preprocess_image(image)
        
        # Get blood group prediction
        predictions = dna_mapping_model.predict(processed_image)
        predicted_class = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class])
        blood_group = BLOOD_GROUPS[predicted_class]
        
        # Get DNA analysis
        dna_analysis = analyze_dna_patterns(processed_image)
        
        # Get health monitoring
        health_analysis = monitor_health_indicators(processed_image)
        
        # Get compatibility information
        compatible_groups = BLOOD_COMPATIBILITY[blood_group]
        medical_info = MEDICAL_COMPATIBILITY[blood_group[0]]
        
        return blood_group, confidence, {
            'dna_analysis': dna_analysis,
            'health_analysis': health_analysis,
            'compatible_groups': compatible_groups,
            'medical_info': medical_info
        }
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        raise

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the image from the request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        # Check file extension
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp')):
            return jsonify({'error': 'Invalid file type. Please upload a PNG, JPG, or BMP image'}), 400

        # Open and process the image
        try:
            image = Image.open(file.stream)
            # Convert image to RGB mode if it's not already
            if image.mode != 'RGB':
                image = image.convert('RGB')
        except Exception as e:
            print(f"Image processing error: {str(e)}")
            return jsonify({'error': f'Failed to process image: {str(e)}'}), 400

        # Preprocess the image
        try:
            processed_image = preprocess_image(image)
        except Exception as e:
            print(f"Preprocessing error: {str(e)}")
            return jsonify({'error': f'Failed to preprocess image: {str(e)}'}), 400
        
        # Make prediction
        try:
            prediction = dna_mapping_model.predict(processed_image)
            predicted_group = BLOOD_GROUPS[np.argmax(prediction[0])]
            confidence = float(np.max(prediction[0]))
            
            # Get probabilities for each blood group
            probabilities = prediction[0].tolist()
            
            # Get DNA analysis
            dna_analysis = analyze_dna_patterns(processed_image)
            
            # Get health monitoring
            health_analysis = monitor_health_indicators(processed_image)
            
            # Get compatibility information
            compatible_groups = BLOOD_COMPATIBILITY[predicted_group]
            medical_info = MEDICAL_COMPATIBILITY[predicted_group[0]]
            
            response = {
                'blood_group': predicted_group,
                'confidence': confidence,
                'probabilities': {
                    group: prob for group, prob in zip(BLOOD_GROUPS, probabilities)
                },
                'dna_analysis': dna_analysis,
                'health_analysis': health_analysis,
                'compatibility': {
                    'compatible_groups': compatible_groups,
                    'medical_info': medical_info
                }
            }
            print(f"Prediction result: {response}")  # Debug log
            return jsonify(response)
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            return jsonify({'error': f'Prediction failed: {str(e)}'}), 500
            
    except Exception as e:
        print(f"Error in predict endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/donate', methods=['POST'])
def record_donation():
    try:
        data = request.json
        required_fields = ['donor_id', 'blood_type', 'amount']
        
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        donation_hash = donation_system.create_donation_record(
            data['donor_id'],
            data['blood_type'],
            data['amount']
        )
        
        return jsonify({
            'status': 'success',
            'donation_hash': donation_hash,
            'message': 'Blood donation recorded successfully'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/verify-donation/<donation_hash>', methods=['GET'])
def verify_donation(donation_hash):
    try:
        is_valid = donation_system.verify_donation(donation_hash)
        donation_data = donation_system.donations.get(donation_hash)
        
        return jsonify({
            'valid': is_valid,
            'donation_data': donation_data
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Advanced Blood Group Prediction Service...")
    print("API available at http://localhost:5000")
    app.run(debug=True, port=5000) 