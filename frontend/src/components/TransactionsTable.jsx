import React from 'react';

const TransactionsTable = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="section-panel table-panel">
        <h2 className="panel-title">
          Prediction Logs
        </h2>
        <div style={{ 
          textAlign: 'center', 
          padding: '2.5rem', 
          color: 'var(--text-muted)',
          background: '#ffffff',
          border: '1px dashed var(--border-color)',
          borderRadius: '0.25rem' 
        }}>
          No transactions analyzed yet. Submit the form above to run a prediction!
        </div>
      </div>
    );
  }

  // Sort transactions by id descending (assuming higher ID = newer)
  const sortedTransactions = [...transactions].sort((a, b) => b.id - a.id);

  return (
    <div className="section-panel table-panel">
      <h2 className="panel-title">
        Prediction Logs
      </h2>
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount ($)</th>
              <th>Fraud Prob.</th>
              <th>Assessment</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((tx) => {
              const isFraud = tx.prediction === 1;
              return (
                <tr key={tx.id}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: '600' }}>#{tx.id}</td>
                  <td>
                    <span style={{ 
                      background: 'rgba(0,0,0,0.03)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span style={{ 
                      color: isFraud ? 'var(--danger)' : 'var(--text-secondary)',
                      fontWeight: isFraud ? '700' : 'normal'
                    }}>
                      {(tx.fraud_probability * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${isFraud ? 'badge-fraud' : 'badge-safe'}`}>
                      {isFraud ? 'Fraudulent' : 'Safe'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
