import { Firestore } from '@google-cloud/firestore';
import 'dotenv/config';

import path from 'path';

const firestore = new Firestore({
  keyFilename: path.resolve('src/services/serviceKey.json'),
  projectId: process.env.PROJECT_ID,
});


export const saveHistory = async (record) => {
  try {
    const collectionRef = firestore.collection('predictions');
    await collectionRef.doc(record.id).set(record);
    return true;
  } catch (err) {
    console.error('Error saving history:', err);
    return false;
  }
};

export const retrieveHistory = async () => {
  try {
    const snapshot = await firestore.collection('predictions').get();
    return snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
  } catch (err) {
    console.error('Error retrieving histories:', err);
    return [];
  }
};
