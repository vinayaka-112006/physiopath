export const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ta', label: 'Tamil' },
    { code: 'kn', label: 'Kannada' },
    { code: 'es', label: 'Spanish' }
];

export const getStoredLanguage = () => localStorage.getItem('physiopath-language') || 'en';

export const storeLanguage = (language) => {
    localStorage.setItem('physiopath-language', language);
};

export const exerciseDetailText = {
    en: {
        pageTitle: 'Exercise details',
        sets: 'Sets',
        reps: 'Reps',
        rest: 'Rest',
        tipsTitle: 'Avoid these mistakes',
        voiceTitle: 'Voice guidance',
        playExplanation: 'Play detailed exercise explanation',
        speaking: 'Speaking...',
        imageLoading: 'Generating exercise illustrations...',
        imageFallback: 'Gemini quota is unavailable, showing generated fallback illustrations.',
        practice: 'Practice this exercise',
        unsupportedVoice: 'Voice guidance is not supported in this browser.'
    },
    hi: {
        pageTitle: 'व्यायाम विवरण',
        sets: 'सेट',
        reps: 'रेप',
        rest: 'आराम',
        tipsTitle: 'इन गलतियों से बचें',
        voiceTitle: 'आवाज़ मार्गदर्शन',
        playExplanation: 'विस्तृत व्यायाम समझाइए',
        speaking: 'बोला जा रहा है...',
        imageLoading: 'व्यायाम चित्र बनाए जा रहे हैं...',
        imageFallback: 'Gemini quota उपलब्ध नहीं है, इसलिए fallback चित्र दिखाए जा रहे हैं।',
        practice: 'यह व्यायाम अभ्यास करें',
        unsupportedVoice: 'इस ब्राउज़र में आवाज़ मार्गदर्शन उपलब्ध नहीं है।'
    },
    ta: {
        pageTitle: 'உடற்பயிற்சி விவரம்',
        sets: 'செட்',
        reps: 'முறை',
        rest: 'ஓய்வு',
        tipsTitle: 'இந்த தவறுகளை தவிர்க்கவும்',
        voiceTitle: 'குரல் வழிகாட்டல்',
        playExplanation: 'விரிவான உடற்பயிற்சி விளக்கத்தை கேட்கவும்',
        speaking: 'பேசுகிறது...',
        imageLoading: 'உடற்பயிற்சி படங்கள் உருவாக்கப்படுகின்றன...',
        imageFallback: 'Gemini quota இல்லை, அதனால் fallback படங்கள் காட்டப்படுகின்றன.',
        practice: 'இந்த உடற்பயிற்சியை பயிற்சி செய்யவும்',
        unsupportedVoice: 'இந்த உலாவியில் குரல் வழிகாட்டல் ஆதரிக்கப்படவில்லை.'
    },
    kn: {
        pageTitle: 'ವ್ಯಾಯಾಮ ವಿವರ',
        sets: 'ಸೆಟ್',
        reps: 'ರೆಪ್',
        rest: 'ವಿಶ್ರಾಂತಿ',
        tipsTitle: 'ಈ ತಪ್ಪುಗಳನ್ನು ತಪ್ಪಿಸಿ',
        voiceTitle: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ',
        playExplanation: 'ವಿವರವಾದ ವ್ಯಾಯಾಮ ವಿವರಣೆ ಕೇಳಿ',
        speaking: 'ಮಾತನಾಡುತ್ತಿದೆ...',
        imageLoading: 'ವ್ಯಾಯಾಮ ಚಿತ್ರಗಳನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ...',
        imageFallback: 'Gemini quota ಲಭ್ಯವಿಲ್ಲ, fallback ಚಿತ್ರಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.',
        practice: 'ಈ ವ್ಯಾಯಾಮವನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ',
        unsupportedVoice: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಬೆಂಬಲಿಸಲಾಗುವುದಿಲ್ಲ.'
    },
    es: {
        pageTitle: 'Detalles del ejercicio',
        sets: 'Series',
        reps: 'Reps',
        rest: 'Descanso',
        tipsTitle: 'Evita estos errores',
        voiceTitle: 'Guía por voz',
        playExplanation: 'Reproducir explicación detallada',
        speaking: 'Hablando...',
        imageLoading: 'Generando ilustraciones del ejercicio...',
        imageFallback: 'La cuota de Gemini no está disponible; se muestran ilustraciones alternativas.',
        practice: 'Practicar este ejercicio',
        unsupportedVoice: 'La guía por voz no es compatible con este navegador.'
    }
};

