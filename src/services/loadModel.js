import tf from '@tensorflow/tfjs-node';
import 'dotenv/config';

export const initializeModel = async () => {
  try {
    return await tf.loadGraphModel(process.env.MODEL_URL);
  } catch (err) {
    console.error('Error loading model:', err);
    throw err;
  }
};
