import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    if (!MONGO_URI) {
        console.error('FATAL ERROR: MONGO_URI is not defined in .env file');
        process.exit(1); // Exit process with failure
    }
    try {
        await mongoose.connect(MONGO_URI, {
            // Options to avoid deprecation warnings (though defaults are generally fine now)
            // useNewUrlParser: true, 
            // useUnifiedTopology: true,
            // useCreateIndex: true, // Not needed in Mongoose 6+
            // useFindAndModify: false // Not needed in Mongoose 6+
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;

