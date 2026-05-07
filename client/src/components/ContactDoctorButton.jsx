import { PhoneCall } from 'lucide-react';

const ContactDoctorButton = ({ doctorPhoneNumber, doctorName }) => {
    const formattedPhoneNumber = doctorPhoneNumber || '+91 98765 43210';
    const cleanPhoneNumber = formattedPhoneNumber.replace(/[\s-]/g, '');
    const displayName = doctorName || 'PhysioPath Therapist';

    return (
        <a
            href={`tel:${cleanPhoneNumber}`}
            className="contact-doctor-btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-4 font-bold text-white shadow-lg shadow-teal-700/20 transition duration-200 hover:-translate-y-1 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-700/25"
            aria-label={`Call Dr. ${displayName} at ${formattedPhoneNumber}`}
        >
            <PhoneCall size={20} />
            <span>Any queries? Call Dr. {displayName}</span>
        </a>
    );
};

export default ContactDoctorButton;
