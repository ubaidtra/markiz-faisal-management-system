import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import API_URL from '../utils/api';
import './Teachers.css';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    teacherId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    phone: '',
    email: '',
    qualification: '',
    specialization: '',
    salary: '',
    status: 'active'
  });

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/teachers`, {
        params: { search: searchTerm }
      });
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        const { teacherId, ...updateData } = formData;
        await axios.put(`${API_URL}/teachers/${editingTeacher._id}`, updateData);
      } else {
        const { teacherId, ...createData } = formData;
        await axios.post(`${API_URL}/teachers`, createData);
      }
      fetchTeachers();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving teacher');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      teacherId: teacher.teacherId,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      dateOfBirth: teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toISOString().split('T')[0] : '',
      gender: teacher.gender,
      address: teacher.address || '',
      phone: teacher.phone || '',
      email: teacher.email || '',
      qualification: teacher.qualification || '',
      specialization: teacher.specialization || '',
      salary: teacher.salary || '',
      status: teacher.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`${API_URL}/teachers/${id}`);
        fetchTeachers();
      } catch (error) {
        alert('Error deleting teacher');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      teacherId: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      phone: '',
      email: '',
      qualification: '',
      specialization: '',
      salary: '',
      status: 'active'
    });
    setEditingTeacher(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="teachers-page">
        <div className="page-header">
          <h1>Teachers</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Teacher</button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</h2>
              <form onSubmit={handleSubmit}>
                {editingTeacher && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Teacher ID</label>
                      <input
                        type="text"
                        value={formData.teacherId}
                        readOnly
                        style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                      />
                      <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>Auto-generated ID (read-only)</small>
                    </div>
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Salary</label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Qualification</label>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
          <div className="loading">Loading teachers...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Qualification</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(teacher => (
                  <tr key={teacher._id}>
                    <td>{teacher.teacherId}</td>
                    <td>{teacher.firstName} {teacher.lastName}</td>
                    <td>{teacher.phone}</td>
                    <td>{teacher.email || '-'}</td>
                    <td>{teacher.qualification || '-'}</td>
                    <td>
                      <span className={`status-badge status-${teacher.status}`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(teacher)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(teacher._id)} className="btn-delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {teachers.length === 0 && (
              <div className="empty-state">No teachers found</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Teachers;

