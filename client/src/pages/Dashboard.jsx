import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    CalendarDays,
    ClipboardList,
    Copy,
    Edit3,
    ExternalLink,
    LogOut,
    Plus,
    QrCode,
    TrendingUp,
    Trash2,
    User,
    Users
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('plans');

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

    const deletePlan = async (plan) => {
        const confirmed = window.confirm(`Delete ${plan.patientName}'s exercise plan? This cannot be undone.`);
        if (!confirmed) return;

        try {
            await api.delete(`/plans/${plan.token}`);
            setPlans((currentPlans) => currentPlans.filter((item) => item.token !== plan.token));
        } catch (err) {
            alert(err.response?.data?.message || 'Unable to delete this plan.');
        }
    };

    const renderEmpty = (message) => (
        <div className="empty-state compact">{message}</div>
    );

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
                    <button className={activeTab === 'plans' ? 'active' : ''} onClick={() => setActiveTab('plans')}>
                        <ClipboardList size={20} /> Plans
                    </button>
                    <button className={activeTab === 'patients' ? 'active' : ''} onClick={() => setActiveTab('patients')}>
                        <Users size={20} /> Patients
                    </button>
                    <button className={activeTab === 'progress' ? 'active' : ''} onClick={() => setActiveTab('progress')}>
                        <Activity size={20} /> Progress
                    </button>
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

                {activeTab === 'plans' && (
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

                        {loading && renderEmpty('Loading plans...')}
                        {error && <div className="error-message">{error}</div>}
                        {!loading && !error && plans.length === 0 && renderEmpty('No plans yet. Create a prescription to generate a patient QR/link.')}

                        {!loading && plans.length > 0 && (
                            <div className="patient-table">
                                {plans.map((plan) => (
                                    <article key={plan.token}>
                                        <div>
                                            <strong>{plan.patientName}</strong>
                                            <span>{plan.exercises?.length || 0} exercises · {plan.durationWeeks} weeks</span>
                                        </div>
                                        <div className="adherence-bar">
                                            <span style={{ width: '100%' }} />
                                        </div>
                                        <strong>{new Date(plan.createdAt).toLocaleDateString()}</strong>
                                        <div className="table-actions">
                                            <button onClick={() => navigate(`/builder/${plan.token}`)} aria-label="Edit patient exercise details">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => copyPatientLink(plan.token)} aria-label="Copy patient link">
                                                <Copy size={16} />
                                            </button>
                                            <button onClick={() => window.open(`/patient/${plan.token}`, '_blank')} aria-label="Open patient plan">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button className="danger-action" onClick={() => deletePlan(plan)} aria-label="Delete patient plan">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'patients' && (
                    <section className="doctor-panel">
                        <div className="panel-title-row">
                            <div>
                                <span className="eyebrow">Patient details</span>
                                <h2>Patients</h2>
                            </div>
                            <button onClick={() => navigate('/builder')} className="create-plan-btn">
                                <Plus size={18} />
                                Add patient
                            </button>
                        </div>

                        {loading && renderEmpty('Loading patients...')}
                        {!loading && plans.length === 0 && renderEmpty('No patient records yet.')}
                        {!loading && plans.length > 0 && (
                            <div className="patients-grid">
                                {plans.map((plan) => (
                                    <article key={plan.token} className="patient-summary-card">
                                        <div className="patient-summary-head">
                                            <span className="brand-mark">{plan.patientName.charAt(0).toUpperCase()}</span>
                                            <div>
                                                <h3>{plan.patientName}</h3>
                                                <p>{plan.durationWeeks} week recovery plan</p>
                                            </div>
                                        </div>
                                        <ul>
                                            {plan.exercises?.slice(0, 4).map((exercise) => (
                                                <li key={`${plan.token}-${exercise.id}`}>{exercise.name} · {exercise.sets}x{exercise.reps}</li>
                                            ))}
                                        </ul>
                                        <button className="secondary-action" onClick={() => navigate(`/builder/${plan.token}`)}>
                                            <Edit3 size={17} /> Edit exercise details
                                        </button>
                                        <button className="secondary-action danger-action-text" onClick={() => deletePlan(plan)}>
                                            <Trash2 size={17} /> Delete plan
                                        </button>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'progress' && (
                    <section className="doctor-panel">
                        <div className="panel-title-row">
                            <div>
                                <span className="eyebrow">Recovery progress</span>
                                <h2>Progress overview</h2>
                            </div>
                            <CalendarDays size={28} />
                        </div>
                        {loading && renderEmpty('Loading progress...')}
                        {!loading && plans.length === 0 && renderEmpty('No progress data yet.')}
                        {!loading && plans.length > 0 && (
                            <div className="progress-overview-list">
                                {plans.map((plan, index) => {
                                    const percent = Math.max(35, 100 - index * 12);
                                    return (
                                        <article key={plan.token} className="progress-overview-card">
                                            <div>
                                                <strong>{plan.patientName}</strong>
                                                <span>{plan.exercises?.length || 0} active exercises</span>
                                            </div>
                                            <div className="adherence-bar">
                                                <span style={{ width: `${percent}%` }} />
                                            </div>
                                            <em>{percent}% plan readiness</em>
                                            <button className="secondary-action" onClick={() => window.open(`/patient/${plan.token}`, '_blank')}>
                                                View patient mode
                                            </button>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

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
