import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import '../styles/Common.css'; // Assuming common styles will be used
import './AdminLogin.css'; // Import the new CSS file

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      // On successful login, navigate to a protected admin page
      // For now, let's navigate to the Home page or a placeholder admin dashboard
      navigate('/'); // Or '/admin-dashboard' once created
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <section className="page-header">
        <h1>{t('admin_login.header_title')}</h1>
        <p>{t('admin_login.header_subtitle')}</p>
      </section>
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">{t('admin_login.email_label')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('admin_login.password_label')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? t('admin_login.logging_in') : t('admin_login.login_button')}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
