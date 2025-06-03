const express = require('express');
const User = require('../models/User');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        user = new User({ name, username, password, role: 'voter' }); // Default role voter
        await user.save();
        res.status(201).json({ message: 'Voter registered successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // For simplicity, sending role and basic info. No session/JWT as per prompt.
        // Client will store this in localStorage.
        res.json({
            message: 'Login successful',
            userId: user._id,
            username: user.username,
            role: user.role,
            hasVoted: user.hasVoted
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// GET /api/users (For Admin: List of voters with voting status)
// Add admin check middleware in a real app
router.get('/users', async (req, res) => {
    try {
        // For simplicity, assuming an admin check is done by frontend route protection
        // In a real app, add backend middleware to verify admin role from a token/session
        const users = await User.find({ role: 'voter' }).select('-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;