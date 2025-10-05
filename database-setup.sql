-- Portfolio Database Setup Script
-- Run this script in MySQL to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE portfolio_db;

-- Create user for the application (optional - you can use root if preferred)
CREATE USER IF NOT EXISTS 'portfolio_user'@'localhost' IDENTIFIED BY 'portfolio_password';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;

-- Create contacts table (Spring Boot will handle this automatically with JPA, but here's the manual version)
CREATE TABLE IF NOT EXISTS contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data (optional)
INSERT INTO contacts (name, email, contact_number, message, created_at) VALUES
('John Doe', 'john.doe@example.com', '+1234567890', 'Hello, I am interested in your portfolio work.', NOW()),
('Jane Smith', 'jane.smith@example.com', '+1987654321', 'Great portfolio! Would love to collaborate.', NOW()),
('Mike Johnson', 'mike.j@example.com', '+1122334455', 'Impressive projects. Let\'s discuss opportunities.', NOW());

-- Show the created table structure
DESCRIBE contacts;

-- Show sample data
SELECT * FROM contacts;
