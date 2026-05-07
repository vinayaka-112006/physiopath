import { Languages } from 'lucide-react';
import { languageOptions, storeLanguage } from '../data/languages';

const LanguageSelect = ({ value, onChange }) => {
    const handleChange = (event) => {
        storeLanguage(event.target.value);
        onChange(event.target.value);
    };

    return (
        <label className="language-select">
            <Languages size={16} />
            <select value={value} onChange={handleChange} aria-label="Select language">
                {languageOptions.map((language) => (
                    <option key={language.code} value={language.code}>
                        {language.label}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default LanguageSelect;
