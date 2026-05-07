const mongoose = require('mongoose');

const completedPlanSchema = new mongoose.Schema({
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalPlanToken: { type: String, required: true },
    patientName: { type: String, required: true },
    durationWeeks: { type: Number, default: 4 },
    exerciseCount: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

completedPlanSchema.index({ therapistId: 1, originalPlanToken: 1 }, { unique: true });

module.exports = mongoose.model('CompletedPlan', completedPlanSchema);
