import React from 'react';
import { useTranslation } from 'react-i18next';
import './Programs.css';

const Programs = () => {
  const { t } = useTranslation();
  const programsData = t('programs_page.program_list', { returnObjects: true }) || [];

  return (
    <div className="programs-page">
      <section className="page-header">
        <h1>{t('programs_page.header_title')}</h1>
        <p>{t('programs_page.header_subtitle')}</p>
      </section>

      <div className="programs-container">
        <div className="programs-grid">
          {programsData.map((program, index) => (
            <div className="program-item" key={index}>
              <div 
                className="program-item-image" 
                style={{ backgroundImage: `url(${program.image})` }}
              ></div>
              <div className="program-item-content">
                <h3>{program.title}</h3>
                <p>{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Programs;
