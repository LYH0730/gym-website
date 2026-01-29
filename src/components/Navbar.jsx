import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import LanguageSwitcher from './LanguageSwitcher';
import { supabase } from '../supabaseClient'; // Import supabase

const Navbar = () => {
  const { t } = useTranslation();
  const [session, setSession] = useState(null); // State to hold session

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

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">GymFlex</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <nav>
            <ul className="nav-links">
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>{t('nav.home')}</Link></li>
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)}>{t('nav.about')}</Link></li>
              <li><Link to="/programs" onClick={() => window.scrollTo(0, 0)}>{t('nav.programs')}</Link></li>
              <li><Link to="/schedule" onClick={() => window.scrollTo(0, 0)}>{t('nav.schedule')}</Link></li>
              <li><Link to="/trainers" onClick={() => window.scrollTo(0, 0)}>{t('nav.trainers')}</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)}>{t('nav.contact')}</Link></li>
            </ul>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
