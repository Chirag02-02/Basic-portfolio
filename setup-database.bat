@echo off
echo ========================================
echo Portfolio Database Setup Script
echo ========================================
echo.

echo Step 1: Checking if XAMPP is running...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is not running
    echo Please start XAMPP and MySQL service
    echo 1. Open XAMPP Control Panel
    echo 2. Click "Start" next to MySQL
    echo 3. Run this script again
    pause
    exit /b 1
)

echo.
echo Step 2: Creating database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %ERRORLEVEL%==0 (
    echo ✅ Database created successfully
) else (
    echo ❌ Failed to create database
    echo Please check MySQL connection
    pause
    exit /b 1
)

echo.
echo Step 3: Creating contacts table...
mysql -u root portfolio_db -e "CREATE TABLE IF NOT EXISTS contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"

if %ERRORLEVEL%==0 (
    echo ✅ Table created successfully
) else (
    echo ❌ Failed to create table
    pause
    exit /b 1
)

echo.
echo Step 4: Inserting sample data...
mysql -u root portfolio_db -e "INSERT IGNORE INTO contacts (name, email, contact_number, message) VALUES
('John Doe', 'john.doe@example.com', '+1234567890', 'Hello, I am interested in your portfolio work.'),
('Jane Smith', 'jane.smith@example.com', '+1987654321', 'Great portfolio! Would love to collaborate.'),
('Mike Johnson', 'mike.j@example.com', '+1122334455', 'Impressive projects. Let''s discuss opportunities.');"

if %ERRORLEVEL%==0 (
    echo ✅ Sample data inserted
) else (
    echo ⚠️ Sample data insertion failed (may already exist)
)

echo.
echo Step 5: Verifying setup...
mysql -u root portfolio_db -e "SELECT COUNT(*) as total_contacts FROM contacts;"

echo.
echo ========================================
echo ✅ Database setup completed!
echo ========================================
echo.
echo Next steps:
echo 1. Start Spring Boot application: .\mvnw.cmd spring-boot:run
echo 2. Open test-database.html in browser
echo 3. Test the contact form
echo.
echo Database Info:
echo - Database: portfolio_db
echo - Table: contacts
echo - Access: http://localhost/phpmyadmin
echo.
pause