export const patientUiText = {
    en: {
        greeting: 'Hello',
        offline: 'Offline ready',
        guideLanguage: 'Guide language',
        today: 'Today',
        complete: 'complete',
        currentStreak: 'Current streak',
        days: 'days',
        day: 'Day',
        of: 'of',
        recoveryPlan: 'Recovery plan',
        guidedRoutine: 'Guided routine',
        todaysExercises: "Today's exercises",
        progress: 'Progress',
        sets: 'sets',
        reps: 'reps',
        coachNote: "Move slowly, stop if pain increases, and follow your therapist's prescribed reps.",
        startWorkout: 'Start guided workout',
        offlineNote: 'No camera required. Your plan and logs stay available after first sync.',
        todayNav: 'Today'
    },
    hi: {
        greeting: 'नमस्ते',
        offline: 'ऑफलाइन तैयार',
        guideLanguage: 'गाइड भाषा',
        today: 'आज',
        complete: 'पूरा',
        currentStreak: 'वर्तमान स्ट्रीक',
        days: 'दिन',
        day: 'दिन',
        of: 'में से',
        recoveryPlan: 'रिकवरी योजना',
        guidedRoutine: 'मार्गदर्शित रूटीन',
        todaysExercises: 'आज के व्यायाम',
        progress: 'प्रगति',
        sets: 'सेट',
        reps: 'रेप',
        coachNote: 'धीरे चलें, दर्द बढ़े तो रुकें, और अपने फिजियोथेरेपिस्ट के बताए रेप्स ही करें।',
        startWorkout: 'मार्गदर्शित व्यायाम शुरू करें',
        offlineNote: 'कैमरा जरूरी नहीं। पहली सिंक के बाद आपकी योजना और लॉग ऑफलाइन उपलब्ध रहेंगे।',
        todayNav: 'आज'
    },
    ta: {
        greeting: 'வணக்கம்',
        offline: 'ஆஃப்லைன் தயாராக உள்ளது',
        guideLanguage: 'வழிகாட்டி மொழி',
        today: 'இன்று',
        complete: 'முடிந்தது',
        currentStreak: 'தற்போதைய தொடர்ச்சி',
        days: 'நாட்கள்',
        day: 'நாள்',
        of: 'இல்',
        recoveryPlan: 'மீட்பு திட்டம்',
        guidedRoutine: 'வழிகாட்டப்பட்ட பயிற்சி',
        todaysExercises: 'இன்றைய உடற்பயிற்சிகள்',
        progress: 'முன்னேற்றம்',
        sets: 'செட்',
        reps: 'முறை',
        coachNote: 'மெதுவாக செய்யுங்கள், வலி அதிகரித்தால் நிறுத்துங்கள், தெரபிஸ்ட் கூறிய எண்ணிக்கையைப் பின்பற்றுங்கள்.',
        startWorkout: 'வழிகாட்டப்பட்ட பயிற்சியை தொடங்கு',
        offlineNote: 'கேமரா தேவையில்லை. முதல் sync பிறகு உங்கள் திட்டமும் பதிவுகளும் ஆஃப்லைனில் இருக்கும்.',
        todayNav: 'இன்று'
    },
    kn: {
        greeting: 'ನಮಸ್ಕಾರ',
        offline: 'ಆಫ್‌ಲೈನ್ ಸಿದ್ಧ',
        guideLanguage: 'ಮಾರ್ಗದರ್ಶಿ ಭಾಷೆ',
        today: 'ಇಂದು',
        complete: 'ಪೂರ್ಣ',
        currentStreak: 'ಪ್ರಸ್ತುತ ಸರಣಿ',
        days: 'ದಿನಗಳು',
        day: 'ದಿನ',
        of: 'ರಲ್ಲಿ',
        recoveryPlan: 'ಚೇತರಿಕೆ ಯೋಜನೆ',
        guidedRoutine: 'ಮಾರ್ಗದರ್ಶಿತ ರೂಟಿನ್',
        todaysExercises: 'ಇಂದಿನ ವ್ಯಾಯಾಮಗಳು',
        progress: 'ಪ್ರಗತಿ',
        sets: 'ಸೆಟ್',
        reps: 'ರೆಪ್',
        coachNote: 'ನಿಧಾನವಾಗಿ ಮಾಡಿ, ನೋವು ಹೆಚ್ಚಾದರೆ ನಿಲ್ಲಿಸಿ, ನಿಮ್ಮ ಥೆರಪಿಸ್ಟ್ ಸೂಚಿಸಿದ ರೆಪ್‌ಗಳನ್ನು ಮಾತ್ರ ಅನುಸರಿಸಿ.',
        startWorkout: 'ಮಾರ್ಗದರ್ಶಿತ ವ್ಯಾಯಾಮ ಆರಂಭಿಸಿ',
        offlineNote: 'ಕ್ಯಾಮೆರಾ ಅಗತ್ಯವಿಲ್ಲ. ಮೊದಲ sync ನಂತರ ನಿಮ್ಮ ಯೋಜನೆ ಮತ್ತು ದಾಖಲೆಗಳು ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಲಭ್ಯ.',
        todayNav: 'ಇಂದು'
    },
    es: {
        greeting: 'Hola',
        offline: 'Listo sin conexión',
        guideLanguage: 'Idioma de guía',
        today: 'Hoy',
        complete: 'completo',
        currentStreak: 'Racha actual',
        days: 'días',
        day: 'Día',
        of: 'de',
        recoveryPlan: 'Plan de recuperación',
        guidedRoutine: 'Rutina guiada',
        todaysExercises: 'Ejercicios de hoy',
        progress: 'Progreso',
        sets: 'series',
        reps: 'reps',
        coachNote: 'Muévete despacio, detente si aumenta el dolor y sigue las repeticiones indicadas.',
        startWorkout: 'Iniciar rutina guiada',
        offlineNote: 'No se requiere cámara. Tu plan y registros quedan disponibles después de la primera sincronización.',
        todayNav: 'Hoy'
    }
};

