import React from 'react';

const StatsCards = ({ stats }) => {
  const { total_transactions = 0, fraud_transactions = 0, fraud_rate = 0 } = stats || {};

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">Transactions Checked</span>
        </div>
        <div className="stat-value">{total_transactions.toLocaleString()}</div>
        <div className="stat-subtitle">Total predictions in database</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">Fraud Detected</span>
        </div>
        <div className="stat-value" style={{ color: fraud_transactions > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
          {fraud_transactions.toLocaleString()}
        </div>
        <div className="stat-subtitle">Confirmed suspicious activities</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-title">Fraud/Risk Rate</span>
        </div>
        <div className="stat-value" style={{ color: fraud_rate > 5 ? 'var(--danger)' : (fraud_rate > 2 ? 'var(--warning)' : 'var(--success)') }}>
          {fraud_rate.toFixed(2)}%
        </div>
        <div className="stat-subtitle">Percentage of flagged transactions</div>
      </div>
    </div>
  );
};

export default StatsCards;
