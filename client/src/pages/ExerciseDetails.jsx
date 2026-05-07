import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Check, Clock, Mic2, Play, ShieldCheck } from 'lucide-react';
import LanguageSelect from '../components/LanguageSelect';
import { getExerciseDemoUrl } from '../data/exerciseMedia';
import { exerciseDetailText, getExerciseGuide, getStoredLanguage } from '../data/languages';
import { db } from '../db';

const speechLangMap = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    es: 'es-ES'
};

const fallbackIntro = {
    en: 'Let us practice this exercise. Move slowly, breathe comfortably, and stay within a pain-free range.',
    hi: 'आइए इस व्यायाम का अभ्यास करें। धीरे चलें, आराम से सांस लें, और दर्द-रहित सीमा में रहें।',
    ta: 'இந்த உடற்பயிற்சியை பயிற்சி செய்வோம். மெதுவாக நகருங்கள், சீராக மூச்செடுங்கள், வலி இல்லாத அளவில் செய்யுங்கள்.',
    kn: 'ಈ ವ್ಯಾಯಾಮವನ್ನು ಅಭ್ಯಾಸ ಮಾಡೋಣ. ನಿಧಾನವಾಗಿ ಚಲಿಸಿ, ಆರಾಮವಾಗಿ ಉಸಿರಾಡಿ, ನೋವಿಲ್ಲದ ಮಿತಿಯೊಳಗೆ ಇರಿ.',
    es: 'Practiquemos este ejercicio. Muévete despacio, respira con calma y mantente dentro de un rango sin dolor.'
};

const fallbackCompletion = {
    en: 'Good work. Rest and repeat only as prescribed by your therapist.',
    hi: 'बहुत अच्छा। आराम करें और केवल अपने फिजियोथेरेपिस्ट के बताए अनुसार दोहराएं।',
    ta: 'நன்றாக செய்தீர்கள். ஓய்வு எடுத்து, உங்கள் தெரபிஸ்ட் கூறியபடி மட்டும் மீண்டும் செய்யுங்கள்.',
    kn: 'ಚೆನ್ನಾಗಿದೆ. ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ ಮತ್ತು ನಿಮ್ಮ ಥೆರಪಿಸ್ಟ್ ಹೇಳಿದಂತೆ ಮಾತ್ರ ಮರುಕಳಿಸಿ.',
    es: 'Buen trabajo. Descansa y repite solo según lo indicado por tu fisioterapeuta.'
};

const fallbackTipsPrefix = {
    en: 'Important tips.',
    hi: 'महत्वपूर्ण सुझाव।',
    ta: 'முக்கிய குறிப்புகள்.',
    kn: 'ಮುಖ್ಯ ಸಲಹೆಗಳು.',
    es: 'Consejos importantes.'
};

const getVoiceForLanguage = (language) => {
    if (!('speechSynthesis' in window)) return null;
    const target = speechLangMap[language] || 'en-US';
    const base = target.split('-')[0].toLowerCase();
    const voices = window.speechSynthesis.getVoices();
    return (
        voices.find((voice) => voice.lang === target) ||
        voices.find((voice) => voice.lang?.toLowerCase().startsWith(`${base}-`)) ||
        voices.find((voice) => voice.lang?.toLowerCase() === base) ||
        null
    );
};

