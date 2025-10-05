# Database Setup Guide for Portfolio Backend

## Prerequisites
- MySQL Server installed and running
- XAMPP (includes MySQL) or standalone MySQL installation

## Step 1: Install MySQL (if not already installed)

### Option A: Using XAMPP (Recommended)
1. Download and install XAMPP from https://www.apachefriends.org/
2. Start XAMPP Control Panel
3. Start MySQL service
4. Click "Admin" next to MySQL to open phpMyAdmin

### Option B: Standalone MySQL
1. Download MySQL from https://dev.mysql.com/downloads/mysql/
2. Install MySQL Server
3. Set root password during installation

## Step 2: Create Database

### Method 1: Using phpMyAdmin (XAMPP)
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Click "New" to create a new database
3. Name it `portfolio_db`
4. Set collation to `utf8mb4_unicode_ci`
5. Click "Create"

### Method 2: Using MySQL Command Line
```sql
mysql -u root -p
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Method 3: Using the provided SQL script
```bash
mysql -u root -p < database-setup.sql
```

## Step 3: Update Spring Boot Configuration

The application is already configured to use MySQL. Make sure your `application.properties` has:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

## Step 4: Test the Setup

1. Start your Spring Boot application:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

2. Test the API:
   ```bash
   curl -X POST http://localhost:8080/api/contacts \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "contactNumber": "+1234567890",
       "message": "Test message"
     }'
   ```

3. Check the database:
   ```sql
   USE portfolio_db;
   SELECT * FROM contacts;
   ```

## Troubleshooting

### Common Issues:

1. **Connection refused**: Make sure MySQL is running
2. **Access denied**: Check username/password in application.properties
3. **Database doesn't exist**: Create the database first
4. **Port 3306 in use**: Check if MySQL is running on different port

### MySQL Connection Test:
```bash
mysql -u root -p -h localhost -P 3306
```

### Check MySQL Status:
```bash
# Windows (XAMPP)
net start mysql

# Linux/Mac
sudo systemctl status mysql
```

## Database Schema

The `contacts` table will be created automatically by Spring Boot with the following structure:

```sql
CREATE TABLE contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Notes

- Change default MySQL root password
- Use environment variables for database credentials in production
- Enable SSL for database connections in production
- Create dedicated database user with limited privileges

## Production Setup

For production deployment:

1. Use environment variables:
   ```properties
   spring.datasource.username=${DB_USERNAME}
   spring.datasource.password=${DB_PASSWORD}
   spring.datasource.url=${DB_URL}
   ```

2. Use connection pooling:
   ```properties
   spring.datasource.hikari.maximum-pool-size=20
   spring.datasource.hikari.minimum-idle=5
   ```

3. Enable SSL:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db?useSSL=true&serverTimezone=UTC
   ```
