const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const exists = await User.findOne({ email: 'doctor@physiopath.com' });
        if (exists) {
            console.log('User already exists');
            process.exit(0);
        }
        const user = new User({
            name: 'Meena Sharma',
            email: 'doctor@physiopath.com',
            password: 'password123'
        });
        await user.save();
        console.log('Test therapist created: doctor@physiopath.com / password123');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createUser();