const ExerciseDetails = () => {
    const { token, exerciseId } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [language, setLanguage] = useState(getStoredLanguage);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        db.plans.get(token).then(setPlan);
    }, [token]);

    useEffect(() => () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, []);

    const exercise = plan?.exercises.find((item) => item.id === exerciseId) || plan?.exercises[0];
    const guide = exercise ? getExerciseGuide(exercise.name, language) : null;
    const text = exerciseDetailText[language] || exerciseDetailText.en;
    const displayName = guide?.name || exercise?.name;
    const demoUrl = getExerciseDemoUrl(exercise?.name);
    const displaySteps = useMemo(() => (
        guide?.steps || exercise?.steps.map((step) => ({
            heading: `${text.step || 'Step'} ${step.order}`,
            instruction: step.instruction,
            voice_guidance: step.instruction
        })) || []
    ), [exercise?.steps, guide, text.step]);
    const displayTips = useMemo(() => (
        guide?.pro_tips || exercise?.mistakes || []
    ), [exercise?.mistakes, guide]);

    const buildDetailedExplanation = () => {
        const lines = [
            guide?.voice_intro || `${fallbackIntro[language] || fallbackIntro.en} ${displayName}.`,
            ...displaySteps.map((step, index) => (
                `${index + 1}. ${step.heading}. ${step.voice_guidance || step.instruction}`
            )),
            displayTips.length ? `${fallbackTipsPrefix[language] || fallbackTipsPrefix.en} ${displayTips.join('. ')}` : '',
            guide?.completion_message || fallbackCompletion[language] || fallbackCompletion.en
        ];

        return lines.filter(Boolean).join(' ');
    };

    const playDetailedExplanation = () => {
        if (!('speechSynthesis' in window)) {
            alert(text.unsupportedVoice);
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(buildDetailedExplanation());
        utterance.lang = speechLangMap[language] || 'en-US';
        const voice = getVoiceForLanguage(language);
        if (voice) {
            utterance.voice = voice;
        }
        utterance.rate = 0.88;
        utterance.pitch = 1;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    if (!plan || !exercise) return <div className="loading-screen">Loading exercise...</div>;

    return (
        <div className="detail-shell">
            <header className="detail-header">
                <button className="icon-btn" onClick={() => navigate(`/patient/${token}`)} aria-label="Back">
                    <ArrowLeft size={22} />
                </button>
                <span>{text.pageTitle}</span>
                <button className="icon-btn" onClick={() => navigate(`/workout/${token}`)} aria-label="Start workout">
                    <Play size={20} fill="currentColor" />
                </button>
            </header>

            <main className="detail-main">
                <section className="exercise-detail-hero">
                    <div className="pose-card image-pose-card">
                        {demoUrl ? (
                            <video
                                src={demoUrl}
                                poster={guide?.imageUrl || exercise.imageUrl || '/medical-therapy-hero.svg'}
                                autoPlay
                                loop
                                muted
                                playsInline
                                aria-label={`${displayName} exercise demonstration`}
                            />
                        ) : (
                            <img src={guide?.imageUrl || exercise.imageUrl || '/medical-therapy-hero.svg'} alt="" />
                        )}
                    </div>
                    <div className="detail-title-row">
                        <span className="eyebrow">{exercise.muscleGroup}</span>
                        <LanguageSelect value={language} onChange={setLanguage} />
                    </div>
                    <h1>{displayName}</h1>
                    <p>{guide?.primary_benefit || exercise.description || 'Follow each step slowly and keep the movement controlled.'}</p>
                    <button className="voice-action-btn" onClick={playDetailedExplanation}>
                        <Mic2 size={18} />
                        {isSpeaking ? text.speaking : text.playExplanation}
                    </button>
                </section>

                <section className="prescription-row">
                    <div>
                        <strong>{exercise.sets}</strong>
                        <span>{text.sets}</span>
                    </div>
                    <div>
                        <strong>{exercise.reps}</strong>
                        <span>{text.reps}</span>
                    </div>
                    <div>
                        <strong>{exercise.restSeconds}s</strong>
                        <span>{text.rest}</span>
                    </div>
                </section>

                <section className="detail-panel">
                    <h2>{guide ? guide.total_reps : 'Step-by-step'}</h2>
                    <div className="steps-list">
                        {displaySteps.map((step, index) => (
                            <div key={`${step.heading}-${index}`} className="step-item rich-step">
                                <span>{index + 1}</span>
                                <div>
                                    <strong>{step.heading}</strong>
                                    <p>{step.instruction}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="detail-panel caution-panel">
                    <h2><AlertTriangle size={18} /> {text.tipsTitle}</h2>
                    <ul>
                        {displayTips.map((tip) => (
                            <li key={tip}>
                                <Check size={16} />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="coach-note">
                    <Clock size={18} />
                    <p>{guide?.completion_message || fallbackCompletion[language] || fallbackCompletion.en}</p>
                </section>

                <button className="primary-action" onClick={() => navigate(`/workout/${token}`, { state: { exerciseId } })}>
                    <ShieldCheck size={20} />
                    {text.practice}
                </button>
            </main>
        </div>
    );
};

export default ExerciseDetails;
