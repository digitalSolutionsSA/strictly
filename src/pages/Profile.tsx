import React from 'react';
import { User, MapPin, Phone, Clock, Star, ChevronRight, Coffee, Instagram, Facebook } from 'lucide-react';
import './Profile.css';

const HOURS = [
  { day: 'Monday', time: '7:00 – 17:00' },
  { day: 'Tuesday', time: '7:00 – 17:00' },
  { day: 'Wednesday', time: '7:00 – 17:00' },
  { day: 'Thursday', time: '7:00 – 17:00' },
  { day: 'Friday', time: '7:00 – 17:00' },
  { day: 'Saturday', time: '8:00 – 15:00' },
  { day: 'Sunday', time: 'Closed' },
];

const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long' });

export default function Profile() {
  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-logo-wrap">
          <div className="profile-logo">☕</div>
        </div>
        <div className="profile-script">Strictly Come Coffee</div>
        <div className="profile-tagline">Where Friends Meet</div>
        <div className="profile-rating">
          <Star size={13} fill="#E8A84C" color="#E8A84C" />
          <span>4.9</span>
          <span className="rating-count">· 28 reviews</span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="info-grid">
        <a href="tel:0792555418" className="info-card">
          <Phone size={18} className="info-icon" />
          <div>
            <div className="info-label">Call Us</div>
            <div className="info-value">079 255 5418</div>
          </div>
        </a>
        <div className="info-card">
          <MapPin size={18} className="info-icon" />
          <div>
            <div className="info-label">Location</div>
            <div className="info-value">Find us on Maps</div>
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="profile-section">
        <div className="profile-section-title">
          <Clock size={15} />
          Trading Hours
        </div>
        {HOURS.map(h => (
          <div key={h.day} className={`hours-row ${h.day === today ? 'today' : ''} ${h.time === 'Closed' ? 'closed' : ''}`}>
            <span className="hours-day">
              {h.day}
              {h.day === today && <span className="today-badge">Today</span>}
            </span>
            <span className="hours-time">{h.time}</span>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="profile-section about-section">
        <div className="profile-section-title">
          <Coffee size={15} />
          About Us
        </div>
        <p className="about-text">
          Strictly Come Coffee is your neighbourhood café where great coffee meets great company. 
          We craft every cup with passion using premium beans, and our kitchen brings you fresh, 
          flavourful food made with love.
        </p>
        <p className="about-text" style={{ marginTop: 10 }}>
          Come as you are. Leave as friends. ☕
        </p>
      </div>

      {/* Social */}
      <div className="profile-section">
        <div className="profile-section-title">
          <Star size={15} />
          Follow Us
        </div>
        <div className="social-links">
          <a href="https://facebook.com" className="social-link">
            <Facebook size={20} />
            <span>Facebook</span>
            <ChevronRight size={14} className="social-arrow" />
          </a>
          <a href="https://instagram.com" className="social-link">
            <Instagram size={20} />
            <span>Instagram</span>
            <ChevronRight size={14} className="social-arrow" />
          </a>
        </div>
      </div>
    </div>
  );
}
