import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Activity, Bone, Dumbbell, HeartPulse, Mail, Lock, Loader2, Pill, StretchHorizontal } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
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
                    <h1>PhysioPath</h1>
                    <p>Therapist Portal Access</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="input-group">
                        <label><Mail size={18} /> Email Address</label>
                        <input 
                            type="email" 
                            placeholder="doctor@physiopath.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label><Lock size={18} /> Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="login-btn">
                        {loading ? <Loader2 className="spin" /> : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>New to PhysioPath? <Link to="/register">Create therapist account</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