export const workoutUiText = {
    en: {
        exercise: 'Exercise',
        of: 'of',
        guidedMode: 'Guided workout mode',
        getReady: 'Get ready',
        startNow: 'Start now',
        activeWorkout: 'Active workout',
        set: 'Set',
        tapAfterRep: 'Tap after each rep',
        pause: 'Pause',
        resume: 'Resume',
        resetReps: 'Reset reps',
        restPeriod: 'Rest period',
        restCopy: 'Relax your shoulders and breathe slowly before the next set.',
        skipRest: 'Skip rest',
        complete: 'Workout complete',
        wellDone: 'Well done',
        completeCopy: 'Your prescribed routine is logged for today and will appear in progress.',
        viewProgress: 'View progress',
        begin: 'Begin.',
        nextSet: 'Start the next set.',
        setComplete: 'Set complete. Rest for',
        seconds: 'seconds.',
        workoutDone: 'Workout complete. Great effort today.'
    },
    hi: {
        exercise: 'व्यायाम',
        of: 'में से',
        guidedMode: 'मार्गदर्शित व्यायाम मोड',
        getReady: 'तैयार हो जाएं',
        startNow: 'अभी शुरू करें',
        activeWorkout: 'सक्रिय व्यायाम',
        set: 'सेट',
        tapAfterRep: 'हर रेप के बाद टैप करें',
        pause: 'रोकें',
        resume: 'जारी रखें',
        resetReps: 'रेप रीसेट करें',
        restPeriod: 'आराम का समय',
        restCopy: 'कंधों को आराम दें और अगले सेट से पहले धीरे सांस लें।',
        skipRest: 'आराम छोड़ें',
        complete: 'व्यायाम पूरा',
        wellDone: 'बहुत अच्छा',
        completeCopy: 'आज की आपकी निर्धारित रूटीन लॉग हो गई है और प्रगति में दिखेगी।',
        viewProgress: 'प्रगति देखें',
        begin: 'शुरू करें।',
        nextSet: 'अगला सेट शुरू करें।',
        setComplete: 'सेट पूरा हुआ। आराम करें',
        seconds: 'सेकंड।',
        workoutDone: 'व्यायाम पूरा हुआ। आज बहुत अच्छा प्रयास।'
    },
    ta: {
        exercise: 'உடற்பயிற்சி',
        of: 'இல்',
        guidedMode: 'வழிகாட்டப்பட்ட பயிற்சி முறை',
        getReady: 'தயாராகுங்கள்',
        startNow: 'இப்போது தொடங்கு',
        activeWorkout: 'செயலில் உள்ள பயிற்சி',
        set: 'செட்',
        tapAfterRep: 'ஒவ்வொரு முறைக்கும் பிறகு தட்டவும்',
        pause: 'நிறுத்து',
        resume: 'தொடரவும்',
        resetReps: 'முறைகளை மீட்டமை',
        restPeriod: 'ஓய்வு நேரம்',
        restCopy: 'தோள்களை தளர்த்தி, அடுத்த செட்டுக்கு முன் மெதுவாக மூச்செடுங்கள்.',
        skipRest: 'ஓய்வை தவிர்',
        complete: 'பயிற்சி முடிந்தது',
        wellDone: 'நன்றாக செய்தீர்கள்',
        completeCopy: 'இன்றைய உங்கள் பயிற்சி பதிவு செய்யப்பட்டது; அது முன்னேற்றத்தில் தெரியும்.',
        viewProgress: 'முன்னேற்றம் பார்க்க',
        begin: 'தொடங்குங்கள்.',
        nextSet: 'அடுத்த செட்டை தொடங்குங்கள்.',
        setComplete: 'செட் முடிந்தது. ஓய்வு எடுங்கள்',
        seconds: 'விநாடிகள்.',
        workoutDone: 'பயிற்சி முடிந்தது. இன்று அருமையான முயற்சி.'
    },
    kn: {
        exercise: 'ವ್ಯಾಯಾಮ',
        of: 'ರಲ್ಲಿ',
        guidedMode: 'ಮಾರ್ಗದರ್ಶಿತ ವ್ಯಾಯಾಮ ಮೋಡ್',
        getReady: 'ಸಿದ್ಧರಾಗಿ',
        startNow: 'ಈಗ ಆರಂಭಿಸಿ',
        activeWorkout: 'ಸಕ್ರಿಯ ವ್ಯಾಯಾಮ',
        set: 'ಸೆಟ್',
        tapAfterRep: 'ಪ್ರತಿ ರೆಪ್ ನಂತರ ಟ್ಯಾಪ್ ಮಾಡಿ',
        pause: 'ವಿರಾಮ',
        resume: 'ಮುಂದುವರಿಸಿ',
        resetReps: 'ರೆಪ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ',
        restPeriod: 'ವಿಶ್ರಾಂತಿ ಸಮಯ',
        restCopy: 'ಭುಜಗಳನ್ನು ಸಡಿಲಗೊಳಿಸಿ ಮತ್ತು ಮುಂದಿನ ಸೆಟ್‌ಗಿಂತ ಮೊದಲು ನಿಧಾನವಾಗಿ ಉಸಿರಾಡಿ.',
        skipRest: 'ವಿಶ್ರಾಂತಿ ಬಿಟ್ಟುಬಿಡಿ',
        complete: 'ವ್ಯಾಯಾಮ ಪೂರ್ಣ',
        wellDone: 'ಚೆನ್ನಾಗಿದೆ',
        completeCopy: 'ಇಂದಿನ ನಿಮ್ಮ ನಿಗದಿತ ರೂಟಿನ್ ದಾಖಲಾಗಿದೆ ಮತ್ತು ಪ್ರಗತಿಯಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.',
        viewProgress: 'ಪ್ರಗತಿ ನೋಡಿ',
        begin: 'ಆರಂಭಿಸಿ.',
        nextSet: 'ಮುಂದಿನ ಸೆಟ್ ಆರಂಭಿಸಿ.',
        setComplete: 'ಸೆಟ್ ಪೂರ್ಣಗೊಂಡಿದೆ. ವಿಶ್ರಾಂತಿ ಮಾಡಿ',
        seconds: 'ಸೆಕೆಂಡುಗಳು.',
        workoutDone: 'ವ್ಯಾಯಾಮ ಪೂರ್ಣಗೊಂಡಿದೆ. ಇಂದಿನ ಪ್ರಯತ್ನ ಉತ್ತಮವಾಗಿದೆ.'
    },
    es: {
        exercise: 'Ejercicio',
        of: 'de',
        guidedMode: 'Modo de rutina guiada',
        getReady: 'Prepárate',
        startNow: 'Empezar ahora',
        activeWorkout: 'Rutina activa',
        set: 'Serie',
        tapAfterRep: 'Toca después de cada repetición',
        pause: 'Pausa',
        resume: 'Continuar',
        resetReps: 'Reiniciar reps',
        restPeriod: 'Descanso',
        restCopy: 'Relaja los hombros y respira lento antes de la siguiente serie.',
        skipRest: 'Saltar descanso',
        complete: 'Rutina completa',
        wellDone: 'Muy bien',
        completeCopy: 'Tu rutina prescrita quedó registrada para hoy y aparecerá en progreso.',
        viewProgress: 'Ver progreso',
        begin: 'Comienza.',
        nextSet: 'Comienza la siguiente serie.',
        setComplete: 'Serie completa. Descansa por',
        seconds: 'segundos.',
        workoutDone: 'Rutina completa. Gran esfuerzo hoy.'
    }
};

