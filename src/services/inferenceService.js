import tf from '@tensorflow/tfjs-node';

export const classifyImage = async (model, imageBuffer) => {
  try {
    const inputTensor = tf.node.decodeJpeg(imageBuffer)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const predictions = model.predict(inputTensor);
    const scores = await predictions.data();
    const maxScore = Math.max(...scores) * 100;

    const label = maxScore > 50 ? 'Cancer' : 'Non-cancer';
    const advice = label === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

    return { result: label, suggestion: advice };
  } catch (err) {
    console.error('Error during classification:', err);
    return null;
  }
};
