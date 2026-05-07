const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'therapist' },
    specialization: { type: String, default: 'Orthopedic Physiotherapist' },
    yearsOfExperience: { type: Number, default: 8 },
    address: { type: String, default: 'PhysioPath Recovery Clinic, Bengaluru' },
    workingAt: { type: String, default: 'PhysioPath Care Studio' },
    photoUrl: { type: String, default: '' },
    documentName: { type: String, default: 'Physiotherapy License.pdf' },
    isVerified: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8 }
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
