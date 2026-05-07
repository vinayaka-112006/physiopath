import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Pause, Play, RotateCcw, ShieldAlert, Volume2, VolumeX, X } from 'lucide-react';
import { db } from '../db';
import { getExerciseGuide, getStoredLanguage, workoutUiText } from '../data/languages';

const speechLangMap = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    es: 'es-ES'
};

const getVoiceForLanguage = (language) => {
    if (!('speechSynthesis' in window)) return null;
    const target = speechLangMap[language] || 'en-US';
    const base = target.split('-')[0].toLowerCase();
    const voices = window.speechSynthesis.getVoices();
    return voices.find((voice) => voice.lang === target) ||
        voices.find((voice) => voice.lang?.toLowerCase().startsWith(`${base}-`)) ||
        null;
};

const WorkoutEngine = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [plan, setPlan] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mode, setMode] = useState('GUIDE');
    const [currentRep, setCurrentRep] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [timer, setTimer] = useState(5);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [paused, setPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [language] = useState(getStoredLanguage);
    const timerRef = useRef(null);
    const wakeLockRef = useRef(null);

    const currentExercise = plan?.exercises[currentIndex];
    const currentGuide = currentExercise ? getExerciseGuide(currentExercise.name, language) : null;
    const text = workoutUiText[language] || workoutUiText.en;
    const displayName = currentGuide?.name || currentExercise?.name;
    const displaySteps = currentGuide?.steps || currentExercise?.steps || [];
    const displayMistake = currentGuide?.pro_tips?.[0] || currentExercise?.mistakes?.[0] || 'Keep the motion slow and controlled.';
    const totalExercises = plan?.exercises.length || 1;
    const workoutPercent = Math.round(((currentIndex + (mode === 'COMPLETE' ? 1 : 0)) / totalExercises) * 100);

    useEffect(() => {
        const loadPlan = async () => {
            const localPlan = await db.plans.get(token);
            if (localPlan) {
                const requestedId = location.state?.exerciseId;
                const requestedIndex = requestedId
                    ? localPlan.exercises.findIndex((exercise) => exercise.id === requestedId)
                    : -1;
                setPlan(localPlan);
                setCurrentIndex(requestedIndex >= 0 ? requestedIndex : 0);
            }
            setLoading(false);
        };

        loadPlan();
        requestWakeLock();
        return () => releaseWakeLock();
    }, [location.state?.exerciseId, token]);

    useEffect(() => {
        if (!currentExercise) return;
        setMode('GUIDE');
        setTimer(5);
        setCurrentRep(0);
        setCurrentSet(1);
        speak(`${text.exercise}. ${displayName}. ${currentGuide?.voice_intro || text.getReady}.`);
    }, [currentExercise?.id]);

    useEffect(() => {
        if (paused) return;
        clearTimeout(timerRef.current);

        if ((mode === 'GUIDE' || mode === 'REST') && timer > 0) {
            timerRef.current = setTimeout(() => setTimer((value) => value - 1), 1000);
        }

        if (mode === 'GUIDE' && timer === 0) {
            setMode('ACTIVE');
            speak(text.begin);
        }

        if (mode === 'REST' && timer === 0) {
            advanceAfterRest();
        }

        return () => clearTimeout(timerRef.current);
    }, [mode, paused, timer]);

    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator) {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
            }
        } catch (err) {
            console.error(`${err.name}: ${err.message}`);
        }
    };

    const releaseWakeLock = () => {
        if (wakeLockRef.current) {
            wakeLockRef.current.release();
            wakeLockRef.current = null;
        }
    };

    const speak = (speechText) => {
        if (!voiceEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = speechLangMap[language] || 'en-US';
        const voice = getVoiceForLanguage(language);
        if (voice) utterance.voice = voice;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
    };

    const handleRep = () => {
        if (mode !== 'ACTIVE' || !currentExercise) return;
        const nextRep = currentRep + 1;
        setCurrentRep(nextRep);
        speak(String(nextRep));

        if (nextRep >= currentExercise.reps) {
            setMode('REST');
            setTimer(currentExercise.restSeconds);
            speak(`${text.setComplete} ${currentExercise.restSeconds} ${text.seconds}`);
        }
    };

    const advanceAfterRest = () => {
        if (!currentExercise) return;
        if (currentSet < currentExercise.sets) {
            setCurrentSet((value) => value + 1);
            setCurrentRep(0);
            setMode('ACTIVE');
            speak(text.nextSet);
            return;
        }

        if (currentIndex < totalExercises - 1) {
            setCurrentIndex((value) => value + 1);
            return;
        }

        completeWorkout();
    };

    const completeWorkout = async () => {
        setMode('COMPLETE');
        speak(text.workoutDone);
        const today = new Date().toISOString().split('T')[0];
        const allIds = plan.exercises.map((exercise) => exercise.id);
        const log = await db.daily_logs.where({ token, date: today }).first();
        if (log) {
            await db.daily_logs.update(log.id, { completedExerciseIds: allIds });
        } else {
            await db.daily_logs.add({ token, date: today, completedExerciseIds: allIds });
        }
    };

    const activeRing = useMemo(() => {
        if (!currentExercise) return '0deg';
        return `${Math.min((currentRep / currentExercise.reps) * 360, 360)}deg`;
    }, [currentExercise, currentRep]);

    if (loading) return <div className="loading-screen">Preparing workout...</div>;
    if (!plan) return <div className="error-screen">Workout plan unavailable offline.</div>;

    return (
        <div className="workout-shell">
            <header className="workout-topbar">
                <button className="icon-btn" onClick={() => navigate(`/patient/${token}`)} aria-label="Close workout">
                    <X size={22} />
                </button>
                <div className="workout-title">
                    <span>{text.exercise} {Math.min(currentIndex + 1, totalExercises)} {text.of} {totalExercises}</span>
                    <div className="mini-progress">
                        <span style={{ width: `${workoutPercent}%` }} />
                    </div>
                </div>
                <button className="icon-btn" onClick={() => setVoiceEnabled((value) => !value)} aria-label="Toggle voice">
                    {voiceEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
                </button>
            </header>

            <main className="workout-stage">
                <AnimatePresence mode="wait">
                    {mode === 'GUIDE' && (
                        <motion.section
                            key="guide"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="workout-view"
                        >
                            <span className="eyebrow">{text.guidedMode}</span>
                            <h1>{displayName}</h1>
                            <p>{displaySteps[0]?.instruction}</p>
                            <div className="countdown-ring">
                                <strong>{timer}</strong>
                                <span>{text.getReady}</span>
                            </div>
                            <button className="secondary-action" onClick={() => setTimer(0)}>
                                {text.startNow}
                                <ChevronRight size={18} />
                            </button>
                        </motion.section>
                    )}

                    {mode === 'ACTIVE' && (
                        <motion.section
                            key="active"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="workout-view active-workout"
                        >
                            <span className="eyebrow">{text.activeWorkout}</span>
                            <h1>{displayName}</h1>
                            <span className="set-chip">{text.set} {currentSet} {text.of} {currentExercise.sets}</span>

                            <button className="rep-ring" style={{ '--rep-ring': activeRing }} onClick={handleRep}>
                                <strong>{currentRep}</strong>
                                <span>{text.of} {currentExercise.reps}</span>
                                <em>{text.tapAfterRep}</em>
                            </button>

                            <div className="form-alert">
                                <ShieldAlert size={20} />
                                <p>{displayMistake}</p>
                            </div>

                            <div className="workout-controls">
                                <button className="icon-text-btn" onClick={() => setPaused((value) => !value)}>
                                    {paused ? <Play size={18} /> : <Pause size={18} />}
                                    {paused ? text.resume : text.pause}
                                </button>
                                <button className="icon-text-btn" onClick={() => setCurrentRep(0)}>
                                    <RotateCcw size={18} />
                                    {text.resetReps}
                                </button>
                            </div>
                        </motion.section>
                    )}

                    {mode === 'REST' && (
                        <motion.section
                            key="rest"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            className="workout-view rest-workout"
                        >
                            <span className="eyebrow">{text.restPeriod}</span>
                            <h1>{timer}s</h1>
                            <p>{text.restCopy}</p>
                            <button className="secondary-action" onClick={advanceAfterRest}>
                                {text.skipRest}
                                <ChevronRight size={18} />
                            </button>
                        </motion.section>
                    )}

                    {mode === 'COMPLETE' && (
                        <motion.section
                            key="complete"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="workout-view complete-workout"
                        >
                            <div className="complete-mark">
                                <CheckCircle2 size={52} />
                            </div>
                            <span className="eyebrow">{text.complete}</span>
                            <h1>{text.wellDone}, {plan.patientName}</h1>
                            <p>{text.completeCopy}</p>
                            <button className="primary-action" onClick={() => navigate(`/history/${token}`)}>
                                {text.viewProgress}
                            </button>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default WorkoutEngine;
