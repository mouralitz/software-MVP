import Product from '../models/Product.js';
import User from '../models/User.js'; // Needed for validation potentially

// Helper function to handle errors (similar to user.controller)
const handleError = (res, error, statusCode = 500) => {
    console.error(error); // Log the error for debugging
    let message = 'An unexpected error occurred while processing products.';
    if (error.name === 'ValidationError') {
        message = Object.values(error.errors).map(val => val.message).join(', ');
        statusCode = 400;
    } else if (statusCode === 400 || statusCode === 401 || statusCode === 403 || statusCode === 404) {
        message = error.message || message;
    }
    res.status(statusCode).json({ message });
};

// Create a new product (Requires authentication and user must be an artisan)
export const createProduct = async (req, res) => {
    try {
        // User information should be attached to req by the auth middleware
        if (!req.user || !req.user.isArtisan) {
            return handleError(res, new Error('Forbidden: Only artisans can create products.'), 403);
        }

        const { name, description, price, category, imageUrl } = req.body;

        // Basic validation
        if (!name || price === undefined) { // price can be 0, so check for undefined
            return handleError(res, new Error('Product name and price are required.'), 400);
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            imageUrl,
            artisan: req.user.id // Assign the authenticated artisan's ID
        });

        const savedProduct = await newProduct.save();
        // Populate artisan info before sending response
        const populatedProduct = await Product.findById(savedProduct._id).populate('artisan', 'username');
        res.status(201).json(populatedProduct);

    } catch (error) {
        handleError(res, error);
    }
};

// List all products (Public access)
export const listProducts = async (req, res) => {
    try {
        // Populate artisan username for display on the frontend
        const products = await Product.find().populate('artisan', 'username'); 
        
        res.status(200).json(products);

    } catch (error) {
        handleError(res, error);
    }
};

// Note: Functions for getProductById, updateProduct, deleteProduct are NOT implemented
// as they are outside the defined MVP scope (Won't Have).

