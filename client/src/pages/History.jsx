import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Award, Calendar as CalendarIcon, CheckCircle2, ChevronLeft, Flame, TrendingUp } from 'lucide-react';
import { db } from '../db';
import { getStoredLanguage, historyUiText } from '../data/languages';

const History = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language] = useState(getStoredLanguage);
    const text = historyUiText[language] || historyUiText.en;

    useEffect(() => {
        const loadHistory = async () => {
            const [localPlan, localLogs] = await Promise.all([
                db.plans.get(token),
                db.daily_logs.where({ token }).toArray()
            ]);
            setPlan(localPlan);
            setLogs(localLogs);
            setLoading(false);
        };
        loadHistory();
    }, [token]);

    const heatmap = useMemo(() => {
        const cells = [];
        const today = new Date();
        for (let i = 27; i >= 0; i -= 1) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const log = logs.find((item) => item.date === dateStr);
            const intensity = log ? log.completedExerciseIds.length / Math.max(plan?.exercises.length || 1, 1) : 0;
            cells.push({ date: dateStr, intensity });
        }
        return cells;
    }, [logs, plan?.exercises.length]);

    if (loading) return <div className="loading-screen">Loading progress...</div>;

    const completedDays = logs.filter((log) => log.completedExerciseIds?.length > 0).length;
    const totalCompleted = logs.reduce((sum, log) => sum + (log.completedExerciseIds?.length || 0), 0);
    const consistency = Math.round((completedDays / 28) * 100);

    return (
        <div className="patient-shell">
            <header className="patient-hero progress-hero">
                <button className="back-inline" onClick={() => navigate(`/patient/${token}`)}>
                    <ChevronLeft size={20} />
                    {text.today}
                </button>
                <span className="eyebrow">{text.progressDashboard}</span>
                <h1>{plan?.patientName || 'Patient'} {text.recovery}</h1>

                <div className="metric-grid">
                    <div className="metric-tile">
                        <Flame size={20} />
                        <strong>{completedDays || 1} {text.days}</strong>
                        <span>{text.streak}</span>
                    </div>
                    <div className="metric-tile">
                        <TrendingUp size={20} />
                        <strong>{consistency}%</strong>
                        <span>{text.consistency}</span>
                    </div>
                    <div className="metric-tile">
                        <Award size={20} />
                        <strong>{totalCompleted}</strong>
                        <span>{text.totalLogged}</span>
                    </div>
                </div>
            </header>

            <main className="patient-main">
                <section className="detail-panel">
                    <div className="panel-title-row">
                        <h2><CalendarIcon size={18} /> {text.last28}</h2>
                        <span>{completedDays} {text.activeDays}</span>
                    </div>
                    <img className="progress-illustration" src="/medical-progress.svg" alt="" />
                    <div className="heatmap-grid">
                        {heatmap.map((cell) => (
                            <span
                                key={cell.date}
                                className="heatmap-cell"
                                title={cell.date}
                                data-level={cell.intensity >= 0.8 ? '3' : cell.intensity >= 0.4 ? '2' : cell.intensity > 0 ? '1' : '0'}
                            />
                        ))}
                    </div>
                    <div className="heatmap-legend">
                        <span>{text.less}</span>
                        <i data-level="0" />
                        <i data-level="1" />
                        <i data-level="2" />
                        <i data-level="3" />
                        <span>{text.more}</span>
                    </div>
                </section>

                <section className="recent-activity">
                    <h2>{text.recentActivity}</h2>
                    {logs.length === 0 ? (
                        <div className="empty-state compact">{text.noActivity}</div>
                    ) : (
                        logs.slice().reverse().map((log) => (
                            <article key={log.id || log.date} className="activity-item">
                                <div>
                                    <strong>{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
                                    <span>{log.completedExerciseIds.length} {text.exercisesCompleted}</span>
                                </div>
                                <CheckCircle2 size={22} />
                            </article>
                        ))
                    )}
                </section>
            </main>

            <nav className="patient-nav">
                <button className="nav-item" onClick={() => navigate(`/patient/${token}`)}>
                    <CheckCircle2 />
                    <span>{text.today}</span>
                </button>
                <button className="nav-item active" onClick={() => navigate(`/history/${token}`)}>
                    <CalendarIcon />
                    <span>{text.progress}</span>
                </button>
            </nav>
        </div>
    );
};

export default History;
