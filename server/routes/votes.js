const express = require('express');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const router = express.Router();

// POST /api/votes/vote - Cast a vote
router.post('/vote', async (req, res) => {
    const { candidateId, userId } = req.body; // username is also sent for logging, but userId is key

    if (!userId || !candidateId) {
        return res.status(400).json({ message: 'User ID and Candidate ID are required.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (user.hasVoted) {
            return res.status(400).json({ message: 'You have already voted.' });
        }

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found.' });
        }

        // Using a session to manage the transaction could be more robust
        // For simplicity, we'll do two separate updates.
        // In a real-world scenario, ensure these are atomic.
        candidate.votes += 1;
        await candidate.save();

        user.hasVoted = true;
        user.votedFor = candidateId;
        await user.save();

        res.json({ message: 'Vote cast successfully', hasVoted: true });

    } catch (error) {
        console.error('Voting error:', error.message);
        res.status(500).send('Server error during voting.');
    }
});

// GET /api/votes/results - Get vote counts per candidate (public)
router.get('/results', async (req, res) => {
    try {
        const candidates = await Candidate.find().select('name party votes').sort({ votes: -1 });
        // The structure from Candidate model is already suitable: { name, party, votes }
        // If candidateId is needed, ensure it's selected or add it:
        // const results = candidates.map(c => ({ candidateId: c._id, name: c.name, party: c.party, votes: c.votes }));
        res.json(candidates);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;