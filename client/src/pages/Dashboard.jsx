import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, User, LogOut, Calendar, ClipboardList } from 'lucide-react';
import api from '../api/client';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    // In a real app, we would fetch plans from the backend
    // For now, we show the dashboard layout
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>PhysioPath</h1>
                </div>
                <div className="header-right">
                    <div className="user-info">
                        <User size={20} />
                        <span>Dr. {user?.name || 'Therapist'}</span>
                    </div>
                    <button onClick={logout} className="logout-btn">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="content-header">
                    <h2>Active Patient Plans</h2>
                    <button onClick={() => navigate('/builder')} className="create-plan-btn">
                        <Plus size={20} /> New Plan
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">Loading plans...</div>
                ) : plans.length === 0 ? (
                    <div className="empty-state">
                        <ClipboardList size={60} />
                        <h3>No Active Plans</h3>
                        <p>Start by creating a personalized exercise plan for your patient.</p>
                        <button onClick={() => navigate('/builder')} className="secondary-btn">
                            Create Your First Plan
                        </button>
                    </div>
                ) : (
                    <div className="plans-grid">
                        {/* Plans will be mapped here */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
