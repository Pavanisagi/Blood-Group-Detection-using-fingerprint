# Advanced Blood Group Prediction System

An innovative AI-powered system that predicts blood groups from fingerprint patterns using advanced deep learning techniques and provides comprehensive health analysis.

## Features

### 1. AI-Based Fingerprint DNA Mapping 🧬
- Advanced CNN models analyze fingerprint ridge patterns
- DNA sequence prediction from fingerprint patterns
- High-accuracy blood group prediction
- Support for rare blood type detection

### 2. Blood Group Compatibility Analysis 🏥
- Real-time compatibility checking
- Medical compatibility information
- Allergen detection and warnings
- Personalized medical recommendations

### 3. Holographic 3D Visualization 🔬
- Interactive 3D fingerprint analysis
- Real-time ridge pattern mapping
- AI decision visualization
- WebXR support for AR/VR viewing

### 4. Health Monitoring System 🩸
- Stress level detection
- Health score calculation
- Risk factor analysis
- Real-time health indicators

### 5. Blood Donation Tracking System 💉
- Blockchain-based donation records
- BloodCoin reward system
- Donation history tracking
- Verification system

## Technical Stack

### Backend
- Python 3.8+
- TensorFlow 2.x
- Flask
- NumPy
- Pillow

### Frontend
- React
- TypeScript
- Material-UI
- Three.js
- Axios

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blood-group-predictor.git
cd blood-group-predictor
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Start the backend server:
```bash
python predict.py
```

5. Start the frontend development server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Usage

1. Upload a fingerprint image (BMP format)
2. Wait for the AI analysis
3. View the comprehensive results including:
   - Blood group prediction
   - DNA analysis
   - Health indicators
   - Compatibility information
   - 3D visualization

## API Endpoints

- `GET /`: Health check endpoint
- `POST /predict`: Blood group prediction endpoint
- `POST /donate`: Record blood donation
- `GET /verify-donation/<hash>`: Verify donation record

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to all contributors
- Built with advanced AI technology
- Powered by blockchain for secure donation tracking
