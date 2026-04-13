import { Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function WhatsAppButton() {
  const { user } = useAuth();
  const phoneNumber = '+919553739187';
  const whatsappNumber = '919553739187';
  const message = user
    ? `Hello, I am ${user.username}, I want to know more about your products and services.`
    : "Hello, I want to know more about your products and services.";

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="floating-contact-container">
      <button
        onClick={handlePhoneClick}
        className="phone-float flex-center"
        aria-label="Call Us"
      >
        <Phone size={24} />
      </button>
      <button
        onClick={handleWhatsAppClick}
        className="whatsapp-float flex-center"
        aria-label="Chat on WhatsApp"
      >
        {/* Real WhatsApp SVG Logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="32"
          height="32"
          fill="white"
        >
          <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17.1 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36c-3.1 0-6.1-.8-8.7-2.4l-.6-.4-6.2 1.6 1.7-6-.4-.6C8.8 30.1 8 27.1 8 24 8 15.2 15.2 8 24 8s16 7.2 16 16-7.2 16-16 16zm8.7-11.8c-.5-.2-2.8-1.4-3.2-1.5-.4-.2-.7-.2-1 .2-.3.5-1.2 1.5-1.4 1.8-.3.3-.5.3-1 .1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.8-2.6-3.2-.3-.5 0-.7.2-.9l.6-.8c.2-.2.2-.5.4-.7.1-.2.1-.5 0-.7-.1-.2-1-2.5-1.4-3.4-.4-.9-.7-.8-1-.8h-.9c-.3 0-.7.1-1.1.5-.4.5-1.4 1.4-1.4 3.4 0 2 1.5 3.9 1.7 4.2.2.2 2.9 4.5 7.1 6.3 1 .4 1.8.7 2.4.9.9.3 1.8.2 2.5.1.8-.1 2.4-.9 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.1-.4-.2-.9-.4z" />
        </svg>
      </button>
    </div>
  );
}

export default WhatsAppButton;
