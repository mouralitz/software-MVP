import express from 'express';
import productRoutes from './routes/product.route.js';
import userRoutes from './routes/user.route.js';
import serverless from 'serverless-http';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

export const handler = serverless(app);