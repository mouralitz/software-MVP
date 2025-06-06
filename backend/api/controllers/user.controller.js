import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to handle errors
const handleError = (res, error, statusCode = 500) => {
    console.error(error); // Log the error for debugging
    // Avoid sending detailed internal errors to the client
    let message = 'An unexpected error occurred.';
    if (error.name === 'ValidationError') {
        message = Object.values(error.errors).map(val => val.message).join(', ');
        statusCode = 400;
    } else if (error.code === 11000) { // Duplicate key error
        message = 'Username or email already exists.';
        statusCode = 409;
    } else if (statusCode === 400 || statusCode === 401 || statusCode === 404 || statusCode === 409) {
        message = error.message || message; // Use specific error message if provided
    }
    res.status(statusCode).json({ message });
};

// Register a new user
export const register = async (req, res) => {
    try {
        const { username, email, password, isArtisan } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return handleError(res, new Error('Username, email, and password are required.'), 400);
        }
        if (password.length < 6) {
             return handleError(res, new Error('Password must be at least 6 characters long.'), 400);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isArtisan: isArtisan || false // Default to false if not provided
        });

        // Save user to database
        const savedUser = await newUser.save();

        // Don't send password back, even hashed
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({ message: 'User registered successfully!', user: userResponse });

    } catch (error) {
        handleError(res, error);
    }
};

// Login an existing user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return handleError(res, new Error('Username and password are required.'), 400);
        }

        // Find user by username (ensure password is selected)
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return handleError(res, new Error('Invalid credentials.'), 401); // User not found
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return handleError(res, new Error('Invalid credentials.'), 401); // Password mismatch
        }

        // Check if JWT_SECRET is set
        if (!JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables.');
            return handleError(res, new Error('Authentication configuration error.'), 500);
        }

        // Generate JWT token
        const payload = {
            id: user._id,
            username: user.username,
            isArtisan: user.isArtisan
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

        res.status(200).json({
            message: 'Login successful!',
            token,
            userId: user._id,
            username: user.username,
            isArtisan: user.isArtisan
        });

    } catch (error) {
        handleError(res, error);
    }
};

