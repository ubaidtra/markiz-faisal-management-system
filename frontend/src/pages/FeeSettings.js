import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import API_URL from '../utils/api';
import { formatCurrency } from '../utils/currency';
import { AuthContext } from '../context/AuthContext';
import './FeeSettings.css';

const FeeSettings = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    tuitionFee: '',
    registrationFee: '',
    otherFee: ''
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/fee-settings`);
      setFormData({
        tuitionFee: response.data.tuitionFee.toString(),
        registrationFee: response.data.registrationFee.toString(),
        otherFee: response.data.otherFee.toString()
      });
    } catch (error) {
      console.error('Error fetching fee settings:', error);
      alert('Error loading fee settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(`${API_URL}/fee-settings`, {
        tuitionFee: parseFloat(formData.tuitionFee) || 0,
        registrationFee: parseFloat(formData.registrationFee) || 0,
        otherFee: parseFloat(formData.otherFee) || 0
      });
      alert('Fee settings updated successfully');
      fetchSettings();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating fee settings');
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="fee-settings-page">
          <div className="error-message">Access denied. Admin only.</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fee-settings-page">
        <div className="page-header">
          <h1>School Fee Settings</h1>
          <p className="page-description">Set default fee amounts for tuition, registration, and other fees</p>
        </div>

        {loading ? (
          <div className="loading">Loading settings...</div>
        ) : (
          <div className="settings-form-container">
            <form onSubmit={handleSubmit} className="settings-form">
              <div className="form-section">
                <h2>Default Fee Amounts</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Tuition Fee (GMD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.tuitionFee}
                      onChange={(e) => setFormData({ ...formData, tuitionFee: e.target.value })}
                      placeholder="Enter monthly tuition fee"
                      required
                    />
                    {formData.tuitionFee && (
                      <span className="form-hint">Current: {formatCurrency(parseFloat(formData.tuitionFee) || 0)}</span>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Registration Fee (GMD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.registrationFee}
                      onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                      placeholder="Enter registration fee"
                      required
                    />
                    {formData.registrationFee && (
                      <span className="form-hint">Current: {formatCurrency(parseFloat(formData.registrationFee) || 0)}</span>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Other Fee (GMD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.otherFee}
                      onChange={(e) => setFormData({ ...formData, otherFee: e.target.value })}
                      placeholder="Enter default other fee"
                      required
                    />
                    {formData.otherFee && (
                      <span className="form-hint">Current: {formatCurrency(parseFloat(formData.otherFee) || 0)}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
                <button type="button" onClick={fetchSettings} className="btn-secondary" disabled={saving}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FeeSettings;
