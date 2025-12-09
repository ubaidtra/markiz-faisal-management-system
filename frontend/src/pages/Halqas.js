import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import './Halqas.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7000/api';

const Halqas = () => {
  const [halqas, setHalqas] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingHalqa, setEditingHalqa] = useState(null);
  const [selectedHalqa, setSelectedHalqa] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher: '',
    students: [],
    schedule: {
      days: [],
      startTime: '',
      endTime: ''
    },
    location: '',
    maxStudents: 30,
    status: 'active'
  });

  useEffect(() => {
    fetchHalqas();
    fetchTeachers();
    fetchStudents();
  }, []);

  const fetchHalqas = async () => {
    try {
      const response = await axios.get(`${API_URL}/halqas`, {
        params: { search: searchTerm }
      });
      setHalqas(response.data);
    } catch (error) {
      console.error('Error fetching halqas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalqas();
  }, [searchTerm]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_URL}/teachers`);
      setTeachers(response.data.filter(t => t.status === 'active'));
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data.filter(s => s.status === 'active'));
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHalqa) {
        await axios.put(`${API_URL}/halqas/${editingHalqa._id}`, formData);
      } else {
        await axios.post(`${API_URL}/halqas`, formData);
      }
      fetchHalqas();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving halqa');
    }
  };

  const handleEdit = (halqa) => {
    setEditingHalqa(halqa);
    setFormData({
      name: halqa.name,
      description: halqa.description || '',
      teacher: halqa.teacher._id || halqa.teacher,
      students: halqa.students.map(s => s._id || s),
      schedule: halqa.schedule || { days: [], startTime: '', endTime: '' },
      location: halqa.location || '',
      maxStudents: halqa.maxStudents || 30,
      status: halqa.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this halqa?')) {
      try {
        await axios.delete(`${API_URL}/halqas/${id}`);
        fetchHalqas();
      } catch (error) {
        alert('Error deleting halqa');
      }
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/halqas/${id}`);
      setSelectedHalqa(response.data);
    } catch (error) {
      console.error('Error fetching halqa details:', error);
    }
  };

  const handleAddStudents = async (halqaId, studentIds) => {
    try {
      await axios.post(`${API_URL}/halqas/${halqaId}/students`, { studentIds });
      fetchHalqas();
      if (selectedHalqa && selectedHalqa._id === halqaId) {
        handleViewDetails(halqaId);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding students');
    }
  };

  const handleRemoveStudent = async (halqaId, studentId) => {
    try {
      await axios.delete(`${API_URL}/halqas/${halqaId}/students/${studentId}`);
      fetchHalqas();
      if (selectedHalqa && selectedHalqa._id === halqaId) {
        handleViewDetails(halqaId);
      }
    } catch (error) {
      alert('Error removing student');
    }
  };

  const toggleDay = (day) => {
    const days = formData.schedule.days.includes(day)
      ? formData.schedule.days.filter(d => d !== day)
      : [...formData.schedule.days, day];
    setFormData({
      ...formData,
      schedule: { ...formData.schedule, days }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      teacher: '',
      students: [],
      schedule: {
        days: [],
        startTime: '',
        endTime: ''
      },
      location: '',
      maxStudents: 30,
      status: 'active'
    });
    setEditingHalqa(null);
    setShowForm(false);
    setSelectedHalqa(null);
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Layout>
      <div className="halqas-page">
        <div className="page-header">
          <h1>Halqas Management</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">Create Halqa</button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search halqas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showForm && (
          <div className="modal">
            <div className="modal-content large">
              <h2>{editingHalqa ? 'Edit Halqa' : 'Create Halqa'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Halqa Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
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
                    <label>Max Students</label>
                    <input
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <h3>Schedule</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Days</label>
                    <div className="days-selector">
                      {daysOfWeek.map(day => (
                        <label key={day} className="day-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.schedule.days.includes(day)}
                            onChange={() => toggleDay(day)}
                          />
                          <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      value={formData.schedule.startTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: { ...formData.schedule, startTime: e.target.value }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Time</label>
                    <input
                      type="time"
                      value={formData.schedule.endTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        schedule: { ...formData.schedule, endTime: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <h3>Assign Students</h3>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Select Students</label>
                    <select
                      multiple
                      size="8"
                      value={formData.students}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setFormData({ ...formData, students: selected });
                      }}
                      className="multi-select"
                    >
                      {students.map(s => (
                        <option key={s._id} value={s._id}>
                          {s.firstName} {s.lastName} ({s.studentId}) - {s.class || 'No Class'}
                        </option>
                      ))}
                    </select>
                    <small>Hold Ctrl/Cmd to select multiple students</small>
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

        {selectedHalqa && (
          <div className="modal">
            <div className="modal-content large">
              <h2>Halqa Details: {selectedHalqa.name}</h2>
              <div className="halqa-details">
                <div className="detail-section">
                  <h3>Information</h3>
                  <p><strong>Teacher:</strong> {selectedHalqa.teacher?.firstName} {selectedHalqa.teacher?.lastName}</p>
                  <p><strong>Location:</strong> {selectedHalqa.location || 'Not specified'}</p>
                  <p><strong>Status:</strong> <span className={`status-badge status-${selectedHalqa.status}`}>{selectedHalqa.status}</span></p>
                  <p><strong>Students:</strong> {selectedHalqa.students?.length || 0} / {selectedHalqa.maxStudents}</p>
                  {selectedHalqa.schedule?.days?.length > 0 && (
                    <p><strong>Schedule:</strong> {selectedHalqa.schedule.days.join(', ')} 
                      {selectedHalqa.schedule.startTime && ` from ${selectedHalqa.schedule.startTime} to ${selectedHalqa.schedule.endTime}`}
                    </p>
                  )}
                </div>
                <div className="detail-section">
                  <h3>Students ({selectedHalqa.students?.length || 0})</h3>
                  <div className="students-list">
                    {selectedHalqa.students?.map(student => (
                      <div key={student._id} className="student-item">
                        <span>{student.firstName} {student.lastName} ({student.studentId})</span>
                        <button 
                          onClick={() => handleRemoveStudent(selectedHalqa._id, student._id)}
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {(!selectedHalqa.students || selectedHalqa.students.length === 0) && (
                      <p className="empty-state">No students assigned</p>
                    )}
                  </div>
                  {selectedHalqa.students?.length < selectedHalqa.maxStudents && (
                    <div className="add-students-section">
                      <h4>Add Students</h4>
                      <select
                        multiple
                        size="5"
                        id="add-students-select"
                        className="multi-select"
                      >
                        {students
                          .filter(s => !selectedHalqa.students?.some(ss => ss._id === s._id))
                          .map(s => (
                            <option key={s._id} value={s._id}>
                              {s.firstName} {s.lastName} ({s.studentId})
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={() => {
                          const select = document.getElementById('add-students-select');
                          const selected = Array.from(select.selectedOptions, option => option.value);
                          if (selected.length > 0) {
                            handleAddStudents(selectedHalqa._id, selected);
                            select.selectedIndex = -1;
                          }
                        }}
                        className="btn-primary"
                      >
                        Add Selected Students
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-actions">
                <button onClick={() => setSelectedHalqa(null)} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading halqas...</div>
        ) : (
          <div className="halqas-grid">
            {halqas.map(halqa => (
              <div key={halqa._id} className="halqa-card">
                <div className="halqa-card-header">
                  <h3>{halqa.name}</h3>
                  <span className={`status-badge status-${halqa.status}`}>
                    {halqa.status}
                  </span>
                </div>
                <div className="halqa-card-body">
                  <p><strong>Teacher:</strong> {halqa.teacher?.firstName} {halqa.teacher?.lastName}</p>
                  <p><strong>Students:</strong> {halqa.students?.length || 0} / {halqa.maxStudents}</p>
                  {halqa.location && <p><strong>Location:</strong> {halqa.location}</p>}
                  {halqa.schedule?.days?.length > 0 && (
                    <p><strong>Schedule:</strong> {halqa.schedule.days.join(', ')}</p>
                  )}
                </div>
                <div className="halqa-card-actions">
                  <button onClick={() => handleViewDetails(halqa._id)} className="btn-view">View Details</button>
                  <button onClick={() => handleEdit(halqa)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(halqa._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
            {halqas.length === 0 && (
              <div className="empty-state">No halqas found</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Halqas;

