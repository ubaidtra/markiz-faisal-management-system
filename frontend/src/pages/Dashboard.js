import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import API_URL from '../utils/api';
import { formatCurrencyShort } from '../utils/currency';
import { 
  FiUsers, FiUser, FiCheckCircle, FiBook, FiBookOpen,
  FiDollarSign, FiCreditCard, FiClock, FiTrendingDown, FiBriefcase
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/dashboard`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card stat-card-indigo">
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div className="stat-content">
              <h3>Total Students</h3>
              <p className="stat-value">{stats?.totalStudents || 0}</p>
            </div>
          </div>
          <div className="stat-card stat-card-purple">
            <div className="stat-icon">
              <FiUser />
            </div>
            <div className="stat-content">
              <h3>Total Teachers</h3>
              <p className="stat-value">{stats?.totalTeachers || 0}</p>
            </div>
          </div>
          <div className="stat-card stat-card-green">
            <div className="stat-icon">
              <FiCheckCircle />
            </div>
            <div className="stat-content">
              <h3>Today's Attendance</h3>
              <p className="stat-value">{stats?.todayAttendance || 0}</p>
            </div>
          </div>
          <div className="stat-card stat-card-teal">
            <div className="stat-icon">
              <FiBook />
            </div>
            <div className="stat-content">
              <h3>Memorized</h3>
              <p className="stat-value">{stats?.totalMemorized || 0}</p>
            </div>
          </div>
          <div className="stat-card stat-card-cyan">
            <div className="stat-icon">
              <FiBookOpen />
            </div>
            <div className="stat-content">
              <h3>In Progress</h3>
              <p className="stat-value">{stats?.inProgress || 0}</p>
            </div>
          </div>
          <div className="stat-card stat-card-amber">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <h3>Total Fees</h3>
              <p className="stat-value">{formatCurrencyShort(stats?.totalFees || 0)}</p>
            </div>
          </div>
          <div className="stat-card stat-card-success">
            <div className="stat-icon">
              <FiCreditCard />
            </div>
            <div className="stat-content">
              <h3>Paid</h3>
              <p className="stat-value">{formatCurrencyShort(stats?.totalPaid || 0)}</p>
            </div>
          </div>
          <div className="stat-card stat-card-warning">
            <div className="stat-icon">
              <FiClock />
            </div>
            <div className="stat-content">
              <h3>Pending</h3>
              <p className="stat-value">{formatCurrencyShort(stats?.totalPending || 0)}</p>
            </div>
          </div>
          <div className="stat-card stat-card-rose">
            <div className="stat-icon">
              <FiTrendingDown />
            </div>
            <div className="stat-content">
              <h3>Withdrawals</h3>
              <p className="stat-value">{formatCurrencyShort(stats?.totalWithdrawals || 0)}</p>
            </div>
          </div>
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">
              <FiBriefcase />
            </div>
            <div className="stat-content">
              <h3>Net Balance</h3>
              <p className="stat-value">{formatCurrencyShort(stats?.netBalance || 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

