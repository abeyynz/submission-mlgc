import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { bodyLimit } from 'hono/body-limit';
import crypto from 'crypto';

import { initializeModel } from './services/loadModel.js';
import { classifyImage } from './services/inferenceService.js';
import { retrieveHistory, saveHistory } from './services/history.js';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST']
}));

app.get('/', (ctx) => ctx.json({ message: 'Welcome!' }));

app.post('/predict', bodyLimit({
  maxSize: 1024 * 1024, // 1 MB
  onError: (ctx) => ctx.json({
    status: "fail",
    message: "Payload content length greater than maximum allowed: 1000000"
  }, 413)
}), async (ctx) => {
  const { image } = await ctx.req.parseBody();

  if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
    return ctx.json({ status: 'fail', message: 'Only JPEG and PNG formats are supported' }, 400);
  }

  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const model = await initializeModel();

  const prediction = await classifyImage(model, imageBuffer);

  if (!prediction) {
    return ctx.json({ status: 'fail', message: 'Terjadi kesalahan dalam melakukan prediksi' }, 400);
  }

  const record = {
    id: crypto.randomUUID(),
    ...prediction,
    createdAt: new Date().toISOString()
  };

  await saveHistory(record);

  return ctx.json({ status: 'success', data: record , message: 'Model is predicted successfully'}, 201);
});

app.get('/predict/histories', async (ctx) => {
  const histories = await retrieveHistory();
  return ctx.json({ status: 'success', data: histories });
});

const port = process.env.PORT || 8080; 
serve({ fetch: app.fetch, port });