export const historyUiText = {
    en: {
        today: 'Today',
        progressDashboard: 'Progress dashboard',
        recovery: 'recovery',
        days: 'days',
        streak: 'Streak',
        consistency: 'Consistency',
        totalLogged: 'Total reps logged',
        last28: 'Last 28 days',
        activeDays: 'active days',
        less: 'Less',
        more: 'More',
        recentActivity: 'Recent activity',
        noActivity: 'No activity logged yet.',
        exercisesCompleted: 'exercises completed',
        progress: 'Progress'
    },
    hi: {
        today: 'आज',
        progressDashboard: 'प्रगति डैशबोर्ड',
        recovery: 'रिकवरी',
        days: 'दिन',
        streak: 'स्ट्रीक',
        consistency: 'नियमितता',
        totalLogged: 'कुल रेप दर्ज',
        last28: 'पिछले 28 दिन',
        activeDays: 'सक्रिय दिन',
        less: 'कम',
        more: 'अधिक',
        recentActivity: 'हाल की गतिविधि',
        noActivity: 'अभी कोई गतिविधि दर्ज नहीं है।',
        exercisesCompleted: 'व्यायाम पूरे',
        progress: 'प्रगति'
    },
    ta: {
        today: 'இன்று',
        progressDashboard: 'முன்னேற்ற பலகை',
        recovery: 'மீட்பு',
        days: 'நாட்கள்',
        streak: 'தொடர்ச்சி',
        consistency: 'நிலைத்தன்மை',
        totalLogged: 'மொத்த பதிவுகள்',
        last28: 'கடைசி 28 நாட்கள்',
        activeDays: 'செயலில் இருந்த நாட்கள்',
        less: 'குறைவு',
        more: 'அதிகம்',
        recentActivity: 'சமீபத்திய செயல்பாடு',
        noActivity: 'இன்னும் செயல்பாடு பதிவு செய்யப்படவில்லை.',
        exercisesCompleted: 'உடற்பயிற்சிகள் முடிந்தது',
        progress: 'முன்னேற்றம்'
    },
    kn: {
        today: 'ಇಂದು',
        progressDashboard: 'ಪ್ರಗತಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        recovery: 'ಚೇತರಿಕೆ',
        days: 'ದಿನಗಳು',
        streak: 'ಸರಣಿ',
        consistency: 'ನಿಯಮಿತತೆ',
        totalLogged: 'ಒಟ್ಟು ದಾಖಲಾದ ರೆಪ್‌ಗಳು',
        last28: 'ಕಳೆದ 28 ದಿನಗಳು',
        activeDays: 'ಸಕ್ರಿಯ ದಿನಗಳು',
        less: 'ಕಡಿಮೆ',
        more: 'ಹೆಚ್ಚು',
        recentActivity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
        noActivity: 'ಇನ್ನೂ ಯಾವುದೇ ಚಟುವಟಿಕೆ ದಾಖಲಾಗಿಲ್ಲ.',
        exercisesCompleted: 'ವ್ಯಾಯಾಮಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ',
        progress: 'ಪ್ರಗತಿ'
    },
    es: {
        today: 'Hoy',
        progressDashboard: 'Panel de progreso',
        recovery: 'recuperación',
        days: 'días',
        streak: 'Racha',
        consistency: 'Consistencia',
        totalLogged: 'Reps registradas',
        last28: 'Últimos 28 días',
        activeDays: 'días activos',
        less: 'Menos',
        more: 'Más',
        recentActivity: 'Actividad reciente',
        noActivity: 'Aún no hay actividad registrada.',
        exercisesCompleted: 'ejercicios completados',
        progress: 'Progreso'
    }
};

