CREATE DATABASE fraudshield;

USE fraudshield;

CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    step INT,
    type VARCHAR(50),
    amount DOUBLE,
    sender VARCHAR(50),
    receiver VARCHAR(50),
    fraud BOOLEAN
);

CREATE TABLE alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT,
    fraud_score DOUBLE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password_hash TEXT,
    role VARCHAR(20)
);