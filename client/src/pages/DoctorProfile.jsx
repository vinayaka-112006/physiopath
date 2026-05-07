import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Award,
    BriefcaseMedical,
    Download,
    FileText,
    Mail,
    MapPin,
    ShieldCheck,
    Star,
    UserRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const hardcodedDoctorProfile = {
    specialization: 'Orthopedic Physiotherapist',
    yearsOfExperience: 8,
    address: 'PhysioPath Recovery Clinic, Bengaluru',
    workingAt: 'PhysioPath Care Studio',
    photoUrl: '',
    documentName: 'Physiotherapy License.pdf',
    isVerified: true,
    rating: 4.8
};

const DoctorProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const doctor = {
        ...hardcodedDoctorProfile,
        name: user?.name || 'PhysioPath Therapist',
        email: user?.email || 'doctor@physiopath.com',
        ...Object.fromEntries(
            Object.entries(user || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
        )
    };

    const initials = doctor.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const handleDownload = () => {
        const blob = new Blob([
            `${doctor.name}\n${doctor.specialization}\nVerified PhysioPath therapist profile document.`
        ], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doctor.documentName.replace(/\.pdf$/i, '.txt');
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="doctor-profile-shell">
            <header className="doctor-profile-nav">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft size={20} /> Dashboard
                </button>
                <strong>Doctor Profile</strong>
            </header>

            <main className="doctor-profile-main">
                <section className="doctor-profile-card">
                    <div className="doctor-profile-hero">
                        <div className="doctor-photo-wrap">
                            {doctor.photoUrl ? (
                                <img src={doctor.photoUrl} alt={doctor.name} />
                            ) : (
                                <div className="doctor-initials">{initials}</div>
                            )}
                            {doctor.isVerified && (
                                <span className="photo-verified" aria-label="Verified doctor">
                                    <ShieldCheck size={20} />
                                </span>
                            )}
                        </div>

                        <div className="doctor-profile-heading">
                            <div className="doctor-name-row">
                                <h1>{doctor.name}</h1>
                                {doctor.isVerified && (
                                    <span className="verified-text-badge">
                                        <ShieldCheck size={16} /> Verified
                                    </span>
                                )}
                            </div>
                            <p>{doctor.specialization}</p>
                            <div className="doctor-profile-stats">
                                <span><Award size={18} /> {doctor.yearsOfExperience}+ years experience</span>
                                <span><Star size={18} fill="currentColor" /> {doctor.rating} rating</span>
                            </div>
                        </div>
                    </div>

                    <div className="doctor-info-grid">
                        <article>
                            <Mail size={22} />
                            <div>
                                <span>Email</span>
                                <strong>{doctor.email}</strong>
                            </div>
                        </article>
                        <article>
                            <MapPin size={22} />
                            <div>
                                <span>Address</span>
                                <strong>{doctor.address}</strong>
                            </div>
                        </article>
                        <article>
                            <BriefcaseMedical size={22} />
                            <div>
                                <span>Working At</span>
                                <strong>{doctor.workingAt}</strong>
                            </div>
                        </article>
                        <article>
                            <FileText size={22} />
                            <div>
                                <span>Document</span>
                                <strong>{doctor.documentName}</strong>
                            </div>
                            <button className="secondary-action" onClick={handleDownload}>
                                <Download size={17} /> Download
                            </button>
                        </article>
                    </div>

                    <aside className="doctor-profile-note">
                        <UserRound size={20} />
                        <p>Profile details use your registered name and email. Other professional fields are preset until profile editing is added to registration.</p>
                    </aside>
                </section>
            </main>
        </div>
    );
};

export default DoctorProfile;
