import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import './QuranProgress.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7000/api';

const QuranProgress = () => {
  const [progress, setProgress] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgress, setEditingProgress] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    teacher: '',
    surah: '',
    fromAyah: '',
    toAyah: '',
    status: 'in-progress',
    grade: '',
    notes: ''
  });

  useEffect(() => {
    fetchProgress();
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/quran-progress`);
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_URL}/teachers`);
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        fromAyah: parseInt(formData.fromAyah),
        toAyah: parseInt(formData.toAyah),
        memorizationDate: formData.status === 'memorized' ? new Date() : null
      };
      if (editingProgress) {
        await axios.put(`${API_URL}/quran-progress/${editingProgress._id}`, data);
      } else {
        await axios.post(`${API_URL}/quran-progress`, data);
      }
      fetchProgress();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving progress');
    }
  };

  const handleEdit = (item) => {
    setEditingProgress(item);
    setFormData({
      student: item.student._id || item.student,
      teacher: item.teacher._id || item.teacher,
      surah: item.surah,
      fromAyah: item.fromAyah.toString(),
      toAyah: item.toAyah.toString(),
      status: item.status,
      grade: item.grade || '',
      notes: item.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this progress record?')) {
      try {
        await axios.delete(`${API_URL}/quran-progress/${id}`);
        fetchProgress();
      } catch (error) {
        alert('Error deleting progress record');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student: '',
      teacher: '',
      surah: '',
      fromAyah: '',
      toAyah: '',
      status: 'in-progress',
      grade: '',
      notes: ''
    });
    setEditingProgress(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="quran-progress-page">
        <div className="page-header">
          <h1>Quran Progress</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Progress</button>
        </div>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingProgress ? 'Edit Progress' : 'Add Progress'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Student *</label>
                    <select
                      value={formData.student}
                      onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                      required
                    >
                      <option value="">Select Student</option>
                      {students.map(s => (
                        <option key={s._id} value={s._id}>
                          {s.firstName} {s.lastName} ({s.studentId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Teacher *</label>
                    <select
                      value={formData.teacher}
                      onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                      required
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(t => (
                        <option key={t._id} value={t._id}>
                          {t.firstName} {t.lastName} ({t.teacherId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Surah *</label>
                    <input
                      type="text"
                      value={formData.surah}
                      onChange={(e) => setFormData({ ...formData, surah: e.target.value })}
                      placeholder="e.g., Al-Fatiha"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>From Ayah *</label>
                    <input
                      type="number"
                      value={formData.fromAyah}
                      onChange={(e) => setFormData({ ...formData, fromAyah: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>To Ayah *</label>
                    <input
                      type="number"
                      value={formData.toAyah}
                      onChange={(e) => setFormData({ ...formData, toAyah: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                    >
                      <option value="in-progress">In Progress</option>
                      <option value="memorized">Memorized</option>
                      <option value="review">Review</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Grade</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    >
                      <option value="">Select Grade</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="satisfactory">Satisfactory</option>
                      <option value="needs-improvement">Needs Improvement</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows="3"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading progress...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Teacher</th>
                  <th>Surah</th>
                  <th>Ayahs</th>
                  <th>Status</th>
                  <th>Grade</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {progress.map(item => (
                  <tr key={item._id}>
                    <td>
                      {item.student?.firstName} {item.student?.lastName}
                      <br />
                      <small>{item.student?.studentId}</small>
                    </td>
                    <td>
                      {item.teacher?.firstName} {item.teacher?.lastName}
                    </td>
                    <td>{item.surah}</td>
                    <td>{item.fromAyah} - {item.toAyah}</td>
                    <td>
                      <span className={`status-badge status-${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.grade || '-'}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {progress.length === 0 && (
              <div className="empty-state">No progress records found</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuranProgress;

