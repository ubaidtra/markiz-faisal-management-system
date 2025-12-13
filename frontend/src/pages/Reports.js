import React, { useState, useEffect, useCallback, useContext } from 'react';
import Layout from '../components/Layout';
import PrintableReport from '../components/PrintableReport';
import axios from 'axios';
import API_URL from '../utils/api';
import { formatCurrencyShort } from '../utils/currency';
import { AuthContext } from '../context/AuthContext';
import './Reports.css';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [feeReport, setFeeReport] = useState(null);
  const [withdrawalReport, setWithdrawalReport] = useState(null);
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [quranReport, setQuranReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrintView, setShowPrintView] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [appliedDateRange, setAppliedDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [dateError, setDateError] = useState('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (appliedDateRange.startDate) params.startDate = appliedDateRange.startDate;
      if (appliedDateRange.endDate) params.endDate = appliedDateRange.endDate;

      const [dashboard, fees, withdrawals, attendance, quran] = await Promise.all([
        axios.get(`${API_URL}/reports/dashboard`),
        axios.get(`${API_URL}/reports/fees`, { params }),
        axios.get(`${API_URL}/reports/withdrawals`, { params }),
        axios.get(`${API_URL}/reports/attendance`, { params }),
        axios.get(`${API_URL}/reports/quran-progress`)
      ]);
      setDashboardStats(dashboard.data);
      setFeeReport(fees.data);
      setWithdrawalReport(withdrawals.data);
      setAttendanceReport(attendance.data);
      setQuranReport(quran.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }, [appliedDateRange]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newDateRange = {
      ...dateRange,
      [name]: value
    };
    setDateRange(newDateRange);
    setDateError('');

    // Validate date range
    if (newDateRange.startDate && newDateRange.endDate) {
      if (new Date(newDateRange.startDate) > new Date(newDateRange.endDate)) {
        setDateError('End date must be after start date');
      }
    }
  };

  const applyDateFilter = () => {
    if (dateError) {
      return;
    }
    setAppliedDateRange({ ...dateRange });
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
    setAppliedDateRange({ startDate: '', endDate: '' });
    setDateError('');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading reports...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="reports-page">
        <div className="page-header">
          <h1>Reports & Analytics</h1>
          <div className="reports-header-actions">
            <div className="date-filter-container">
              <div className="date-filter">
                <div className="date-input-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                    max={dateRange.endDate || undefined}
                  />
                </div>
                <div className="date-input-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                    min={dateRange.startDate || undefined}
                  />
                </div>
                <div className="date-filter-buttons">
                  <button 
                    onClick={applyDateFilter} 
                    className="btn-primary"
                    disabled={!!dateError}
                  >
                    Apply Filter
                  </button>
                  {(appliedDateRange.startDate || appliedDateRange.endDate) && (
                    <button onClick={clearDateFilter} className="btn-secondary">
                      Clear
                    </button>
                  )}
                </div>
              </div>
              {dateError && (
                <div className="date-error">{dateError}</div>
              )}
              {(appliedDateRange.startDate || appliedDateRange.endDate) && (
                <div className="date-filter-info">
                  Filtered: {appliedDateRange.startDate || 'All'} to {appliedDateRange.endDate || 'All'}
                </div>
              )}
            </div>
            {user?.role === 'admin' && (
              <button onClick={() => setShowPrintView(true)} className="btn-print">
                Print Reports
              </button>
            )}
          </div>
        </div>

        <div className="reports-grid">
          <div className="report-card">
            <h2>Dashboard Overview</h2>
            <div className="report-stats">
              <div className="stat-item">
                <span className="stat-label">Total Students</span>
                <span className="stat-value">{dashboardStats?.totalStudents || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Teachers</span>
                <span className="stat-value">{dashboardStats?.totalTeachers || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Today's Attendance</span>
                <span className="stat-value">{dashboardStats?.todayAttendance || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Memorized</span>
                <span className="stat-value">{dashboardStats?.totalMemorized || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">In Progress</span>
                <span className="stat-value">{dashboardStats?.inProgress || 0}</span>
              </div>
            </div>
          </div>

          <div className="report-card">
            <h2>Fee Report</h2>
            {feeReport && (
              <div className="report-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Amount</span>
                  <span className="stat-value">{formatCurrencyShort(feeReport.totalAmount || 0)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Paid</span>
                  <span className="stat-value">{formatCurrencyShort(feeReport.totalPaid || 0)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Pending</span>
                  <span className="stat-value">{formatCurrencyShort(feeReport.totalPending || 0)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Overdue</span>
                  <span className="stat-value">{formatCurrencyShort(feeReport.totalOverdue || 0)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="report-card">
            <h2>Withdrawals Report</h2>
            {withdrawalReport && (
              <div className="report-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Withdrawals</span>
                  <span className="stat-value">{formatCurrencyShort(withdrawalReport.total || 0)}</span>
                </div>
                {withdrawalReport.byCategory && Object.entries(withdrawalReport.byCategory).map(([category, amount]) => (
                  <div key={category} className="stat-item">
                    <span className="stat-label">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    <span className="stat-value">{formatCurrencyShort(amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="report-card">
            <h2>Attendance Report</h2>
            {attendanceReport && (
              <div className="report-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Records</span>
                  <span className="stat-value">{attendanceReport.totalRecords || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Present</span>
                  <span className="stat-value">{attendanceReport.present || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Absent</span>
                  <span className="stat-value">{attendanceReport.absent || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Late</span>
                  <span className="stat-value">{attendanceReport.late || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Excused</span>
                  <span className="stat-value">{attendanceReport.excused || 0}</span>
                </div>
              </div>
            )}
          </div>

          <div className="report-card">
            <h2>Quran Progress Report</h2>
            {quranReport && (
              <div className="report-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Records</span>
                  <span className="stat-value">{quranReport.totalRecords || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Memorized</span>
                  <span className="stat-value">{quranReport.memorized || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-value">{quranReport.inProgress || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Under Review</span>
                  <span className="stat-value">{quranReport.underReview || 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {showPrintView && (
          <PrintableReport
            dashboardStats={dashboardStats}
            feeReport={feeReport}
            withdrawalReport={withdrawalReport}
            attendanceReport={attendanceReport}
            quranReport={quranReport}
            dateRange={appliedDateRange}
            onClose={() => setShowPrintView(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Reports;

