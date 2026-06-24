import React from 'react';

const PredictionResult = ({ result }) => {
  if (!result) return null;

  const { fraud_probability = 0, prediction = 0 } = result;
  const isFraud = prediction === 1;
  const percentage = (fraud_probability * 100).toFixed(1);

  return (
    <div className={`result-container ${isFraud ? 'result-fraud' : 'result-safe'}`}>
      <div className={`result-header ${isFraud ? 'text-fraud' : 'text-safe'}`}>
        <span>{isFraud ? 'High Risk Flagged' : 'Transaction Safe'}</span>
      </div>

      <p style={{ margin: '0.25rem 0 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        {isFraud 
          ? 'This transaction matches fraud patterns and is recommended for rejection.' 
          : 'This transaction shows typical patterns and is safe to proceed.'}
      </p>

      <div className="gauge-container">
        <div 
          className={`gauge-bar ${isFraud ? 'gauge-bar-fraud' : 'gauge-bar-safe'}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="result-details">
        <span>Probability Score</span>
        <div className={`probability-badge ${isFraud ? 'text-fraud' : 'text-safe'}`}>
          {percentage}%
        </div>
      </div>

      {result.top_reasons && result.top_reasons.length > 0 && (
        <div style={{
          marginTop: '1.5rem',
          width: '100%',
          textAlign: 'left',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.25rem'
        }}>
          <h4 style={{
            margin: '0 0 0.75rem',
            fontFamily: 'var(--display-font)',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            Key Decision Drivers (SHAP)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {result.top_reasons.map((item, idx) => {
              const isPositive = item.impact > 0;
              return (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  padding: '0.55rem 0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.825rem'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.reason}</span>
                  <span style={{
                    color: isPositive ? 'var(--danger)' : 'var(--success)',
                    fontWeight: '700',
                    fontFamily: 'var(--mono)',
                    background: isPositive ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.8rem'
                  }}>
                    {isPositive ? '+' : ''}{item.impact}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
