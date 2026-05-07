import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Bone, Dumbbell, HeartPulse, Loader2, Lock, Mail, Pill, StretchHorizontal, User } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', { name, email, password });
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try another email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="auth-floating-icons" aria-hidden="true">
                <span><HeartPulse /></span>
                <span><Dumbbell /></span>
                <span><Activity /></span>
                <span><Bone /></span>
                <span><StretchHorizontal /></span>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-card"
            >
                <div className="login-header">
                    <div className="logo-icon">
                        <Pill size={40} color="#1A7A4A" />
                    </div>
                    <h1>Create Account</h1>
                    <p>Therapist access for PhysioPath</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="input-group">
                        <label><User size={18} /> Full Name</label>
                        <input
                            type="text"
                            placeholder="Dr. Meena Sharma"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label><Mail size={18} /> Email Address</label>
                        <input
                            type="email"
                            placeholder="doctor@physiopath.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label><Lock size={18} /> Password</label>
                        <input
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="login-btn">
                        {loading ? <Loader2 className="spin" /> : 'Create Account'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Already registered? <Link to="/login">Sign in</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
