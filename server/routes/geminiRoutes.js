const express = require('express');

const router = express.Router();

const languageNames = {
    en: 'English',
    hi: 'Hindi',
    ta: 'Tamil',
    kn: 'Kannada',
    es: 'Spanish'
};

const getGeminiKey = () => (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY
);

const buildPrompt = ({ exerciseName, language, step, index }) => {
    const languageName = languageNames[language] || 'English';
    return [
        'Create one clean, modern, patient-friendly flat-vector physiotherapy illustration.',
        `Exercise: ${exerciseName}.`,
        `Step ${index + 1}: ${step.heading || step.instruction}.`,
        `Instruction context in ${languageName}: ${step.instruction}.`,
        'Use the style of a simple fitness exercise poster: white background, colorful cartoon-like adult character, clean body posture, soft outlines.',
        'Show the full body clearly, with gym/yoga mat or small exercise props only if useful.',
        'Use warm colors such as orange, teal, coral, blue, and skin tones.',
        'No text, no labels, no watermark-like text, no photorealism, no clutter, no dark background.',
        'Style: friendly 2D vector, simple anatomy, clear rehabilitation posture, soft rounded shapes.'
    ].join(' ');
};

const extractInlineImage = (payload) => {
    const parts = payload?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((part) => part.inlineData?.data || part.inline_data?.data);
    const inlineData = imagePart?.inlineData || imagePart?.inline_data;
    if (!inlineData?.data) return null;
    return {
        mimeType: inlineData.mimeType || inlineData.mime_type || 'image/png',
        data: inlineData.data
    };
};

const fallbackImage = (index) => {
    const hipY = 306 - (index * 22);
    const torsoY = 318 - (index * 14);
    const svg = `
<svg width="960" height="600" viewBox="0 0 960 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="960" height="600" rx="32" fill="#FFFFFF"/>
  <circle cx="188" cy="132" r="58" fill="#EAF7FF"/>
  <circle cx="790" cy="454" r="72" fill="#FFF0E8"/>
  <ellipse cx="480" cy="452" rx="320" ry="28" fill="#DDE7DF"/>
  <rect x="240" y="418" width="480" height="24" rx="12" fill="#D95D52"/>
  <circle cx="284" cy="342" r="38" fill="#F0B17F"/>
  <path d="M252 334c18-42 58-54 88-28-4 28-25 46-56 46-12 0-23-5-32-18Z" fill="#2E3A59"/>
  <path d="M326 ${torsoY}C390 ${torsoY - 14} 466 ${hipY - 12} 552 ${hipY}" stroke="#2F8DB3" stroke-width="36" stroke-linecap="round"/>
  <path d="M552 ${hipY}C612 340 650 374 690 424" stroke="#F0B17F" stroke-width="28" stroke-linecap="round"/>
  <path d="M552 ${hipY}C514 360 492 392 466 424" stroke="#F0B17F" stroke-width="28" stroke-linecap="round"/>
  <path d="M690 424H780M466 424H562" stroke="#F0B17F" stroke-width="28" stroke-linecap="round"/>
  <path d="M520 ${hipY - 22}c30-20 62-18 94 7l-16 62c-41 4-78-8-112-36l34-33Z" fill="#F06F45"/>
  <path d="M398 ${torsoY - 26}c34 16 70 16 108 0" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
  <circle cx="184" cy="140" r="16" fill="#F06F45"/>
  <rect x="164" y="166" width="40" height="96" rx="18" fill="#2F8DB3"/>
  <path d="M164 202h-44M204 202h44" stroke="#F0B17F" stroke-width="14" stroke-linecap="round"/>
  <path d="M176 260l-22 72M194 260l24 72" stroke="#F06F45" stroke-width="16" stroke-linecap="round"/>
  <circle cx="798" cy="356" r="20" fill="#F0B17F"/>
  <rect x="770" y="382" width="56" height="76" rx="24" fill="#F7B731"/>
  <path d="M770 418h-42M826 418h42" stroke="#F0B17F" stroke-width="12" stroke-linecap="round"/>
  <path d="M786 456l-24 58M812 456l24 58" stroke="#D95D52" stroke-width="14" stroke-linecap="round"/>
</svg>`;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

router.post('/exercise-images', async (req, res) => {
    try {
        const apiKey = getGeminiKey();
        if (!apiKey) {
            return res.status(500).json({ message: 'Gemini API key is not configured on the server.' });
        }

        const { exerciseName, language = 'en', steps = [] } = req.body;
        if (!exerciseName || !Array.isArray(steps) || steps.length === 0) {
            return res.status(400).json({ message: 'exerciseName and steps are required.' });
        }

        const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-pro-preview';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        const images = [];
        const warnings = [];
        for (const [index, step] of steps.slice(0, 4).entries()) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': apiKey
                    },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{ text: buildPrompt({ exerciseName, language, step, index }) }]
                        }],
                        generationConfig: {
                            responseModalities: ['TEXT', 'IMAGE']
                        }
                    })
                });

                const payload = await response.json();
                if (!response.ok) {
                    throw new Error(payload?.error?.message || 'Gemini image generation failed.');
                }

                const inlineImage = extractInlineImage(payload);
                if (!inlineImage) {
                    throw new Error('Gemini did not return an image.');
                }

                images.push({
                    stepNumber: index + 1,
                    source: 'gemini',
                    dataUrl: `data:${inlineImage.mimeType};base64,${inlineImage.data}`
                });
            } catch (error) {
                warnings.push(error.message);
                images.push({
                    stepNumber: index + 1,
                    source: 'fallback',
                    dataUrl: fallbackImage(index)
                });
            }
        }

        res.json({ images, warnings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
