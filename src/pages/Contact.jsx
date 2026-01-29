import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        },
      )
      .then(
        () => {
          alert('Thank you for your message! We will get back to you soon.');
          form.current.reset();
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Failed to send the message. Please try again later.');
        },
      );
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <h1>{t('contact_page.header_title')}</h1>
        <p>{t('contact_page.header_subtitle')}</p>
      </section>

      <div className="contact-container">
        <div className="contact-info">
          <h2>{t('contact_page.info_title')}</h2>
          <p>{t('contact_page.info_subtitle')}</p>
          <ul>
            <li>
              <span className="icon">📞</span>
              <span>{t('contact_page.phone')}</span>
            </li>
            <li>
              <span className="icon">✉️</span>
              <span>{t('contact_page.email')}</span>
            </li>
            <li>
              <span className="icon">📍</span>
              <span>{t('contact_page.address')}</span>
            </li>
          </ul>
        </div>

        <div className="contact-form-container">
          <h2>{t('contact_page.form_title')}</h2>
          <form ref={form} className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('contact_page.form_name')}</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('contact_page.form_email')}</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">{t('contact_page.form_subject')}</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('contact_page.form_message')}</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit">{t('contact_page.form_cta')}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
