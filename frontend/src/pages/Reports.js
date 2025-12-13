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
  const [reportType, setReportType] = useState('all');
  const [dateError, setDateError] = useState('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (appliedDateRange.startDate) params.startDate = appliedDateRange.startDate;
      if (appliedDateRange.endDate) params.endDate = appliedDateRange.endDate;

      const requests = [];
      
      // Always fetch dashboard stats
      requests.push(axios.get(`${API_URL}/reports/dashboard`));
      
      // Fetch reports based on selected type
      if (reportType === 'all' || reportType === 'fees') {
        requests.push(axios.get(`${API_URL}/reports/fees`, { params }).then(r => ({ type: 'fees', data: r.data })).catch(() => ({ type: 'fees', data: null })));
      } else {
        requests.push(Promise.resolve({ type: 'fees', data: null }));
      }
      
      if (reportType === 'all' || reportType === 'withdrawals') {
        requests.push(axios.get(`${API_URL}/reports/withdrawals`, { params }).then(r => ({ type: 'withdrawals', data: r.data })).catch(() => ({ type: 'withdrawals', data: null })));
      } else {
        requests.push(Promise.resolve({ type: 'withdrawals', data: null }));
      }
      
      if (reportType === 'all' || reportType === 'attendance') {
        requests.push(axios.get(`${API_URL}/reports/attendance`, { params }).then(r => ({ type: 'attendance', data: r.data })).catch(() => ({ type: 'attendance', data: null })));
      } else {
        requests.push(Promise.resolve({ type: 'attendance', data: null }));
      }
      
      if (reportType === 'all' || reportType === 'quran') {
        requests.push(axios.get(`${API_URL}/reports/quran-progress`).then(r => ({ type: 'quran', data: r.data })).catch(() => ({ type: 'quran', data: null })));
      } else {
        requests.push(Promise.resolve({ type: 'quran', data: null }));
      }

      const [dashboard, feesResult, withdrawalsResult, attendanceResult, quranResult] = await Promise.all(requests);
      
      setDashboardStats(dashboard.data);
      setFeeReport(feesResult.data);
      setWithdrawalReport(withdrawalsResult.data);
      setAttendanceReport(attendanceResult.data);
      setQuranReport(quranResult.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }, [appliedDateRange, reportType]);

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
      const startDate = new Date(newDateRange.startDate);
      const endDate = new Date(newDateRange.endDate);
      
      if (startDate > endDate) {
        setDateError('End date must be after or equal to start date');
      } else {
        setDateError('');
      }
    } else {
      // Clear error if one date is cleared
      setDateError('');
    }
  };

  const applyDateFilter = () => {
    // Re-validate before applying
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      if (startDate > endDate) {
        setDateError('End date must be after or equal to start date');
        return;
      }
    }
    
    if (dateError) {
      return;
    }
    
    setAppliedDateRange({ ...dateRange });
    setDateError('');
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
    setAppliedDateRange({ startDate: '', endDate: '' });
    setDateError('');
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
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
                  <label htmlFor="reportType">Report Type</label>
                  <select
                    id="reportType"
                    value={reportType}
                    onChange={handleReportTypeChange}
                  >
                    <option value="all">All Reports</option>
                    <option value="fees">Fees/Payments</option>
                    <option value="withdrawals">Withdrawals</option>
                    <option value="attendance">Attendance</option>
                    <option value="quran">Quran Progress</option>
                  </select>
                </div>
                <div className="date-input-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={dateRange.startDate || ''}
                    onChange={handleDateChange}
                    max={dateRange.endDate || undefined}
                    className={dateError && dateRange.startDate && dateRange.endDate ? 'date-input-error' : ''}
                    placeholder="Select start date"
                  />
                </div>
                <div className="date-input-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={dateRange.endDate || ''}
                    onChange={handleDateChange}
                    min={dateRange.startDate || undefined}
                    className={dateError && dateRange.startDate && dateRange.endDate ? 'date-input-error' : ''}
                    placeholder="Select end date"
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
                  {(appliedDateRange.startDate || appliedDateRange.endDate || reportType !== 'all') && (
                    <button onClick={() => { clearDateFilter(); setReportType('all'); }} className="btn-secondary">
                      Clear
                    </button>
                  )}
                </div>
              </div>
              {dateError && (
                <div className="date-error">{dateError}</div>
              )}
              {(appliedDateRange.startDate || appliedDateRange.endDate || reportType !== 'all') && (
                <div className="date-filter-info">
                  {reportType !== 'all' && `Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`}
                  {(appliedDateRange.startDate || appliedDateRange.endDate) && (
                    <span>
                      {reportType !== 'all' && ' | '}
                      Filtered: {appliedDateRange.startDate || 'All'} to {appliedDateRange.endDate || 'All'}
                    </span>
                  )}
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
          {(reportType === 'all' || !reportType) && (
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
          )}

          {(reportType === 'all' || reportType === 'fees') && (
            <div className="report-card">
              <h2>Fee Report</h2>
              {feeReport ? (
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
              ) : (
                <div className="loading">Loading fee report...</div>
              )}
            </div>
          )}

          {(reportType === 'all' || reportType === 'withdrawals') && (
            <div className="report-card">
              <h2>Withdrawals Report</h2>
              {withdrawalReport ? (
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
              ) : (
                <div className="loading">Loading withdrawals report...</div>
              )}
            </div>
          )}

          {(reportType === 'all' || reportType === 'attendance') && (
            <div className="report-card">
              <h2>Attendance Report</h2>
              {attendanceReport ? (
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
              ) : (
                <div className="loading">Loading attendance report...</div>
              )}
            </div>
          )}

          {(reportType === 'all' || reportType === 'quran') && (
            <div className="report-card">
              <h2>Quran Progress Report</h2>
              {quranReport ? (
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
              ) : (
                <div className="loading">Loading Quran progress report...</div>
              )}
            </div>
          )}
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

