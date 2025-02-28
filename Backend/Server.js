import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';

// Initialize express app
const app = express();

// Enable CORS for frontend communication
app.use(cors({
    origin: 'http://localhost:5173', // ✅ Correct
    credentials: true
}));


// // Load environment variables
dotenv.config();



// Define a test route
app.get("/", (req, res) => {
    res.send("Hello, Express server is running");
});

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});
app.use(express.json())
//routes
app.use('/',authRoutes)

// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI, {})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.log('MongoDB connection error:', error));
