import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import API_URL from '../utils/api';
import './Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    phone: '',
    email: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    class: '',
    status: 'active'
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/students`, {
        params: { search: searchTerm }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        const { studentId, ...updateData } = formData;
        await axios.put(`${API_URL}/students/${editingStudent._id}`, updateData);
      } else {
        const { studentId, ...createData } = formData;
        await axios.post(`${API_URL}/students`, createData);
      }
      fetchStudents();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      gender: student.gender,
      address: student.address || '',
      phone: student.phone || '',
      email: student.email || '',
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail || '',
      class: student.class || '',
      status: student.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API_URL}/students/${id}`);
        fetchStudents();
      } catch (error) {
        alert('Error deleting student');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      address: '',
      phone: '',
      email: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      class: '',
      status: 'active'
    });
    setEditingStudent(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="students-page">
        <div className="page-header">
          <h1>Students</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Student</button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
              <form onSubmit={handleSubmit}>
                {editingStudent && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Student ID</label>
                      <input
                        type="text"
                        value={formData.studentId}
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
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      required
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
                    <label>Class</label>
                    <input
                      type="text"
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="graduated">Graduated</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
                <h3>Parent Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Parent Name *</label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Parent Phone *</label>
                    <input
                      type="text"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Parent Email</label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
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
          <div className="loading">Loading students...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Parent</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.studentId}</td>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.class || '-'}</td>
                    <td>{student.parentName}</td>
                    <td>{student.parentPhone}</td>
                    <td>
                      <span className={`status-badge status-${student.status}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(student)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(student._id)} className="btn-delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && (
              <div className="empty-state">No students found</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Students;

