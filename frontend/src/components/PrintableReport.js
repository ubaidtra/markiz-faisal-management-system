import React, { useEffect, useRef } from 'react';
import { formatCurrencyShort } from '../utils/currency';
import './PrintableReport.css';

const PrintableReport = ({ 
  dashboardStats, 
  feeReport, 
  withdrawalReport, 
  attendanceReport, 
  quranReport,
  dateRange,
  onClose 
}) => {
  const reportRef = useRef(null);

  useEffect(() => {
    if (reportRef.current) {
      window.print();
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'All Time';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateRange = () => {
    if (!dateRange.startDate && !dateRange.endDate) {
      return 'All Time';
    }
    if (dateRange.startDate && dateRange.endDate) {
      return `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`;
    }
    if (dateRange.startDate) {
      return `From ${formatDate(dateRange.startDate)}`;
    }
    if (dateRange.endDate) {
      return `Until ${formatDate(dateRange.endDate)}`;
    }
    return 'All Time';
  };

  return (
    <div className="printable-report-overlay" onClick={onClose}>
      <div className="printable-report-container" ref={reportRef} onClick={(e) => e.stopPropagation()}>
        <div className="printable-report-header">
          <div className="report-logo">
            <img src="/logo.jpg" alt="Logo" className="logo-img" />
          </div>
          <div className="report-title">
            <h1>Faisal Center</h1>
            <h2>Comprehensive Reports</h2>
            <p className="report-date-range">Period: {formatDateRange()}</p>
            <p className="report-generated-date">
              Generated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="printable-report-content">
          {/* Dashboard Overview */}
          {dashboardStats && (
            <section className="report-section">
              <h3>Dashboard Overview</h3>
              <div className="report-table">
                <div className="report-row">
                  <div className="report-cell report-label">Total Students</div>
                  <div className="report-cell report-value">{dashboardStats.totalStudents || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Total Teachers</div>
                  <div className="report-cell report-value">{dashboardStats.totalTeachers || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Today's Attendance</div>
                  <div className="report-cell report-value">{dashboardStats.todayAttendance || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Total Fees</div>
                  <div className="report-cell report-value">{formatCurrencyShort(dashboardStats.totalFees || 0)}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Total Paid</div>
                  <div className="report-cell report-value">{formatCurrencyShort(dashboardStats.totalPaid || 0)}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Total Pending</div>
                  <div className="report-cell report-value">{formatCurrencyShort(dashboardStats.totalPending || 0)}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Total Withdrawals</div>
                  <div className="report-cell report-value">{formatCurrencyShort(dashboardStats.totalWithdrawals || 0)}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Net Balance</div>
                  <div className="report-cell report-value">{formatCurrencyShort(dashboardStats.netBalance || 0)}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Memorized</div>
                  <div className="report-cell report-value">{dashboardStats.totalMemorized || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">In Progress</div>
                  <div className="report-cell report-value">{dashboardStats.inProgress || 0}</div>
                </div>
              </div>
            </section>
          )}

          {/* Fee Report */}
          {feeReport && (
            <section className="report-section">
              <h3>Fee Report</h3>
              <div className="report-table">
                <div className="report-row">
                  <div className="report-cell report-label">Total Amount</div>
                  <div className="report-cell report-value">{formatCurrencyShort(feeReport.totalAmount || 0)}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Total Paid</div>
                  <div className="report-cell report-value">{formatCurrencyShort(feeReport.totalPaid || 0)}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Total Pending</div>
                  <div className="report-cell report-value">{formatCurrencyShort(feeReport.totalPending || 0)}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Total Overdue</div>
                  <div className="report-cell report-value">{formatCurrencyShort(feeReport.totalOverdue || 0)}</div>
                </div>
                {feeReport.feesByType && Object.keys(feeReport.feesByType).length > 0 && (
                  <>
                    <div className="report-row report-subheader">
                      <div className="report-cell">Fee Type Breakdown</div>
                    </div>
                    {Object.entries(feeReport.feesByType).map(([type, amount]) => (
                      <div key={type} className="report-row report-indent">
                        <div className="report-cell report-label">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                        <div className="report-cell report-value">{formatCurrencyShort(amount)}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </section>
          )}

          {/* Withdrawals Report */}
          {withdrawalReport && (
            <section className="report-section">
              <h3>Withdrawals Report</h3>
              <div className="report-table">
                <div className="report-row">
                  <div className="report-cell report-label">Total Withdrawals</div>
                  <div className="report-cell report-value">{formatCurrencyShort(withdrawalReport.total || 0)}</div>
                </div>
                {withdrawalReport.byCategory && Object.keys(withdrawalReport.byCategory).length > 0 && (
                  <>
                    <div className="report-row report-subheader">
                      <div className="report-cell">Category Breakdown</div>
                    </div>
                    {Object.entries(withdrawalReport.byCategory).map(([category, amount]) => (
                      <div key={category} className="report-row report-indent">
                        <div className="report-cell report-label">{category.charAt(0).toUpperCase() + category.slice(1)}</div>
                        <div className="report-cell report-value">{formatCurrencyShort(amount)}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </section>
          )}

          {/* Attendance Report */}
          {attendanceReport && (
            <section className="report-section">
              <h3>Attendance Report</h3>
              <div className="report-table">
                <div className="report-row">
                  <div className="report-cell report-label">Total Records</div>
                  <div className="report-cell report-value">{attendanceReport.totalRecords || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Present</div>
                  <div className="report-cell report-value">{attendanceReport.present || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Absent</div>
                  <div className="report-cell report-value">{attendanceReport.absent || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Late</div>
                  <div className="report-cell report-value">{attendanceReport.late || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Excused</div>
                  <div className="report-cell report-value">{attendanceReport.excused || 0}</div>
                </div>
              </div>
            </section>
          )}

          {/* Quran Progress Report */}
          {quranReport && (
            <section className="report-section">
              <h3>Quran Progress Report</h3>
              <div className="report-table">
                <div className="report-row">
                  <div className="report-cell report-label">Total Records</div>
                  <div className="report-cell report-value">{quranReport.totalRecords || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Memorized</div>
                  <div className="report-cell report-value">{quranReport.memorized || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">In Progress</div>
                  <div className="report-cell report-value">{quranReport.inProgress || 0}</div>
                </div>
                <div className="report-row">
                  <div className="report-cell report-label">Under Review</div>
                  <div className="report-cell report-value">{quranReport.underReview || 0}</div>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="printable-report-footer">
          <p>This is a computer-generated report from Faisal Center Management System.</p>
        </div>

        <div className="printable-report-actions">
          <button onClick={() => window.print()} className="btn-primary">Print</button>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;

