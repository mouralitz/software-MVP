import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables.');
        return res.status(500).json({ message: 'Authentication configuration error.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            // Differentiate between expired token and invalid token
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized: Token has expired.' });
            }
            return res.status(403).json({ message: 'Forbidden: Invalid token.' }); // Token is invalid
        }
        
        // Attach user payload to the request object
        req.user = user; 
        next(); // Proceed to the next middleware or route handler
    });
};

// Middleware to check if the authenticated user is an artisan
const isArtisan = (req, res, next) => {
    // This middleware should run *after* authenticateToken
    if (!req.user || !req.user.isArtisan) {
        return res.status(403).json({ message: 'Forbidden: Access restricted to artisans.' });
    }
    next();
};

export { authenticateToken, isArtisan };

