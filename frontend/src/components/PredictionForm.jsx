import React, { useState } from 'react';

const PredictionForm = ({ onPredict, isLoading }) => {
  const [formData, setFormData] = useState({
    step: 1,
    amount: 10000.0,
    oldbalanceOrg: 15000.0,
    newbalanceOrig: 5000.0,
    oldbalanceDest: 0.0,
    newbalanceDest: 10000.0,
    transaction_type: 'TRANSFER',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'transaction_type' ? value : parseFloat(value) || 0;

    setFormData((prev) => {
      const updated = { ...prev, [name]: parsedValue };

      // Helper logic: automatically calculate new balances based on transaction type if changed
      if (name === 'amount' || name === 'oldbalanceOrg') {
        const amt = name === 'amount' ? parsedValue : prev.amount;
        const oldOrg = name === 'oldbalanceOrg' ? parsedValue : prev.oldbalanceOrg;
        
        if (prev.transaction_type === 'TRANSFER' || prev.transaction_type === 'CASH_OUT') {
          updated.newbalanceOrig = Math.max(0, oldOrg - amt);
        } else if (prev.transaction_type === 'CASH_IN') {
          updated.newbalanceOrig = oldOrg + amt;
        }
      }

      if (name === 'amount' || name === 'oldbalanceDest') {
        const amt = name === 'amount' ? parsedValue : prev.amount;
        const oldDest = name === 'oldbalanceDest' ? parsedValue : prev.oldbalanceDest;
        
        if (prev.transaction_type === 'TRANSFER' || prev.transaction_type === 'CASH_IN' || prev.transaction_type === 'CASH_OUT') {
          updated.newbalanceDest = oldDest + amt;
        }
      }

      return updated;
    });
  };

  const handleAutofill = (scenario) => {
    if (scenario === 'fraud') {
      // Typically: high transfer amount, depleting all sender balance, destination has 0 balance and stays 0 or receives high amount
      setFormData({
        step: 12,
        amount: 850000.00,
        oldbalanceOrg: 850000.00,
        newbalanceOrig: 0.00,
        oldbalanceDest: 0.00,
        newbalanceDest: 0.00, // standard pattern for instant out-routing fraud
        transaction_type: 'TRANSFER'
      });
    } else {
      // Normal transaction: small cashout/transfer, standard balances
      setFormData({
        step: 24,
        amount: 150.00,
        oldbalanceOrg: 2500.00,
        newbalanceOrig: 2350.00,
        oldbalanceDest: 45000.00,
        newbalanceDest: 45150.00,
        transaction_type: 'CASH_OUT'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <div className="section-panel">
      <h2 className="panel-title">
        Analyze Transaction
      </h2>
      
      {/* Quick Autofill Scenarios */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button 
          type="button" 
          onClick={() => handleAutofill('normal')}
          style={{
            flex: 1,
            background: '#e9f0ea',
            border: '1px solid #cce0d2',
            color: '#4b6851',
            borderRadius: '0.25rem',
            padding: '0.45rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            fontFamily: 'var(--serif-font)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Load Normal Scenario
        </button>
        <button 
          type="button" 
          onClick={() => handleAutofill('fraud')}
          style={{
            flex: 1,
            background: '#faf0f0',
            border: '1px solid #ebd3d3',
            color: '#b86262',
            borderRadius: '0.25rem',
            padding: '0.45rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            fontFamily: 'var(--serif-font)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Load Fraud Scenario
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="transaction_type">Type</label>
          <select
            id="transaction_type"
            name="transaction_type"
            value={formData.transaction_type}
            onChange={(e) => setFormData(prev => ({ ...prev, transaction_type: e.target.value }))}
            className="form-input"
            style={{ appearance: 'none', background: '#ffffff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23849188\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E") no-repeat right 1rem center / 1rem' }}
          >
            <option value="TRANSFER">TRANSFER</option>
            <option value="CASH_OUT">CASH OUT</option>
            <option value="CASH_IN">CASH IN</option>
            <option value="DEBIT">DEBIT</option>
            <option value="PAYMENT">PAYMENT</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="step">Time Step (Hour)</label>
          <input
            type="number"
            id="step"
            name="step"
            min="1"
            max="744"
            value={formData.step}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group form-group-full">
          <label className="form-label" htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="oldbalanceOrg">Origin Old Balance ($)</label>
          <input
            type="number"
            id="oldbalanceOrg"
            name="oldbalanceOrg"
            step="0.01"
            min="0"
            value={formData.oldbalanceOrg}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="newbalanceOrig">Origin New Balance ($)</label>
          <input
            type="number"
            id="newbalanceOrig"
            name="newbalanceOrig"
            step="0.01"
            min="0"
            value={formData.newbalanceOrig}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="oldbalanceDest">Dest. Old Balance ($)</label>
          <input
            type="number"
            id="oldbalanceDest"
            name="oldbalanceDest"
            step="0.01"
            min="0"
            value={formData.oldbalanceDest}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="newbalanceDest">Dest. New Balance ($)</label>
          <input
            type="number"
            id="newbalanceDest"
            name="newbalanceDest"
            step="0.01"
            min="0"
            value={formData.newbalanceDest}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="btn-submit form-group-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Run ML Prediction</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;
