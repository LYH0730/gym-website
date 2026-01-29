import React from 'react';
import { useTranslation } from 'react-i18next';
import KakaoMap from '../components/KakaoMap'; // Import the map component
import './About.css';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <section className="page-header">
        <h1>{t('about_page.header_title')}</h1>
        <p>{t('about_page.header_subtitle')}</p>
      </section>

      <div className="about-container">
        <div className="about-content">
          <div className="about-text">
            <h2>{t('about_page.story_title')}</h2>
            <p>{t('about_page.story_p1')}</p>
            <p>{t('about_page.story_p2')}</p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop" alt="Modern gym interior" />
          </div>
        </div>

        <section className="location-section">
          <h2>{t('about_page.location_title')}</h2>
          <div className="map-info-card">
            <KakaoMap />
            <p className="gym-address">{t('about_page.address')}</p>
            <p className="gym-directions">{t('about_page.directions')}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
