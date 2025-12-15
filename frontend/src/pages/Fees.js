import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import Receipt from '../components/Receipt';
import axios from 'axios';
import API_URL from '../utils/api';
import { formatCurrency } from '../utils/currency';
import { AuthContext } from '../context/AuthContext';
import './Fees.css';

const Fees = () => {
  const { user } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [selectedFeeForReceipt, setSelectedFeeForReceipt] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    feeType: 'tuition',
    amount: '',
    selectedMonths: [],
    dueDate: '',
    paymentMethod: '',
    notes: ''
  });

  useEffect(() => {
    fetchFees();
    fetchStudents();
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
        const submitData = {
          ...formData,
          amount: parseFloat(formData.amount),
          period: formData.selectedMonths[0] || ''
        };
        if (formData.paymentMethod) {
          submitData.paidAmount = parseFloat(formData.amount);
        }
        delete submitData.selectedMonths;
        await axios.put(`${API_URL}/fees/${editingFee._id}`, {
          ...submitData,
          paidAmount: formData.paidAmount ? parseFloat(formData.paidAmount) : submitData.paidAmount
        });
        fetchFees();
        resetForm();
      } else {
        if (formData.feeType === 'tuition' && formData.selectedMonths.length === 0) {
          alert('Please select at least one month for tuition payment');
          return;
        }

        const monthsToProcess = formData.feeType === 'tuition' 
          ? formData.selectedMonths 
          : [formData.selectedMonths[0] || new Date().toISOString().slice(0, 7)];

        const baseData = {
          student: formData.student,
          feeType: formData.feeType,
          amount: parseFloat(formData.amount),
          dueDate: formData.dueDate,
          paymentMethod: formData.paymentMethod || '',
          notes: formData.notes || ''
        };

        if (formData.paymentMethod) {
          baseData.paidAmount = parseFloat(formData.amount);
        }

        if (monthsToProcess.length > 1) {
          const feesArray = monthsToProcess.map(month => ({
            ...baseData,
            period: month
          }));
          await axios.post(`${API_URL}/fees/bulk`, { fees: feesArray });
        } else {
          await axios.post(`${API_URL}/fees`, {
            ...baseData,
            period: monthsToProcess[0]
          });
        }

        fetchFees();
        resetForm();
        alert(`Successfully created ${monthsToProcess.length} fee record(s)`);
      }
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
      selectedMonths: fee.period ? [fee.period] : [],
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
    setFormData({
      student: '',
      feeType: 'tuition',
      amount: '',
      selectedMonths: [],
      dueDate: '',
      paymentMethod: '',
      notes: ''
    });
    setEditingFee(null);
    setShowForm(false);
  };

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    for (let i = -2; i <= 12; i++) {
      const date = new Date(currentYear, currentMonth + i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthValue = `${year}-${month}`;
      const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      options.push({ value: monthValue, label: monthLabel });
    }
    return options;
  };

  const toggleMonth = (monthValue) => {
    setFormData(prev => {
      const currentMonths = prev.selectedMonths || [];
      if (currentMonths.includes(monthValue)) {
        return { ...prev, selectedMonths: currentMonths.filter(m => m !== monthValue) };
      } else {
        return { ...prev, selectedMonths: [...currentMonths, monthValue] };
      }
    });
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
                  {formData.feeType === 'tuition' && !editingFee && (
                    <div className="form-group full-width">
                      <label>Select Months *</label>
                      <div className="month-selector">
                        {generateMonthOptions().map(option => (
                          <label key={option.value} className="month-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.selectedMonths.includes(option.value)}
                              onChange={() => toggleMonth(option.value)}
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                      {formData.selectedMonths.length > 0 && (
                        <div className="selected-months-summary">
                          Selected: {formData.selectedMonths.length} month(s)
                          {formData.amount && (
                            <span className="total-amount">
                              {' '}• Total: {formatCurrency(parseFloat(formData.amount) * formData.selectedMonths.length)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {formData.feeType === 'tuition' && editingFee && (
                    <div className="form-group">
                      <label>Month *</label>
                      <input
                        type="month"
                        value={formData.selectedMonths[0] || ''}
                        onChange={(e) => setFormData({ ...formData, selectedMonths: [e.target.value] })}
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
                      <div className="action-buttons">
                        {fee.status === 'paid' && user?.role === 'admin' && (
                          <button 
                            onClick={() => setSelectedFeeForReceipt(fee)} 
                            className="btn-print"
                            title="Print Receipt"
                          >
                            Print Receipt
                          </button>
                        )}
                        <button onClick={() => handleEdit(fee)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(fee._id)} className="btn-delete">Delete</button>
                      </div>
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

        {selectedFeeForReceipt && (
          <Receipt 
            fee={selectedFeeForReceipt} 
            onClose={() => setSelectedFeeForReceipt(null)} 
          />
        )}
      </div>
    </Layout>
  );
};

export default Fees;

