const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Middleware to protect therapist routes
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Create a new plan (Therapist only)
router.post('/', protect, async (req, res) => {
    try {
        const token = crypto.randomBytes(8).toString('hex');
        const plan = new Plan({
            ...req.body,
            token,
            therapistId: req.user.id
        });
        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all plans for the logged-in therapist
router.get('/', protect, async (req, res) => {
    try {
        const plans = await Plan.find({ therapistId: req.user.id })
            .sort({ createdAt: -1 })
            .select('token patientName durationWeeks exercises createdAt updatedAt');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a plan by token (Patient - No auth required as per PRD)
router.get('/:token', async (req, res) => {
    try {
        const plan = await Plan.findOne({ token: req.params.token });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
