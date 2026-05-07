import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Save, Plus, Trash2, Search, Info, AlertTriangle } from 'lucide-react';
import { exerciseLibrary } from '../data/exercises';
import api from '../api/client';

import { QRCodeCanvas } from 'qrcode.react';

const PlanBuilder = () => {
    const navigate = useNavigate();
    const [patientName, setPatientName] = useState('');
    const [durationWeeks, setDurationWeeks] = useState(4);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [showLibrary, setShowLibrary] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [generatedToken, setGeneratedToken] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const addExercise = (exercise) => {
        const newExercise = {
            ...exercise,
            instanceId: Date.now() + Math.random(), // Unique ID for this specific plan instance
            sets: exercise.defaultSets,
            reps: exercise.defaultReps,
            restSeconds: exercise.restSeconds
        };
        setSelectedExercises([...selectedExercises, newExercise]);
        setShowLibrary(false);
    };

    const removeExercise = (instanceId) => {
        setSelectedExercises(selectedExercises.filter(ex => ex.instanceId !== instanceId));
    };

    const updateExercise = (instanceId, field, value) => {
        setSelectedExercises(selectedExercises.map(ex => 
            ex.instanceId === instanceId ? { ...ex, [field]: value } : ex
        ));
    };

    const handleSave = async () => {
        if (!patientName || selectedExercises.length === 0) {
            alert('Please provide a patient name and select at least one exercise.');
            return;
        }

        setLoading(true);
        try {
            const planData = {
                patientName,
                durationWeeks,
                exercises: selectedExercises.map(ex => ({
                    id: ex.id,
                    name: ex.name,
                    muscleGroup: ex.muscleGroup,
                    description: ex.description,
                    sets: parseInt(ex.sets),
                    reps: parseInt(ex.reps),
                    restSeconds: parseInt(ex.restSeconds),
                    steps: ex.steps,
                    mistakes: ex.mistakes
                }))
            };
            const response = await api.post('/plans', planData);
            setGeneratedToken(response.data.token);
            setShowSuccess(true);
        } catch (error) {
            console.error('Error saving plan:', error);
            alert('Failed to save plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredLibrary = exerciseLibrary.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const shareUrl = `${window.location.origin}/patient/${generatedToken}`;

    return (
        <div className="builder-container">
            <header className="builder-header">
                <button onClick={() => navigate('/dashboard')} className="back-btn">
                    <ChevronLeft size={20} /> Back
                </button>
                <h1>Create Exercise Plan</h1>
                <button onClick={handleSave} disabled={loading} className="save-btn">
                    <Save size={20} /> {loading ? 'Saving...' : 'Save Plan'}
                </button>
            </header>

            <main className="builder-content">
                <section className="patient-details card">
                    <h3><Info size={18} /> Patient Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Patient Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. John Doe" 
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Duration (Weeks)</label>
                            <select value={durationWeeks} onChange={(e) => setDurationWeeks(e.target.value)}>
                                {[1, 2, 4, 6, 8, 12].map(w => (
                                    <option key={w} value={w}>{w} Weeks</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <section className="selected-exercises">
                    <div className="section-header">
                        <h3>Prescribed Exercises</h3>
                        <button onClick={() => setShowLibrary(true)} className="add-btn">
                            <Plus size={18} /> Add Exercise
                        </button>
                    </div>

                    <div className="exercise-list">
                        {selectedExercises.length === 0 ? (
                            <div className="empty-list-prompt">
                                <p>No exercises added yet. Click "Add Exercise" to start.</p>
                            </div>
                        ) : (
                            selectedExercises.map((ex) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={ex.instanceId} 
                                    className="exercise-item card"
                                >
                                    <div className="exercise-info">
                                        <h4>{ex.name}</h4>
                                        <span className="tag">{ex.muscleGroup}</span>
                                    </div>
                                    <div className="exercise-config">
                                        <div className="config-field">
                                            <label>Sets</label>
                                            <input 
                                                type="number" 
                                                value={ex.sets} 
                                                onChange={(e) => updateExercise(ex.instanceId, 'sets', e.target.value)}
                                            />
                                        </div>
                                        <div className="config-field">
                                            <label>Reps</label>
                                            <input 
                                                type="number" 
                                                value={ex.reps} 
                                                onChange={(e) => updateExercise(ex.instanceId, 'reps', e.target.value)}
                                            />
                                        </div>
                                        <div className="config-field">
                                            <label>Rest (s)</label>
                                            <input 
                                                type="number" 
                                                value={ex.restSeconds} 
                                                onChange={(e) => updateExercise(ex.instanceId, 'restSeconds', e.target.value)}
                                            />
                                        </div>
                                        <button onClick={() => removeExercise(ex.instanceId)} className="remove-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    {ex.mistakes.length > 0 && (
                                        <div className="mistakes-preview">
                                            <AlertTriangle size={14} />
                                            <span>{ex.mistakes[0]} and more...</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Exercise Library Modal */}
            <AnimatePresence>
                {showLibrary && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={() => setShowLibrary(false)}
                    >
                        <motion.div 
                            initial={{ y: 50 }}
                            animate={{ y: 0 }}
                            exit={{ y: 50 }}
                            className="modal-content"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h3>Exercise Library</h3>
                                <div className="search-bar">
                                    <Search size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search exercises..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="library-grid">
                                {filteredLibrary.map(ex => (
                                    <div key={ex.id} className="library-item" onClick={() => addExercise(ex)}>
                                        <div className="library-item-info">
                                            <h4>{ex.name}</h4>
                                            <p>{ex.muscleGroup}</p>
                                        </div>
                                        <Plus size={20} className="add-icon" />
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setShowLibrary(false)} className="close-modal-btn">Close</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success QR Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="modal-content success-modal"
                        >
                            <div className="success-header">
                                <h2>Plan Created Successfully!</h2>
                                <p>Scan the QR code below or share the link with <strong>{patientName}</strong>.</p>
                            </div>
                            
                            <div className="qr-container">
                                <QRCodeCanvas value={shareUrl} size={200} />
                            </div>

                            <div className="share-link-box">
                                <input type="text" readOnly value={shareUrl} />
                                <button onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    alert('Link copied!');
                                }}>Copy</button>
                            </div>

                            <button onClick={() => navigate('/dashboard')} className="done-btn">Done & Back to Dashboard</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlanBuilder;
