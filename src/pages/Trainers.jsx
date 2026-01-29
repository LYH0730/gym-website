import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './Trainers.css';

const Trainers = () => {
  const { t } = useTranslation();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

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

  useEffect(() => {
    fetchTrainers();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAddEditTrainer = async (trainerData, file) => {
    setLoading(true);
    setError(null);

    try {
      let imageUrl = trainerData.image_url;

      // If a new file is selected, upload it
      if (file) {
        const filePath = `public/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('trainer-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the public URL of the uploaded file
        const { data: urlData } = supabase.storage
          .from('trainer-images')
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }

      const finalTrainerData = { ...trainerData, image_url: imageUrl };

      // Insert or update the trainers table
      let result;
      if (editingTrainer) {
        result = await supabase.from('trainers').update(finalTrainerData).eq('id', editingTrainer.id);
      } else {
        result = await supabase.from('trainers').insert([finalTrainerData]);
      }

      if (result.error) throw result.error;

      setShowForm(false);
      setEditingTrainer(null);
      fetchTrainers(); // Refresh the list

    } catch (error) {
      setError(error.message);
      console.error('Error during trainer save/upload:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrainer = async (trainerId) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      setLoading(true);
      const { error } = await supabase.from('trainers').delete().eq('id', trainerId);
      if (error) setError(error.message);
      else fetchTrainers();
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingTrainer(null);
    setShowForm(true);
  };

  const openEditForm = (trainer) => {
    setEditingTrainer(trainer);
    setShowForm(true);
  };

  if (loading && !showForm) return <div className="trainers-page"><section className="page-header"><h1>{t('trainers_page.header_title')}</h1><p>Loading trainers...</p></section></div>;
  if (error) return <div className="trainers-page"><section className="page-header"><h1>{t('trainers_page.header_title')}</h1><p>Error: {error}</p></section></div>;

  return (
    <div className="trainers-page">
      <section className="page-header">
        <h1>{t('trainers_page.header_title')}</h1>
        <p>{t('trainers_page.header_subtitle')}</p>
      </section>

      <div className="trainers-container">
        {session && (
          <div className="admin-controls">
            <button onClick={openAddForm}>Add New Trainer</button>
          </div>
        )}
        <div className="trainers-grid">
          {trainers.map((trainer) => (
            <div className="trainer-card" key={trainer.id}>
              <img src={trainer.image_url || 'https://via.placeholder.com/300'} alt={`Portrait of ${trainer.name}`} />
              <h3>{trainer.name}</h3>
              <p className="specialty">{trainer.specialty}</p>
              <p className="bio">{trainer.bio}</p>
              {session && (
                <div className="card-admin-actions">
                  <button onClick={(e) => { e.stopPropagation(); openEditForm(trainer); }} className="edit-button small">Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteTrainer(trainer.id); }} className="delete-button small">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <TrainerForm
          trainer={editingTrainer}
          onSave={handleAddEditTrainer}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

// TrainerForm Component
const TrainerForm = ({ trainer, onSave, onCancel }) => {
  const [name, setName] = useState(trainer?.name || '');
  const [specialty, setSpecialty] = useState(trainer?.specialty || '');
  const [bio, setBio] = useState(trainer?.bio || '');
  const [imageUrl, setImageUrl] = useState(trainer?.image_url || '');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, specialty, bio, image_url: imageUrl }, selectedFile);
  };

  return (
    <div className="schedule-form-modal"> {/* Reusing modal style */}
      <div className="schedule-form-content">
        <h2>{trainer ? 'Edit Trainer' : 'Add New Trainer'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Specialty</label>
            <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="4"></textarea>
          </div>
          <div className="form-group">
            <label>Image</label>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {imageUrl && !selectedFile && <img src={imageUrl} alt="Current" style={{ maxWidth: '100px', marginTop: '10px' }} />}
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">Save</button>
            <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Trainers;