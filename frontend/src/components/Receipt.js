import React, { useEffect, useRef } from 'react';
import { formatCurrency } from '../utils/currency';
import './Receipt.css';

const Receipt = ({ fee, onClose }) => {
  const receiptRef = useRef(null);

  useEffect(() => {
    if (receiptRef.current) {
      window.print();
    }
  }, []);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPaymentMethod = (method) => {
    if (!method) return '-';
    const methods = {
      'cash': 'Cash',
      'bank-transfer': 'Bank Transfer',
      'mobile-money': 'Mobile Money',
      'other': 'Other'
    };
    return methods[method] || method;
  };

  const formatFeeType = (type) => {
    const types = {
      'tuition': 'Monthly Tuition',
      'registration': 'Registration Fee',
      'other': 'Other Fee'
    };
    return types[type] || type;
  };

  const receiptNumber = fee.receiptNumber || `REC-${fee._id.slice(-8).toUpperCase()}`;
  const paidDate = fee.paidDate || fee.createdAt || new Date();

  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt-container" ref={receiptRef} onClick={(e) => e.stopPropagation()}>
        <div className="receipt-header">
          <div className="receipt-logo">
            <img src="/logo.jpg" alt="Logo" className="logo-img" />
          </div>
          <div className="receipt-title">
            <h1>Faisal Center</h1>
            <p>Payment Receipt</p>
          </div>
        </div>

        <div className="receipt-info">
          <div className="receipt-row">
            <div className="receipt-label">Receipt Number:</div>
            <div className="receipt-value">{receiptNumber}</div>
          </div>
          <div className="receipt-row">
            <div className="receipt-label">Date:</div>
            <div className="receipt-value">{formatDate(paidDate)}</div>
          </div>
        </div>

        <div className="receipt-section">
          <h3>Student Information</h3>
          <div className="receipt-row">
            <div className="receipt-label">Student Name:</div>
            <div className="receipt-value">
              {fee.student?.firstName} {fee.student?.lastName}
            </div>
          </div>
          <div className="receipt-row">
            <div className="receipt-label">Student ID:</div>
            <div className="receipt-value">{fee.student?.studentId || '-'}</div>
          </div>
          {fee.student?.parentName && (
            <div className="receipt-row">
              <div className="receipt-label">Parent Name:</div>
              <div className="receipt-value">{fee.student.parentName}</div>
            </div>
          )}
        </div>

        <div className="receipt-section">
          <h3>Payment Details</h3>
          <div className="receipt-row">
            <div className="receipt-label">Fee Type:</div>
            <div className="receipt-value">{formatFeeType(fee.feeType)}</div>
          </div>
          {fee.period && (
            <div className="receipt-row">
              <div className="receipt-label">Period:</div>
              <div className="receipt-value">
                {new Date(fee.period + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </div>
            </div>
          )}
          <div className="receipt-row">
            <div className="receipt-label">Amount Due:</div>
            <div className="receipt-value">{formatCurrency(fee.amount)}</div>
          </div>
          <div className="receipt-row">
            <div className="receipt-label">Amount Paid:</div>
            <div className="receipt-value receipt-amount">{formatCurrency(fee.paidAmount || fee.amount)}</div>
          </div>
          {fee.paidAmount < fee.amount && (
            <div className="receipt-row">
              <div className="receipt-label">Balance:</div>
              <div className="receipt-value receipt-balance">
                {formatCurrency(fee.amount - fee.paidAmount)}
              </div>
            </div>
          )}
          <div className="receipt-row">
            <div className="receipt-label">Payment Method:</div>
            <div className="receipt-value">{formatPaymentMethod(fee.paymentMethod)}</div>
          </div>
          {fee.notes && (
            <div className="receipt-row">
              <div className="receipt-label">Notes:</div>
              <div className="receipt-value">{fee.notes}</div>
            </div>
          )}
        </div>

        {fee.recordedBy && (
          <div className="receipt-section">
            <div className="receipt-row">
              <div className="receipt-label">Recorded By:</div>
              <div className="receipt-value">{fee.recordedBy?.name || fee.recordedBy?.username || '-'}</div>
            </div>
          </div>
        )}

        <div className="receipt-footer">
          <p>Thank you for your payment!</p>
          <p className="receipt-disclaimer">This is a computer-generated receipt.</p>
        </div>

        <div className="receipt-actions">
          <button onClick={() => window.print()} className="btn-primary">Print</button>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;

