import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient'; // Import supabase
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TW</a>
        </div>
        <div className="footer-copyright">
          <p>&copy; {currentYear} GymFlex. All Rights Reserved.</p>
        </div>
        <div className="footer-admin-section">
          {session ? (
            <button onClick={handleLogout} className="footer-admin-button">
              {t('admin_login.logout_button')}
            </button>
          ) : (
            <Link to="/admin-login" className="footer-admin-link">
              {t('admin_login.login_button')}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
