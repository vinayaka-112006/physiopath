const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const CompletedPlan = require('../models/CompletedPlan');
const User = require('../models/User');
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

const archivePlan = async (plan, completedAt = new Date()) => {
    plan.completedExerciseIds = plan.exercises.map((exercise) => exercise.id);
    plan.progressPercent = 100;
    plan.status = 'completed';
    plan.lastProgressAt = completedAt;
    await plan.save();

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

    return completed;
};

const applyPlanProgress = async (plan, completedExerciseIds = []) => {
    const uniqueIds = [...new Set(completedExerciseIds.map(String))];
    const totalExercises = plan.exercises?.length || 0;
    const validCompleted = uniqueIds.filter((id) => plan.exercises.some((exercise) => exercise.id === id));
    const progressPercent = totalExercises ? Math.round((validCompleted.length / totalExercises) * 100) : 0;

    plan.completedExerciseIds = validCompleted;
    plan.progressPercent = progressPercent;
    plan.status = progressPercent >= 100 ? 'completed' : progressPercent > 0 ? 'in_progress' : 'pending';
    plan.lastProgressAt = new Date();
    await plan.save();
    return plan;
};

const archiveCompletedPlans = async (therapistId) => {
    const plans = await Plan.find({ therapistId });
    const completedPlans = plans.filter((plan) => plan.status === 'completed' || plan.progressPercent >= 100);

    if (!completedPlans.length) return [];

    await Promise.all(completedPlans.map((plan) => archivePlan(plan, plan.lastProgressAt || new Date())));

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
            .select('token patientName durationWeeks exercises completedExerciseIds progressPercent status lastProgressAt createdAt updatedAt');
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
        await applyPlanProgress(plan, completedExerciseIds);
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

// Sync patient progress without requiring login
router.post('/:token/progress', async (req, res) => {
    try {
        const plan = await Plan.findOne({ token: req.params.token });
        if (!plan) {
            const completed = await CompletedPlan.findOne({ originalPlanToken: req.params.token });
            if (completed) return res.json({ status: 'completed', progressPercent: 100, alreadyArchived: true });
            return res.status(404).json({ message: 'Plan not found' });
        }

        const updatedPlan = await applyPlanProgress(plan, req.body?.completedExerciseIds || []);
        res.json({
            status: updatedPlan.status,
            progressPercent: updatedPlan.progressPercent,
            completedExerciseIds: updatedPlan.completedExerciseIds
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rate the doctor assigned to a patient plan
router.post('/:token/rate', async (req, res) => {
    try {
        const rating = Number(req.body?.rating);
        if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        const plan = await Plan.findOne({ token: req.params.token }).select('therapistId');
        const completedPlan = plan ? null : await CompletedPlan.findOne({ originalPlanToken: req.params.token }).select('therapistId');
        const therapistId = plan?.therapistId || completedPlan?.therapistId;

        if (!therapistId) {
            return res.status(404).json({ message: 'Doctor for this plan was not found.' });
        }

        const doctor = await User.findById(therapistId).select('rating ratingCount');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found.' });

        const currentCount = doctor.ratingCount || 0;
        const currentTotal = (doctor.rating || 0) * currentCount;
        const nextCount = currentCount + 1;
        const nextRating = Math.round(((currentTotal + rating) / nextCount) * 10) / 10;

        const updatedDoctor = await User.findByIdAndUpdate(
            therapistId,
            { rating: nextRating, ratingCount: nextCount },
            { new: true }
        ).select('rating ratingCount');

        res.json({
            message: 'Doctor rating updated',
            rating: updatedDoctor.rating,
            ratingCount: updatedDoctor.ratingCount
        });
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
