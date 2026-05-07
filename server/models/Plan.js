const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    order: { type: Number, required: true },
    instruction: { type: String, required: true },
    imageUrl: { type: String }
});

const exerciseSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    muscleGroup: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    restSeconds: { type: Number, default: 30 },
    steps: [stepSchema],
    mistakes: [String]
});

const planSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    durationWeeks: { type: Number, default: 4 },
    exercises: [exerciseSchema],
    completedExerciseIds: [{ type: String }],
    progressPercent: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    lastProgressAt: { type: Date },
    expiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
