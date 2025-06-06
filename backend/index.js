import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './api/config/db.js';
import userRoutes from './api/routes/user.route.js';
import productRoutes from './api/routes/product.route.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Basic root route
app.get('/', (req, res) => {
    res.send('ArteCraft Backend API is running...');
});

// Global error handler (optional basic example)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

