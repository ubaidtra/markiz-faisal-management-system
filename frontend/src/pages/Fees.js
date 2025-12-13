import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import API_URL from '../utils/api';
import { formatCurrency } from '../utils/currency';
import './Fees.css';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    feeType: 'tuition',
    amount: '',
    period: '',
    dueDate: '',
    paymentMethod: '',
    notes: ''
  });

  useEffect(() => {
    fetchFees();
    fetchStudents();
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    if (!formData.period) {
      setFormData(prev => ({ ...prev, period: currentMonth }));
    }
  }, []);

  const fetchFees = async () => {
    try {
      const response = await axios.get(`${API_URL}/fees`);
      setFees(response.data);
    } catch (error) {
      console.error('Error fetching fees:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFee) {
        await axios.put(`${API_URL}/fees/${editingFee._id}`, {
          ...formData,
          amount: parseFloat(formData.amount),
          paidAmount: parseFloat(formData.paidAmount || 0)
        });
      } else {
        await axios.post(`${API_URL}/fees`, {
          ...formData,
          amount: parseFloat(formData.amount)
        });
      }
      fetchFees();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving fee');
    }
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setFormData({
      student: fee.student._id || fee.student,
      feeType: fee.feeType,
      amount: fee.amount.toString(),
      period: fee.period || '',
      dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '',
      paidAmount: fee.paidAmount?.toString() || '',
      paymentMethod: fee.paymentMethod || '',
      notes: fee.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      try {
        await axios.delete(`${API_URL}/fees/${id}`);
        fetchFees();
      } catch (error) {
        alert('Error deleting fee record');
      }
    }
  };

  const resetForm = () => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    setFormData({
      student: '',
      feeType: 'tuition',
      amount: '',
      period: currentMonth,
      dueDate: '',
      paymentMethod: '',
      notes: ''
    });
    setEditingFee(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="fees-page">
        <div className="page-header">
          <h1>Fee Management</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Fee</button>
        </div>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingFee ? 'Edit Fee' : 'Add Fee'}</h2>
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
                    <label>Fee Type *</label>
                    <select
                      value={formData.feeType}
                      onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                      required
                    >
                      <option value="tuition">Monthly Tuition</option>
                      <option value="registration">Registration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {formData.feeType === 'tuition' && (
                    <div className="form-group">
                      <label>Month *</label>
                      <input
                        type="month"
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        required
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Amount (GMD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder={formData.feeType === 'tuition' ? 'Monthly tuition amount' : 'Enter amount in GMD'}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Due Date *</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                  {editingFee && (
                    <div className="form-group">
                      <label>Paid Amount (GMD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.paidAmount}
                        onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                        placeholder="Enter amount in GMD"
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    >
                      <option value="">Select Method</option>
                      <option value="cash">Cash</option>
                      <option value="bank-transfer">Bank Transfer</option>
                      <option value="mobile-money">Mobile Money</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
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
          <div className="loading">Loading fees...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Fee Type</th>
                  <th>Period</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(fee => (
                  <tr key={fee._id}>
                    <td>
                      {fee.student?.firstName} {fee.student?.lastName}
                      <br />
                      <small>{fee.student?.studentId}</small>
                    </td>
                    <td>{fee.feeType === 'tuition' ? 'Monthly Tuition' : fee.feeType}</td>
                    <td>{fee.period ? new Date(fee.period + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '-'}</td>
                    <td>{formatCurrency(fee.amount)}</td>
                    <td>{formatCurrency(fee.paidAmount || 0)}</td>
                    <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${fee.status}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(fee)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(fee._id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fees.length === 0 && (
              <div className="empty-state">No fee records found</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Fees;

