import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './Trainers.css'; // Reuse styles for the trainer cards
import './Schedule.css'; // For modal and other schedule-specific styles

const Schedule = () => {
  const { t } = useTranslation();

  // Global state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  // View-specific state
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerSchedule, setTrainerSchedule] = useState([]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const daysOfWeekKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Fetch all trainers
  const fetchTrainers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching trainers:', error);
      setError(error.message);
    } else {
      setTrainers(data);
    }
    setLoading(false);
  };

  // Fetch schedule for a specific trainer
  const fetchTrainerSchedule = async (trainerId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('trainer_id', trainerId);

    if (error) {
      console.error(`Error fetching schedule for trainer ${trainerId}:`, error);
      setError(error.message);
    } else {
      setTrainerSchedule(data);
    }
    setLoading(false);
  };

  // Initial data fetch and auth check
  useEffect(() => {
    fetchTrainers();

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Effect to run when a trainer is selected
  useEffect(() => {
    if (selectedTrainer) {
      fetchTrainerSchedule(selectedTrainer.id);
    } else {
      setTrainerSchedule([]);
    }
  }, [selectedTrainer]);

  const handleSelectTrainer = (trainer) => {
    setSelectedTrainer(trainer);
  };

  const handleBackToList = () => {
    setSelectedTrainer(null);
    fetchTrainers();
  };

  // Admin functions for schedule entries
  const handleAddEditSchedule = async (entry) => {
    setLoading(true);
    setError(null);
    const entryWithTrainer = { ...entry, trainer_id: selectedTrainer.id };

    if (editingEntry) {
      const { error } = await supabase.from('schedules').update(entryWithTrainer).eq('id', editingEntry.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('schedules').insert([entryWithTrainer]);
      if (error) setError(error.message);
    }
    setShowForm(false);
    setEditingEntry(null);
    fetchTrainerSchedule(selectedTrainer.id);
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm(t('admin_schedule.confirm_delete'))) {
      setLoading(true);
      const { error } = await supabase.from('schedules').delete().eq('id', id);
      if (error) setError(error.message);
      fetchTrainerSchedule(selectedTrainer.id);
    }
  };

  const openAddForm = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const openEditForm = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  // --- Data processing for timetable view ---
  const processedSchedule = {};
  trainerSchedule.forEach(item => {
    const dayKey = item.day.toLowerCase();
    if (!processedSchedule[dayKey]) {
      processedSchedule[dayKey] = [];
    }
    processedSchedule[dayKey].push(item);
  });

  const allTimes = new Set(trainerSchedule.map(item => item.time));
  const timeSlots = Array.from(allTimes).sort((a, b) => {
    const timeA = new Date(`2000/01/01 ${a}`);
    const timeB = new Date(`2000/01/01 ${b}`);
    return timeA - timeB;
  });
  const daysOfWeekDisplay = daysOfWeekKeys.map(dayKey => t(`schedule.day_${dayKey}`));
  // --- End of data processing ---


  // Main Render Logic
  if (loading && !showForm) return <div className="schedule-page"><section className="page-header"><h1>{t('nav.schedule')}</h1><p>Loading...</p></section></div>;
  if (error) return <div className="schedule-page"><section className="page-header"><h1>{t('nav.schedule')}</h1><p>Error: {error}</p></section></div>;

  return (
    <div className="schedule-page">
      <section className="page-header">
        <h1>{t('nav.schedule')}</h1>
        {!selectedTrainer ? (
          <p>{t('schedule.select_trainer')}</p>
        ) : (
          <div className="trainer-schedule-header">
            <img src={selectedTrainer.image_url || 'https://via.placeholder.com/150'} alt={selectedTrainer.name} className="trainer-header-image" />
            <div className="trainer-header-info">
              <h2>{selectedTrainer.name}</h2>
              <p>{t('schedule.schedule_for', { trainerName: selectedTrainer.name })}</p>
            </div>
          </div>
        )}
      </section>

      <div className="schedule-container">
        {!selectedTrainer ? (
          // 1. Trainer List View
          <div className="trainers-grid">
            {trainers.map((trainer) => (
              <div className="trainer-card" key={trainer.id} onClick={() => handleSelectTrainer(trainer)}>
                <img src={trainer.image_url || 'https://via.placeholder.com/300'} alt={`Portrait of ${trainer.name}`} />
                <h3>{trainer.name}</h3>
                <p className="specialty">{trainer.specialty}</p>
              </div>
            ))}
          </div>
        ) : (
          // 2. Trainer Schedule Timetable View
          <div>
            <button onClick={handleBackToList} className="back-button">← {t('schedule.back_to_list')}</button>
            {session && (
              <div className="admin-schedule-controls">
                <button onClick={openAddForm}>{t('admin_schedule.add_entry_button')}</button>
              </div>
            )}
            <table>
              <thead>
                <tr>
                  <th>{t('schedule.time_header')}</th>
                  {daysOfWeekDisplay.map(day => <th key={day}>{day}</th>)}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time}>
                    <td>{time}</td>
                    {daysOfWeekKeys.map(dayKey => {
                      const daySchedule = processedSchedule[dayKey] || [];
                      const classAtTime = daySchedule.find(item => item.time === time);
                      return (
                        <td key={`${dayKey}-${time}`}>
                          {classAtTime ? (
                            <div className="schedule-entry">
                              <strong>{classAtTime.class}</strong>
                              <span className="duration">{classAtTime.duration}</span>
                              {session && (
                                <div className="admin-actions">
                                  <button onClick={() => openEditForm(classAtTime)} className="edit-button small">{t('admin_schedule.edit_button')}</button>
                                  <button onClick={() => handleDeleteSchedule(classAtTime.id)} className="delete-button small">{t('admin_schedule.delete_button')}</button>
                                </div>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <ScheduleForm
          entry={editingEntry}
          onSave={handleAddEditSchedule}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};


// --- ScheduleForm Component ---
const ScheduleForm = ({ entry, onSave, onCancel }) => {
  const { t } = useTranslation();
  const daysOfWeekKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const [day, setDay] = useState(entry?.day || daysOfWeekKeys[0]);
  const [className, setClassName] = useState(entry?.class || '');
  const [duration, setDuration] = useState(entry?.duration || '');

  const parseTime = (timeStr) => {
    if (!timeStr) return { timeValue: '09:00', ampm: 'AM' };
    const parts = timeStr.split(' ');
    return { timeValue: parts[0] || '09:00', ampm: parts[1] || 'AM' };
  };
  const initialTime = parseTime(entry?.time);
  const [timeValue, setTimeValue] = useState(initialTime.timeValue);
  const [ampm, setAmPm] = useState(initialTime.ampm);

  const handleSubmit = (e) => {
    e.preventDefault();
    const time = `${timeValue} ${ampm}`;
    onSave({ day, time, class: className, duration });
  };

  const displayTimeOptions = ['12:00', '12:30'];
  for (let i = 1; i < 12; i++) {
    const hourStr = i.toString().padStart(2, '0');
    displayTimeOptions.push(`${hourStr}:00`);
    displayTimeOptions.push(`${hourStr}:30`);
  }

  return (
    <div className="schedule-form-modal">
      <div className="schedule-form-content">
        <h2>{entry ? t('admin_schedule.edit_entry_title') : t('admin_schedule.add_entry_title')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('admin_schedule.day_label')}</label>
            <select value={day} onChange={(e) => setDay(e.target.value)} required>
              {daysOfWeekKeys.map(dayKey => <option key={dayKey} value={dayKey}>{t(`schedule.day_${dayKey}`)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t('admin_schedule.time_label')}</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select value={timeValue} onChange={(e) => setTimeValue(e.target.value)} required style={{ flex: 2 }}>
                {displayTimeOptions.map(timeOpt => <option key={timeOpt} value={timeOpt}>{timeOpt}</option>)}
              </select>
              <select value={ampm} onChange={(e) => setAmPm(e.target.value)} required style={{ flex: 1 }}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>{t('admin_schedule.class_label')}</label>
            <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t('admin_schedule.duration_label')}</label>
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 60 min" />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">{t('admin_schedule.save_button')}</button>
            <button type="button" onClick={onCancel} className="cancel-button">{t('admin_schedule.cancel_button')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Schedule;