const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const CompletedPlan = require('../models/CompletedPlan');
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

const getCompletionDate = (plan) => {
    const createdAt = new Date(plan.createdAt);
    return new Date(createdAt.getTime() + (plan.durationWeeks || 4) * 7 * 24 * 60 * 60 * 1000);
};

const archivePlan = async (plan, completedAt = new Date()) => {
    const completed = await CompletedPlan.findOneAndUpdate(
        { therapistId: plan.therapistId, originalPlanToken: plan.token },
        {
            therapistId: plan.therapistId,
            originalPlanToken: plan.token,
            patientName: plan.patientName,
            durationWeeks: plan.durationWeeks,
            exerciseCount: plan.exercises?.length || 0,
            completedAt
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Plan.deleteOne({ _id: plan._id });
    return completed;
};

const archiveCompletedPlans = async (therapistId) => {
    const plans = await Plan.find({ therapistId });
    const now = new Date();
    const completedPlans = plans.filter((plan) => getCompletionDate(plan) <= now);

    if (!completedPlans.length) return [];

    await Promise.all(completedPlans.map((plan) => archivePlan(plan, getCompletionDate(plan))));

    return completedPlans;
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
        await archiveCompletedPlans(req.user.id);
        const plans = await Plan.find({ therapistId: req.user.id })
            .sort({ createdAt: -1 })
            .select('token patientName durationWeeks exercises createdAt updatedAt');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get completed patient records for the logged-in therapist
router.get('/completed', protect, async (req, res) => {
    try {
        await archiveCompletedPlans(req.user.id);
        const completed = await CompletedPlan.find({ therapistId: req.user.id })
            .sort({ completedAt: -1 })
            .select('patientName durationWeeks exerciseCount completedAt originalPlanToken');
        res.json(completed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark a patient plan complete from the patient app once all exercises are done
router.post('/:token/complete', async (req, res) => {
    try {
        const plan = await Plan.findOne({ token: req.params.token });
        if (!plan) {
            const completed = await CompletedPlan.findOne({ originalPlanToken: req.params.token });
            if (completed) return res.json({ completed: true, alreadyArchived: true, record: completed });
            return res.status(404).json({ message: 'Plan not found' });
        }

        const completedExerciseIds = req.body?.completedExerciseIds || [];
        const totalExercises = plan.exercises?.length || 0;
        const completedCount = new Set(completedExerciseIds).size;

        if (!totalExercises || completedCount < totalExercises) {
            return res.status(400).json({
                message: 'Plan is not fully completed yet',
                completedCount,
                totalExercises
            });
        }

        const completed = await archivePlan(plan, new Date());
        res.json({ completed: true, record: completed });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a plan for the logged-in therapist
router.put('/:token', protect, async (req, res) => {
    try {
        const plan = await Plan.findOneAndUpdate(
            { token: req.params.token, therapistId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a plan for the logged-in therapist
router.delete('/:token', protect, async (req, res) => {
    try {
        const plan = await Plan.findOneAndDelete({
            token: req.params.token,
            therapistId: req.user.id
        });
        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.json({ message: 'Plan deleted successfully' });
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
