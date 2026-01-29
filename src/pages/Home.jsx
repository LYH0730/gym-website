import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <Link to="/programs" className="cta-button">
            {t('hero.cta')}
          </Link>
        </div>
      </section>

      <section className="featured-programs">
        <h2>{t('home_featured.title')}</h2>
        <div className="program-cards-container">
          <div className="program-card">
            <h3>{t('home_featured.pt_title')}</h3>
            <p>{t('home_featured.pt_desc')}</p>
          </div>
          <div className="program-card">
            <h3>{t('home_featured.group_title')}</h3>
            <p>{t('home_featured.group_desc')}</p>
          </div>
          <div className="program-card">
            <h3>{t('home_featured.weight_title')}</h3>
            <p>{t('home_featured.weight_desc')}</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>{t('home_cta.title')}</h2>
        <p>{t('home_cta.subtitle')}</p>
        <Link to="/contact" className="cta-button">{t('home_cta.cta')}</Link>
      </section>
    </div>
  );
};

export default Home;
