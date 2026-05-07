import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ClipboardList, Copy, ExternalLink, LogOut, Plus, QrCode, TrendingUp, User, Users } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const response = await api.get('/plans');
                setPlans(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load plans');
            } finally {
                setLoading(false);
            }
        };

        loadPlans();
    }, []);

    const metrics = useMemo(() => {
        const exerciseCount = plans.reduce((sum, plan) => sum + (plan.exercises?.length || 0), 0);
        const sharedThisWeek = plans.filter((plan) => {
            const created = new Date(plan.createdAt);
            return Date.now() - created.getTime() <= 7 * 24 * 60 * 60 * 1000;
        }).length;

        return {
            activePatients: plans.length,
            exerciseCount,
            sharedThisWeek
        };
    }, [plans]);

    const copyPatientLink = async (token) => {
        const link = `${window.location.origin}/patient/${token}`;
        await navigator.clipboard.writeText(link);
        alert('Patient link copied');
    };

    return (
        <div className="doctor-shell">
            <aside className="doctor-sidebar">
                <div className="brand-lockup">
                    <span className="brand-mark">P</span>
                    <div>
                        <strong>PhysioPath</strong>
                        <span>Therapist console</span>
                    </div>
                </div>
                <nav>
                    <button className="active"><ClipboardList size={18} /> Plans</button>
                    <button><Users size={18} /> Patients</button>
                    <button><Activity size={18} /> Progress</button>
                </nav>
            </aside>

            <main className="doctor-main">
                <header className="doctor-header">
                    <div>
                        <span className="eyebrow">Doctor dashboard</span>
                        <h1>Welcome, Dr. {user?.name || 'Therapist'}</h1>
                    </div>
                    <div className="doctor-actions">
                        <div className="user-chip">
                            <User size={18} />
                            Clinic mode
                        </div>
                        <button className="icon-btn" onClick={logout} aria-label="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                <section className="doctor-hero-banner">
                    <div>
                        <span className="eyebrow">Digital physiotherapy care</span>
                        <h2>Boost every patient's recovery journey</h2>
                        <p>Create guided programs, share no-login patient links, and deliver calm multilingual exercise coaching at home.</p>
                        <button onClick={() => navigate('/builder')} className="hero-cta">
                            New patient plan
                        </button>
                    </div>
                    <aside className="hero-glass-stat">
                        <strong>{metrics.activePatients || 1}+</strong>
                        <span>Active recovery plans</span>
                    </aside>
                </section>

                <section className="doctor-metrics">
                    <article>
                        <Users size={22} />
                        <strong>{metrics.activePatients}</strong>
                        <span>Active patients</span>
                    </article>
                    <article>
                        <TrendingUp size={22} />
                        <strong>{metrics.exerciseCount}</strong>
                        <span>Exercises prescribed</span>
                    </article>
                    <article>
                        <QrCode size={22} />
                        <strong>{metrics.sharedThisWeek}</strong>
                        <span>Shared this week</span>
                    </article>
                </section>

                <section className="doctor-panel">
                    <div className="panel-title-row">
                        <div>
                            <span className="eyebrow">Prescription workflow</span>
                            <h2>Patient plans</h2>
                        </div>
                        <button onClick={() => navigate('/builder')} className="create-plan-btn">
                            <Plus size={18} />
                            New plan
                        </button>
                    </div>

                    {loading && <div className="empty-state compact">Loading plans...</div>}
                    {error && <div className="error-message">{error}</div>}

                    {!loading && !error && plans.length === 0 && (
                        <div className="empty-state compact">
                            No plans yet. Create a prescription to generate a patient QR/link.
                        </div>
                    )}

                    {!loading && plans.length > 0 && (
                        <div className="patient-table">
                            {plans.map((plan) => (
                                <article key={plan.token}>
                                    <div>
                                        <strong>{plan.patientName}</strong>
                                        <span>{plan.exercises?.length || 0} exercises • {plan.durationWeeks} weeks</span>
                                    </div>
                                    <div className="adherence-bar">
                                        <span style={{ width: '100%' }} />
                                    </div>
                                    <strong>{new Date(plan.createdAt).toLocaleDateString()}</strong>
                                    <div className="table-actions">
                                        <button onClick={() => copyPatientLink(plan.token)} aria-label="Copy patient link">
                                            <Copy size={16} />
                                        </button>
                                        <button onClick={() => window.open(`/patient/${plan.token}`, '_blank')} aria-label="Open patient plan">
                                            <ExternalLink size={16} />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="doctor-panel guide-panel">
                    <img className="panel-illustration" src="/medical-plan.svg" alt="" />
                    <div>
                        <h2>Create a no-login patient plan</h2>
                        <p>Build the exercise prescription, generate a QR/link, and the patient gets an offline-ready guided routine.</p>
                    </div>
                    <button onClick={() => navigate('/builder')} className="secondary-action">
                        Start builder
                    </button>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
