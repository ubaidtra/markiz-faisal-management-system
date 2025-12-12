import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import API_URL from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './Notifications.css';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    recipientType: 'all'
  });

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/unread`);
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/notifications/read-all`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/notifications`, formData);
      fetchNotifications();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating notification');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      recipientType: 'all'
    });
    setShowForm(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading notifications...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="notifications-page">
        <div className="page-header">
          <h1>Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h1>
          <div>
            {user?.role === 'admin' && (
              <button onClick={() => setShowForm(true)} className="btn-primary">Create Notification</button>
            )}
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="btn-secondary">Mark All as Read</button>
            )}
          </div>
        </div>

        {showForm && user?.role === 'admin' && (
          <div className="modal">
            <div className="modal-content">
              <h2>Create Notification</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows="4"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Recipient</label>
                    <select
                      value={formData.recipientType}
                      onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                    >
                      <option value="all">All</option>
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="accountant">Accountant</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Send</button>
                  <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="notifications-list">
          {notifications.map(notification => (
            <div
              key={notification._id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''} type-${notification.type}`}
              onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
            >
              <div className="notification-header">
                <h3>{notification.title}</h3>
                {!notification.isRead && <span className="unread-dot"></span>}
              </div>
              <p>{notification.message}</p>
              <div className="notification-footer">
                <span className="notification-type">{notification.type}</span>
                <span className="notification-date">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="empty-state">No notifications found</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;

