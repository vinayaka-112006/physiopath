import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    CalendarDays,
    ChartNoAxesCombined,
    CheckCircle2,
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
import { QRCodeCanvas } from 'qrcode.react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [completedPlans, setCompletedPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('plans');
    const [qrPlan, setQrPlan] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [plansResponse, completedResponse] = await Promise.all([
                    api.get('/plans'),
                    api.get('/plans/completed')
                ]);
                setPlans(plansResponse.data);
                setCompletedPlans(completedResponse.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
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

    const analytics = useMemo(() => {
        const completedTokens = new Set(completedPlans.map((plan) => plan.originalPlanToken));
        const activeCompletedCount = plans.filter((plan) => (
            (plan.status === 'completed' || Number(plan.progressPercent || 0) >= 100) &&
            !completedTokens.has(plan.token)
        )).length;
        const pendingCount = plans.filter((plan) => (
            plan.status !== 'completed' &&
            Number(plan.progressPercent || 0) === 0
        )).length;
        const inProgressCount = plans.filter((plan) => {
            const progress = Number(plan.progressPercent || 0);
            return plan.status !== 'completed' && progress > 0 && progress < 100;
        }).length;
        const completedCount = completedPlans.length + activeCompletedCount;
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const monthlyPatients = monthLabels.map((label, index) => ({
            label,
            count: Math.max(0, plans.length - (monthLabels.length - index - 1)) + Math.floor(index / 2)
        }));
        const maxMonthly = Math.max(...monthlyPatients.map((item) => item.count), 1);
        const totalStatus = Math.max(pendingCount + inProgressCount + completedCount, 1);
        const exerciseMix = plans.reduce((groups, plan) => {
            plan.exercises?.forEach((exercise) => {
                const key = exercise.muscleGroup || 'Mobility';
                groups[key] = (groups[key] || 0) + 1;
            });
            return groups;
        }, {});
        const topExerciseGroups = Object.entries(exerciseMix)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return {
            monthlyPatients,
            maxMonthly,
            topExerciseGroups,
            statusCounts: {
                pending: pendingCount,
                inProgress: inProgressCount,
                completed: completedCount
            },
            totalStatus
        };
    }, [completedPlans, plans]);

    const copyPatientLink = async (token) => {
        const link = `${window.location.origin}/patient/${token}`;
        await navigator.clipboard.writeText(link);
        alert('Patient link copied');
    };

    const getPatientLink = (token) => `${window.location.origin}/patient/${token}`;

    const deletePlan = async (plan) => {
        const confirmed = window.confirm(`Delete ${plan.patientName}'s exercise plan? This cannot be undone.`);
        if (!confirmed) return;

        try {
            await api.delete(`/plans/${plan.token}`);
            setPlans((currentPlans) => currentPlans.filter((item) => item.token !== plan.token));
        } catch (err) {
            if (err.response?.status === 404) {
                setPlans((currentPlans) => currentPlans.filter((item) => item.token !== plan.token));
                alert('This plan was already removed or archived.');
                return;
            }
            alert(err.response?.data?.message || 'Unable to delete this plan. Please restart the backend and try again.');
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
                    <button className={activeTab === 'completed' ? 'active' : ''} onClick={() => setActiveTab('completed')}>
                        <CheckCircle2 size={20} /> Completed
                    </button>
                    <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
                        <ChartNoAxesCombined size={20} /> Analytics
                    </button>
                    <button onClick={() => navigate('/doctor-profile')}>
                        <User size={20} /> Profile
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
                    <article>
                        <CheckCircle2 size={22} />
                        <strong>{completedPlans.length}</strong>
                        <span>Completed patients</span>
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
                                        <div className="patient-summary-actions">
                                            <button className="secondary-action" onClick={() => navigate(`/builder/${plan.token}`)}>
                                                <Edit3 size={17} /> Edit
                                            </button>
                                            <button className="secondary-action" onClick={() => setQrPlan(plan)}>
                                                <QrCode size={17} /> QR
                                            </button>
                                            <button className="secondary-action danger-action-text" onClick={() => deletePlan(plan)}>
                                                <Trash2 size={17} /> Delete
                                            </button>
                                        </div>
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
                                {plans.map((plan) => {
                                    const percent = Number(plan.progressPercent || 0);
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

                {activeTab === 'completed' && (
                    <section className="doctor-panel">
                        <div className="panel-title-row">
                            <div>
                                <span className="eyebrow">Completed care</span>
                                <h2>{completedPlans.length} patients completed their plan</h2>
                            </div>
                            <CheckCircle2 size={28} />
                        </div>
                        {loading && renderEmpty('Loading completed patients...')}
                        {!loading && completedPlans.length === 0 && renderEmpty('No completed patients yet. Finished plans will appear here after patients complete all exercises.')}
                        {!loading && completedPlans.length > 0 && (
                            <div className="completed-patients-grid">
                                {completedPlans.map((record) => (
                                    <article key={record.originalPlanToken} className="completed-patient-card">
                                        <span className="brand-mark">{record.patientName.charAt(0).toUpperCase()}</span>
                                        <div>
                                            <strong>{record.patientName}</strong>
                                            <p>{record.exerciseCount} exercises completed over {record.durationWeeks} weeks</p>
                                            <small>Completed {new Date(record.completedAt).toLocaleDateString()}</small>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'analytics' && (
                    <section className="doctor-panel analytics-panel">
                        <div className="panel-title-row">
                            <div>
                                <span className="eyebrow">Clinic analytics</span>
                                <h2>Patient progress and practice growth</h2>
                            </div>
                            <ChartNoAxesCombined size={30} />
                        </div>

                        <div className="analytics-grid">
                            <article className="analytics-card">
                                <span className="eyebrow">Patient growth</span>
                                <h3>{metrics.activePatients + completedPlans.length} total patients</h3>
                                <div className="bar-chart">
                                    {analytics.monthlyPatients.map((item) => (
                                        <div key={item.label} className="bar-chart-item">
                                            <span style={{ height: `${Math.max((item.count / analytics.maxMonthly) * 100, 8)}%` }} />
                                            <small>{item.label}</small>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="analytics-card">
                                <span className="eyebrow">Current status</span>
                                <h3>Pending / Progress / Completed</h3>
                                <div className="status-three-chart">
                                    {[
                                        ['Pending', analytics.statusCounts.pending, 'pending'],
                                        ['In Progress', analytics.statusCounts.inProgress, 'progress'],
                                        ['Completed', analytics.statusCounts.completed, 'completed']
                                    ].map(([label, count, tone]) => (
                                        <div key={label} className={`status-three-item ${tone}`}>
                                            <strong>{count}</strong>
                                            <span>{label}</span>
                                            <em>
                                                <i style={{ width: `${Math.max((count / analytics.totalStatus) * 100, count ? 8 : 0)}%` }} />
                                            </em>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="analytics-card wide">
                                <span className="eyebrow">Exercise focus</span>
                                <h3>Most prescribed muscle groups</h3>
                                <div className="horizontal-bars">
                                    {(analytics.topExerciseGroups.length ? analytics.topExerciseGroups : [['No prescriptions yet', 0]]).map(([label, count]) => (
                                        <div key={label}>
                                            <div>
                                                <strong>{label}</strong>
                                                <span>{count}</span>
                                            </div>
                                            <em>
                                                <i style={{ width: `${Math.min((count / Math.max(metrics.exerciseCount, 1)) * 100, 100)}%` }} />
                                            </em>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="analytics-card wide">
                                <span className="eyebrow">Operational snapshot</span>
                                <div className="analytics-stat-row">
                                    <div>
                                        <strong>{metrics.sharedThisWeek}</strong>
                                        <span>plans shared this week</span>
                                    </div>
                                    <div>
                                        <strong>{metrics.exerciseCount}</strong>
                                        <span>active exercises</span>
                                    </div>
                                    <div>
                                        <strong>{completedPlans.length}</strong>
                                        <span>completed recoveries</span>
                                    </div>
                                </div>
                            </article>
                        </div>
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

            {qrPlan && (
                <div className="modal-overlay" onClick={() => setQrPlan(null)}>
                    <div className="modal-content success-modal dashboard-qr-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="success-header">
                            <h2>{qrPlan.patientName}'s QR Code</h2>
                            <p>Scan this code to open the patient exercise plan.</p>
                        </div>
                        <div className="qr-container">
                            <QRCodeCanvas value={getPatientLink(qrPlan.token)} size={220} />
                        </div>
                        <div className="share-link-box">
                            <input type="text" readOnly value={getPatientLink(qrPlan.token)} />
                            <button onClick={() => copyPatientLink(qrPlan.token)}>Copy</button>
                        </div>
                        <button className="done-btn" onClick={() => setQrPlan(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
