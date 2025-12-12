import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import API_URL from '../utils/api';
import { formatCurrency } from '../utils/currency';
import './Withdrawals.css';

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWithdrawal, setEditingWithdrawal] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [formData, setFormData] = useState({
    amount: '',
    category: 'other',
    description: '',
    paymentMethod: 'cash',
    recipient: '',
    receiptNumber: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    fetchWithdrawals();
  }, [filters]);

  const fetchWithdrawals = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.search) params.search = filters.search;

      const response = await axios.get(`${API_URL}/withdrawals`, { params });
      setWithdrawals(response.data);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWithdrawal) {
        await axios.put(`${API_URL}/withdrawals/${editingWithdrawal._id}`, {
          ...formData,
          amount: parseFloat(formData.amount)
        });
      } else {
        await axios.post(`${API_URL}/withdrawals`, {
          ...formData,
          amount: parseFloat(formData.amount)
        });
      }
      fetchWithdrawals();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving withdrawal');
    }
  };

  const handleEdit = (withdrawal) => {
    setEditingWithdrawal(withdrawal);
    setFormData({
      amount: withdrawal.amount.toString(),
      category: withdrawal.category,
      description: withdrawal.description,
      paymentMethod: withdrawal.paymentMethod || 'cash',
      recipient: withdrawal.recipient || '',
      receiptNumber: withdrawal.receiptNumber || '',
      date: withdrawal.date ? new Date(withdrawal.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: withdrawal.status,
      notes: withdrawal.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this withdrawal?')) {
      try {
        await axios.delete(`${API_URL}/withdrawals/${id}`);
        fetchWithdrawals();
      } catch (error) {
        alert('Error deleting withdrawal');
      }
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Approve this withdrawal?')) {
      try {
        await axios.put(`${API_URL}/withdrawals/${id}`, { status: 'approved' });
        fetchWithdrawals();
      } catch (error) {
        alert('Error approving withdrawal');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Reject this withdrawal?')) {
      try {
        await axios.put(`${API_URL}/withdrawals/${id}`, { status: 'rejected' });
        fetchWithdrawals();
      } catch (error) {
        alert('Error rejecting withdrawal');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category: 'other',
      description: '',
      paymentMethod: 'cash',
      recipient: '',
      receiptNumber: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    });
    setEditingWithdrawal(null);
    setShowForm(false);
  };

  const categories = [
    { value: 'salary', label: 'Salary' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'transport', label: 'Transport' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Layout>
      <div className="withdrawals-page">
        <div className="page-header">
          <h1>Withdrawals</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add Withdrawal</button>
        </div>

        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
        </div>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingWithdrawal ? 'Edit Withdrawal' : 'Add Withdrawal'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount (GMD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Description *</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    >
                      <option value="cash">Cash</option>
                      <option value="bank-transfer">Bank Transfer</option>
                      <option value="mobile-money">Mobile Money</option>
                      <option value="cheque">Cheque</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Recipient</label>
                    <input
                      type="text"
                      value={formData.recipient}
                      onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Receipt Number</label>
                    <input
                      type="text"
                      value={formData.receiptNumber}
                      onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                    />
                  </div>
                </div>
                {editingWithdrawal && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                )}
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
          <div className="loading">Loading withdrawals...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Recipient</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map(withdrawal => (
                  <tr key={withdrawal._id}>
                    <td>{new Date(withdrawal.date).toLocaleDateString()}</td>
                    <td>{withdrawal.description}</td>
                    <td>
                      <span className={`category-badge category-${withdrawal.category}`}>
                        {categories.find(c => c.value === withdrawal.category)?.label || withdrawal.category}
                      </span>
                    </td>
                    <td className="amount-cell">{formatCurrency(withdrawal.amount)}</td>
                    <td>{withdrawal.recipient || '-'}</td>
                    <td>{withdrawal.paymentMethod || '-'}</td>
                    <td>
                      <span className={`status-badge status-${withdrawal.status}`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td>{withdrawal.createdBy?.name || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        {withdrawal.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(withdrawal._id)} className="btn-approve">Approve</button>
                            <button onClick={() => handleReject(withdrawal._id)} className="btn-reject">Reject</button>
                          </>
                        )}
                        <button onClick={() => handleEdit(withdrawal)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(withdrawal._id)} className="btn-delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {withdrawals.length === 0 && (
              <div className="empty-state">No withdrawals found</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Withdrawals;

