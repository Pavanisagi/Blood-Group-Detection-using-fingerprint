# Fingerprint Blood Group Predictor

A streamlined AI-driven system that leverages convolutional neural networks to predict blood groups from fingerprint images—a novel approach that merges biometrics with deep learning for non-invasive blood group detection.

## Features

- **Fingerprint-Based Prediction**: Utilizes CNN to analyze fingerprint patterns and predict blood group.
- **Blood Group Compatibility Checker**: Provides donor-recipient compatibility insights.
- **Donation Tracking**: (Optional) Record and view donation history.

## Tech Stack

- **Backend**:  
  - Python 3.x  
  - TensorFlow / Keras (or PyTorch)  
  - Flask (API layer)  

- **Frontend**:  
  - React (optional, for visualization)  

## Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/fingerprint-blood-group-predictor.git
   cd fingerprint-blood-group-predictor
##Install Python dependencies
   pip install -r requirements.txt

##Prepare dataset

>Store fingerprint images in the dataset/ folder.

>Organize subfolders by blood group labels (A, B, AB, O).


##Train the model

python train.py

##Run predictions

python predict.py --image path/to/fingerprint.jpg




Project Workflow

Image Preprocessing: Converts fingerprint image to grayscale, resizes, and normalizes pixel values.

Model Training: CNN learns ridge and bifurcation patterns unique to each blood group.

Prediction: Trained model outputs the most probable blood group for the given fingerprint.


Future Enhancements

Improve accuracy with larger and more diverse datasets.

Add mobile app integration for real-time prediction.

Implement blood donation compatibility checker.
