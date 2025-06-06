import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        trim: true
        // Consider using an enum if categories are predefined
        // enum: ['Cerâmica', 'Tecidos', 'Joias', 'Madeira', 'Decoração', 'Acessórios']
    },
    imageUrl: {
        type: String,
        trim: true
        // Basic validation for URL format could be added
    },
    artisan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        // Add validation to ensure the referenced User has isArtisan: true
    }
}, { timestamps: true });

// Indexing fields that might be queried often
productSchema.index({ category: 1 });
productSchema.index({ artisan: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;

