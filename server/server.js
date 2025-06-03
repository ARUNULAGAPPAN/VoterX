require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidates');
const voteRoutes = require('./routes/votes');
// GET /api/users is now in auth.js, so no separate userRoutes needed for just that.

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Mongoose 6 always behaves as if `useCreateIndex` is true and `useFindAndModify` is false, so they are not needed.
        });
        console.log('MongoDB Connected...');

        // Optional: Seed an admin user if not exists
        const User = require('./models/User');
        const adminUser = await User.findOne({ username: 'admin' });
        if (!adminUser) {
            const newAdmin = new User({
                name: 'Administrator',
                username: 'admin',
                password: 'admin123', // This will be hashed by the pre-save hook
                role: 'admin'
            });
            await newAdmin.save();
            console.log('Admin user created.');
        }
         // Optional: Seed a test voter user if not exists
        const testUser = await User.findOne({ username: 'testuser' });
        if (!testUser) {
            const newTestUser = new User({
                name: 'Test Voter',
                username: 'testuser',
                password: 'testpass', // This will be hashed
                role: 'voter'
            });
            await newTestUser.save();
            console.log('Test voter created.');
        }


    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);
// The /api/users route is part of authRoutes now
// app.use('/api/users', userRoutes);

// Basic route for testing server
app.get('/', (req, res) => res.send('Voting App API Running'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));