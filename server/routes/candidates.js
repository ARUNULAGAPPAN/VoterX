const express = require('express');
const Candidate = require('../models/Candidate');
const router = express.Router();

// Middleware to check for admin (simplified, use proper auth in production)
const isAdmin = (req, res, next) => {
    // This is a placeholder. In a real app, you'd check a session or token.
    // For now, we assume if the request reaches these admin-only routes,
    // the frontend has done its role check.
    // const { userRole } = req.session; // example if using express-session
    // if (userRole === 'admin') next();
    // else res.status(403).json({ message: 'Access denied. Admin only.' });
    next(); // For this exercise, proceed
};

// GET /api/candidates - Get all candidates (public)
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ name: 1 });
        res.json(candidates);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/candidates/add - Add a new candidate (admin only)
router.post('/add', isAdmin, async (req, res) => {
    const { name, party } = req.body;
    try {
        let candidate = await Candidate.findOne({ name });
        if (candidate) {
            return res.status(400).json({ message: 'Candidate already exists' });
        }
        candidate = new Candidate({ name, party });
        await candidate.save();
        res.status(201).json(candidate);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// PUT /api/candidates/:id - Update a candidate (admin only)
router.put('/:id', isAdmin, async (req, res) => {
    const { name, party } = req.body;
    try {
        let candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        candidate.name = name || candidate.name;
        candidate.party = party || candidate.party;
        await candidate.save();
        res.json(candidate);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// DELETE /api/candidates/:id - Delete a candidate (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        await candidate.deleteOne(); // Use deleteOne() or remove() based on Mongoose version
        res.json({ message: 'Candidate removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;