const gluteBridgeGuides = {
    en: {
        name: 'Glute Bridge',
        difficulty: 'Beginner',
        total_reps: '3 sets x 12 reps',
        primary_benefit: 'Strengthens the glutes and hamstrings to support hip, knee, and lower-back recovery.',
        voice_intro: 'Welcome. Today we will build steady hip strength with calm control. Move slowly, breathe easily, and let each lift feel smooth and supported.',
        steps: [
            {
                heading: 'Set Your Base',
                instruction: 'Lie on your back with knees bent and feet flat, hip-width apart.',
                voice_guidance: 'Settle onto your back. Feet grounded, knees soft. Take a slow inhale through the nose, and let your shoulders relax.'
            },
            {
                heading: 'Lift With Control',
                instruction: 'Squeeze your glutes and lift your hips until your body forms a gentle straight line.',
                voice_guidance: 'Exhale and press through your heels. Lift the hips smoothly, one calm count up, keeping the ribs quiet and the neck relaxed.'
            },
            {
                heading: 'Pause And Lower',
                instruction: 'Hold briefly, then lower your hips slowly back to the mat.',
                voice_guidance: 'Hold for a soft breath. Inhale as you lower with control, vertebra by vertebra, landing lightly before the next rep.'
            }
        ],
        pro_tips: ['Do not arch your lower back at the top.', 'Keep your feet close enough that you can press through the heels.'],
        completion_message: 'Beautiful work. Your hips and glutes are waking up with strength, patience, and control.'
    },
    hi: {
        name: 'ग्लूट ब्रिज',
        difficulty: 'शुरुआती',
        total_reps: '3 सेट x 12 रेप',
        primary_benefit: 'कूल्हों, घुटनों और कमर को सहारा देने के लिए ग्लूट्स और हैमस्ट्रिंग को मजबूत करता है।',
        voice_intro: 'स्वागत है। आज हम शांत नियंत्रण के साथ कूल्हों की ताकत बढ़ाएंगे। धीरे चलें, आराम से सांस लें, और हर उठाव को सहज रखें।',
        steps: [
            {
                heading: 'स्थिति बनाएं',
                instruction: 'पीठ के बल लेटें, घुटने मोड़ें, और पैरों को कूल्हों की चौड़ाई पर सपाट रखें।',
                voice_guidance: 'पीठ को आराम से टिकाएं। पैर जमीन पर स्थिर रखें। नाक से धीरे सांस अंदर लें, और कंधों को ढीला छोड़ दें।'
            },
            {
                heading: 'नियंत्रण से उठाएं',
                instruction: 'ग्लूट्स को कसें और कूल्हों को ऊपर उठाएं, जब तक शरीर हल्की सीधी रेखा बनाए।',
                voice_guidance: 'सांस बाहर छोड़ते हुए एड़ियों से दबाव दें। कूल्हों को शांत गति से ऊपर उठाएं, पसलियों को स्थिर और गर्दन को आराम में रखें।'
            },
            {
                heading: 'रुकें और नीचे आएं',
                instruction: 'थोड़ा रुकें, फिर कूल्हों को धीरे-धीरे वापस मैट पर लाएं।',
                voice_guidance: 'एक नरम सांस तक रुकें। सांस अंदर लेते हुए धीरे नीचे आएं, हल्के से टिकें, फिर अगला रेप शुरू करें।'
            }
        ],
        pro_tips: ['ऊपर जाते समय कमर को ज्यादा न मोड़ें।', 'पैर इतने पास रखें कि दबाव एड़ियों से महसूस हो।'],
        completion_message: 'बहुत अच्छा। आपके कूल्हे और ग्लूट्स ताकत, धैर्य और नियंत्रण के साथ सक्रिय हो रहे हैं।'
    },
    ta: {
        name: 'குளூட் பிரிட்ஜ்',
        difficulty: 'ஆரம்ப நிலை',
        total_reps: '3 செட் x 12 முறை',
        primary_benefit: 'இடுப்பு, முழங்கை மற்றும் கீழ் முதுகுக்கு ஆதரவு தர குளூட்ஸ் மற்றும் ஹாம்ஸ்ட்ரிங்ஸை பலப்படுத்தும்.',
        voice_intro: 'வரவேற்கிறேன். இன்று அமைதியான கட்டுப்பாட்டுடன் இடுப்பு பலத்தை வளர்ப்போம். மெதுவாக நகருங்கள், சீராக மூச்செடுங்கள்.',
        steps: [
            {
                heading: 'அடித்தளத்தை அமைக்கவும்',
                instruction: 'முதுகில் படுத்து, முழங்கால்களை மடக்கி, பாதங்களை இடுப்பு அகலத்தில் தரையில் வையுங்கள்.',
                voice_guidance: 'முதுகை மெதுவாக நிலைநிறுத்துங்கள். பாதங்கள் தரையில் உறுதியாக. மூக்கின் வழி மெதுவாக மூச்சை இழுத்து, தோள்களை தளர்த்துங்கள்.'
            },
            {
                heading: 'கட்டுப்பாட்டுடன் உயர்த்தவும்',
                instruction: 'குளூட்ஸை இறுக்கி, உடல் மென்மையான நேர்கோடு போல வரும்வரை இடுப்பை உயர்த்துங்கள்.',
                voice_guidance: 'மூச்சை வெளியே விடும்போது குதிகாலில் அழுத்தம் கொடுங்கள். இடுப்பை மென்மையாக உயர்த்தி, கழுத்தை தளர்வாக வைத்திருங்கள்.'
            },
            {
                heading: 'நிறுத்தி கீழிறங்கவும்',
                instruction: 'சிறிது நேரம் நிறுத்தி, இடுப்பை மெதுவாக மீண்டும் மேட்டில் இறக்குங்கள்.',
                voice_guidance: 'ஒரு மென்மையான மூச்சு வரை நிலைநிறுத்துங்கள். மூச்சை இழுத்தபடி கட்டுப்பாட்டுடன் கீழிறங்குங்கள்.'
            }
        ],
        pro_tips: ['மேலே செல்லும் போது கீழ் முதுகை அதிகமாக வளைத்திடாதீர்கள்.', 'அழுத்தம் குதிகாலில் உணரும்படி பாதங்களை சரியான தூரத்தில் வையுங்கள்.'],
        completion_message: 'அருமை. உங்கள் இடுப்பு மற்றும் குளூட்ஸ் அமைதியான கட்டுப்பாட்டுடன் பலம் பெறுகின்றன.'
    },
    kn: {
        name: 'ಗ್ಲೂಟ್ ಬ್ರಿಡ್ಜ್',
        difficulty: 'ಆರಂಭಿಕ',
        total_reps: '3 ಸೆಟ್ x 12 ರೆಪ್',
        primary_benefit: 'ಹಿಪ್, ಮೊಣಕಾಲು ಮತ್ತು ಕೆಳ ಬೆನ್ನಿಗೆ ಬೆಂಬಲ ನೀಡಲು ಗ್ಲೂಟ್ಸ್ ಮತ್ತು ಹ್ಯಾಮ್ಸ್ಟ್ರಿಂಗ್ ಸ್ನಾಯುಗಳನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.',
        voice_intro: 'ಸ್ವಾಗತ. ಇಂದು ಶಾಂತ ನಿಯಂತ್ರಣದೊಂದಿಗೆ ಹಿಪ್ ಬಲವನ್ನು ಬೆಳೆಸೋಣ. ನಿಧಾನವಾಗಿ ಚಲಿಸಿ, ಸಮವಾಗಿ ಉಸಿರಾಡಿ.',
        steps: [
            {
                heading: 'ಆಧಾರ ಸಿದ್ಧಪಡಿಸಿ',
                instruction: 'ಬೆನ್ನಿನ ಮೇಲೆ ಮಲಗಿ, ಮೊಣಕಾಲುಗಳನ್ನು ಮಡಚಿ, ಪಾದಗಳನ್ನು ಹಿಪ್ ಅಗಲದಲ್ಲಿ ನೆಲದ ಮೇಲೆ ಇಡಿ.',
                voice_guidance: 'ಬೆನ್ನನ್ನು ಆರಾಮವಾಗಿ ನೆಲಕ್ಕೆ ಇಡಿ. ಪಾದಗಳು ಸ್ಥಿರವಾಗಿರಲಿ. ಮೂಗಿನಿಂದ ನಿಧಾನವಾಗಿ ಉಸಿರೆಳೆದು, ಭುಜಗಳನ್ನು ಸಡಿಲಗೊಳಿಸಿ.'
            },
            {
                heading: 'ನಿಯಂತ್ರಣದಿಂದ ಎತ್ತಿ',
                instruction: 'ಗ್ಲೂಟ್ಸ್ ಬಿಗಿಗೊಳಿಸಿ, ದೇಹವು ಮೃದುವಾದ ನೇರ ರೇಖೆಯಂತೆ ಕಾಣುವವರೆಗೆ ಹಿಪ್ ಎತ್ತಿ.',
                voice_guidance: 'ಉಸಿರನ್ನು ಬಿಡುತ್ತಾ ಎಡಿಗಳ ಮೂಲಕ ಒತ್ತಿರಿ. ಹಿಪ್ ಅನ್ನು ನಿಧಾನವಾಗಿ ಎತ್ತಿ, ಕುತ್ತಿಗೆಯನ್ನು ಆರಾಮವಾಗಿ ಇಡಿ.'
            },
            {
                heading: 'ನಿಲ್ಲಿಸಿ ಇಳಿಸಿ',
                instruction: 'ಸ್ವಲ್ಪ ನಿಲ್ಲಿಸಿ, ನಂತರ ಹಿಪ್ ಅನ್ನು ನಿಧಾನವಾಗಿ ಮ್ಯಾಟ್ ಮೇಲೆ ಇಳಿಸಿ.',
                voice_guidance: 'ಒಂದು ಮೃದುವಾದ ಉಸಿರಿನಷ್ಟು ಹಿಡಿದುಕೊಳ್ಳಿ. ಉಸಿರೆಳೆಯುತ್ತಾ ನಿಯಂತ್ರಣದಿಂದ ಕೆಳಗೆ ಇಳಿಯಿರಿ.'
            }
        ],
        pro_tips: ['ಮೇಲೆ ಎತ್ತುವಾಗ ಕೆಳ ಬೆನ್ನನ್ನು ಹೆಚ್ಚು ಬಾಗಿಸಬೇಡಿ.', 'ಒತ್ತಡ ಎಡಿಗಳಲ್ಲಿ ಅನುಭವವಾಗುವಂತೆ ಪಾದಗಳನ್ನು ಸರಿಯಾದ ದೂರದಲ್ಲಿ ಇಡಿ.'],
        completion_message: 'ಅದ್ಭುತ. ನಿಮ್ಮ ಹಿಪ್ ಮತ್ತು ಗ್ಲೂಟ್ಸ್ ಶಕ್ತಿ, ಸಹನೆ ಮತ್ತು ನಿಯಂತ್ರಣದಿಂದ ಚುರುಕಾಗುತ್ತಿವೆ.'
    },
    es: {
        name: 'Puente de Glúteos',
        difficulty: 'Principiante',
        total_reps: '3 series x 12 repeticiones',
        primary_benefit: 'Fortalece glúteos e isquiotibiales para apoyar la recuperación de cadera, rodilla y zona lumbar.',
        voice_intro: 'Bienvenido. Hoy construiremos fuerza en la cadera con calma y control. Muévete despacio, respira suave y mantén cada elevación estable.',
        steps: [
            {
                heading: 'Prepara La Base',
                instruction: 'Acuéstate boca arriba con las rodillas dobladas y los pies apoyados al ancho de las caderas.',
                voice_guidance: 'Relaja la espalda sobre la colchoneta. Pies firmes. Inhala lento por la nariz y deja que los hombros se suavicen.'
            },
            {
                heading: 'Eleva Con Control',
                instruction: 'Aprieta los glúteos y eleva la cadera hasta formar una línea suave con el cuerpo.',
                voice_guidance: 'Exhala y empuja desde los talones. Eleva la cadera con un ritmo tranquilo, manteniendo el cuello relajado.'
            },
            {
                heading: 'Pausa Y Baja',
                instruction: 'Mantén un momento y baja la cadera lentamente hacia la colchoneta.',
                voice_guidance: 'Sostén una respiración suave. Inhala mientras bajas con control, aterrizando ligero antes de repetir.'
            }
        ],
        pro_tips: ['No arquees demasiado la zona lumbar arriba.', 'Mantén los pies lo bastante cerca para empujar desde los talones.'],
        completion_message: 'Excelente trabajo. Tus caderas y glúteos están ganando fuerza con paciencia y control.'
    }
};

export const getExerciseGuide = (exerciseName, language) => {
    const normalized = exerciseName.toLowerCase();
    if (normalized.includes('glute bridge')) {
        return gluteBridgeGuides[language] || gluteBridgeGuides.en;
    }

    return null;
};
