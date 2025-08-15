import requests
import os

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get('http://localhost:5001/')
        print("Health Check Response:", response.json())
        assert response.status_code == 200
        assert response.json()['status'] == 'ok'
        print("Health check test passed!")
    except Exception as e:
        print(f"Health check test failed: {str(e)}")

def test_prediction():
    """Test the prediction endpoint with a sample image"""
    try:
        # Check if test image exists
        if not os.path.exists('test_fingerprint.bmp'):
            print("Error: test_fingerprint.bmp not found!")
            print("Please place a test fingerprint image in the same directory.")
            return

        # Prepare the image file
        files = {'image': open('test_fingerprint.bmp', 'rb')}
        
        # Make the prediction request
        response = requests.post('http://localhost:5001/predict', files=files)
        
        # Print the response
        print("Prediction Response:", response.json())
        
        # Verify the response
        assert response.status_code == 200
        assert 'blood_group' in response.json()
        assert 'confidence' in response.json()
        print("Prediction test passed!")
        
    except Exception as e:
        print(f"Prediction test failed: {str(e)}")

if __name__ == '__main__':
    print("Starting API tests...")
    test_health_check()
    test_prediction()
    print("All tests completed!") 