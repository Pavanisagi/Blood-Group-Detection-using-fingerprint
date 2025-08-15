import tensorflow as tf
import tensorflowjs as tfjs

def convert_model():
    # Load the Keras model
    model = tf.keras.models.load_model('blood_group_cnn.h5')
    
    # Convert the model to TensorFlow.js format
    tfjs.converters.save_keras_model(model, 'tfjs_model')
    
    print("Model successfully converted to TensorFlow.js format!")

if __name__ == "__main__":
    convert_model() 