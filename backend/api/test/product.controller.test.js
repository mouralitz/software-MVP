import request from 'supertest';
import express from 'express';
import productRoutes from '../routes/product.route.js';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('Product Controller', () => {
  it('deve retornar lista de produtos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve retornar erro ao criar produto sem dados', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});