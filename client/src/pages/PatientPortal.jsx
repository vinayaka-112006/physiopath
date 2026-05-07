import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Activity,
    AlertCircle,
    ArrowRight,
    Calendar,
    CheckCircle2,
    Circle,
    Flame,
    Info,
    Play,
    ShieldCheck,
    WifiOff
} from 'lucide-react';
import api from '../api/client';
import LanguageSelect from '../components/LanguageSelect';
import { db } from '../db';
import { getExerciseGuide, getStoredLanguage, patientUiText } from '../data/languages';

const todayKey = () => new Date().toISOString().split('T')[0];

const PatientPortal = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [dailyLog, setDailyLog] = useState({ completedExerciseIds: [] });
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(getStoredLanguage);

    const today = todayKey();
    const text = patientUiText[language] || patientUiText.en;

    useEffect(() => {
        const initPlan = async () => {
            try {
                let localPlan = await db.plans.get(token);

                if (!localPlan) {
                    const response = await api.get(`/plans/${token}`);
                    localPlan = response.data;
                    await db.plans.put(localPlan);
                }

                let log = await db.daily_logs.where({ token, date: today }).first();
                if (!log) {
                    log = { token, date: today, completedExerciseIds: [] };
                    const id = await db.daily_logs.add(log);
                    log = { ...log, id };
                }

                const localLogs = await db.daily_logs.where({ token }).toArray();
                setPlan(localPlan);
                setDailyLog(log);
                setLogs(localLogs);
            } catch (err) {
                console.error('Error loading plan:', err);
            } finally {
                setLoading(false);
            }
        };

        initPlan();
    }, [token, today]);

    const toggleExercise = async (exerciseId) => {
        const completed = dailyLog.completedExerciseIds.includes(exerciseId);
        const completedExerciseIds = completed
            ? dailyLog.completedExerciseIds.filter((id) => id !== exerciseId)
            : [...dailyLog.completedExerciseIds, exerciseId];

        const updatedLog = { ...dailyLog, completedExerciseIds };
        await db.daily_logs.put(updatedLog);
        setDailyLog(updatedLog);
    };

    const stats = useMemo(() => {
        if (!plan) return { dailyPercent: 0, timelinePercent: 0, day: 1, totalDays: 1, streak: 0 };
        const totalExercises = Math.max(plan.exercises.length, 1);
        const dailyPercent = Math.round((dailyLog.completedExerciseIds.length / totalExercises) * 100);
        const startDate = new Date(plan.createdAt || Date.now());
        const totalDays = Math.max(Number(plan.durationWeeks || 1) * 7, 1);
        const day = Math.min(Math.floor((new Date() - startDate) / 86400000) + 1, totalDays);
        const timelinePercent = Math.round((day / totalDays) * 100);
        const streak = logs.filter((log) => log.completedExerciseIds?.length > 0).length;
        return { dailyPercent, timelinePercent, day, totalDays, streak };
    }, [dailyLog.completedExerciseIds.length, logs, plan]);

    if (loading) return <div className="loading-screen">Syncing your plan...</div>;
    if (!plan) return <div className="error-screen">Plan not found or expired.</div>;

    return (
        <div className="patient-shell">
            <header className="patient-hero">
                <div className="hero-topline">
                    <div>
                        <span className="eyebrow">PhysioPath</span>
                        <h1>{text.greeting}, {plan.patientName}</h1>
                    </div>
                    <div className="offline-pill">
                        <WifiOff size={16} />
                        {text.offline}
                    </div>
                </div>

                <div className="recovery-card">
                    <div>
                        <span className="card-label">{text.today}</span>
                        <strong>{stats.dailyPercent}% {text.complete}</strong>
                        <p className="hero-mini-copy">{text.offlineNote}</p>
                    </div>
                    <img className="hero-illustration" src="/therapy-team.svg" alt="" />
                    <div className="radial-meter" style={{ '--value': `${stats.dailyPercent * 3.6}deg` }}>
                        <span>{dailyLog.completedExerciseIds.length}/{plan.exercises.length}</span>
                    </div>
                </div>

                <div className="metric-grid">
                    <div className="metric-tile">
                        <Flame size={20} />
                        <strong>{stats.streak || 1} {text.days}</strong>
                        <span>{text.currentStreak}</span>
                    </div>
                    <div className="metric-tile">
                        <Calendar size={20} />
                        <strong>{text.day} {stats.day}</strong>
                        <span>{text.of} {stats.totalDays}</span>
                    </div>
                </div>

                <div className="timeline-strip">
                    <div>
                        <span>{text.recoveryPlan}</span>
                        <strong>{stats.timelinePercent}%</strong>
                    </div>
                    <div className="progress-track">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.timelinePercent}%` }}
                            className="progress-fill"
                        />
                    </div>
                </div>
                <div className="language-row">
                    <span>{text.guideLanguage}</span>
                    <LanguageSelect value={language} onChange={setLanguage} />
                </div>
            </header>

            <main className="patient-main">
                <section className="section-heading">
                    <div>
                        <span className="eyebrow">{text.guidedRoutine}</span>
                        <h2>{text.todaysExercises}</h2>
                    </div>
                    <button className="icon-text-btn" onClick={() => navigate(`/history/${token}`)}>
                        <Activity size={18} />
                        {text.progress}
                    </button>
                </section>

                <div className="exercise-stack">
                    {plan.exercises.map((exercise, index) => {
                        const completed = dailyLog.completedExerciseIds.includes(exercise.id);
                        const guide = getExerciseGuide(exercise.name, language);
                        return (
                            <motion.article
                                layout
                                key={`${exercise.id}-${index}`}
                                className={`exercise-card ${completed ? 'is-complete' : ''}`}
                            >
                                <button
                                    className="round-check"
                                    aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
                                    onClick={() => toggleExercise(exercise.id)}
                                >
                                    {completed ? <CheckCircle2 /> : <Circle />}
                                </button>
                                <button
                                    className="exercise-card-body"
                                    onClick={() => navigate(`/exercise/${token}/${exercise.id}`)}
                                >
                                    <div className="exercise-visual">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div className="exercise-copy">
                                        <span>{exercise.muscleGroup || 'Mobility'}</span>
                                        <h3>{guide?.name || exercise.name}</h3>
                                        <p>{exercise.sets} {text.sets} x {exercise.reps} {text.reps}</p>
                                    </div>
                                    <ArrowRight size={20} />
                                </button>
                            </motion.article>
                        );
                    })}
                </div>

                <div className="coach-note">
                    <Info size={18} />
                    <p>{text.coachNote}</p>
                </div>

                <button onClick={() => navigate(`/workout/${token}`)} className="primary-action">
                    <Play fill="currentColor" size={20} />
                    {text.startWorkout}
                </button>

                <div className="warning-note">
                    <AlertCircle size={16} />
                    {text.offlineNote}
                </div>
            </main>

            <nav className="patient-nav">
                <button className="nav-item active" onClick={() => navigate(`/patient/${token}`)}>
                    <CheckCircle2 />
                    <span>{text.todayNav}</span>
                </button>
                <button className="nav-item" onClick={() => navigate(`/history/${token}`)}>
                    <Calendar />
                    <span>{text.progress}</span>
                </button>
            </nav>
        </div>
    );
};

export default PatientPortal;
