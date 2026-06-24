import React, { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import TransactionsTable from '../components/TransactionsTable';
import { getStats, getPredictions, predictTransaction, checkHealth } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_transactions: 0,
    fraud_transactions: 0,
    fraud_rate: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [modelInfo, setModelInfo] = useState({ model: 'xgboost_v3', features: 0 });

  const fetchData = async () => {
    try {
      const [statsData, txData, healthData] = await Promise.all([
        getStats(),
        getPredictions(),
        checkHealth().catch(() => ({ model: 'xgboost_v3', features: 15 })),
      ]);
      setStats(statsData);
      setTransactions(txData);
      if (healthData) setModelInfo(healthData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePredict = async (formData) => {
    setIsPredicting(true);
    try {
      const response = await predictTransaction(formData);
      setCurrentResult(response);
      // Refresh statistics and logs list
      fetchData();
    } catch (error) {
      alert('Failed to calculate prediction. Make sure your backend server is running.');
      console.error(error);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">FD</div>
          <div>
            <div className="logo-text">GuardAI</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fraud Detection Portal</div>
          </div>
          <span className="logo-badge">PRO</span>
        </div>
        <div className="status-indicator">
          <div className="status-dot" />
          <span>Backend Connected ({modelInfo.model})</span>
        </div>
      </header>

      {/* Stats Cards Row */}
      <StatsCards stats={stats} />

      {/* Main Dashboard Layout */}
      <div className="dashboard-grid">
        {/* Left Column: Form */}
        <PredictionForm onPredict={handlePredict} isLoading={isPredicting} />

        {/* Right Column: Result Panel or Model Details */}
        <div className="section-panel" style={{ justifyContent: 'center' }}>
          {currentResult ? (
            <>
              <h2 className="panel-title" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
                Prediction Results
              </h2>
              <PredictionResult result={currentResult} />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
              <h3 style={{ fontFamily: 'var(--display-font)', fontSize: '1.25rem', margin: '0 0 0.5rem' }}>
                Machine Learning Sandbox
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Enter the details of a transaction on the left to verify it. The backend will engineer <strong>{modelInfo.features || 15} features</strong> dynamically before running inference.
              </p>
              <div style={{
                marginTop: '1.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)'
              }}>
                Model: <code>{modelInfo.model}</code> | Pipeline: <code>Feature Engineering V3</code>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Full-Width Column: Table */}
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;
