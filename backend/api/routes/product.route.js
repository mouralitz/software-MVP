import express from 'express';
import { createProduct, listProducts } from '../controllers/product.controller.js';
import { authenticateToken, isArtisan } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/products - Create a new product (Requires Auth & Artisan Role)
router.post('/', authenticateToken, isArtisan, createProduct);

// GET /api/products - List all products (Public)
router.get('/', listProducts);

// Note: Routes for getById, update, delete are intentionally omitted (Won't Have for MVP)

export default router;

