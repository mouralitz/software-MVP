import express from 'express';
import { register, login } from '../controllers/user.controller.js';

const router = express.Router();

// POST /api/users/register - Register a new user
router.post('/register', register);

// POST /api/users/login - Login a user
router.post('/login', login);

export default router;

