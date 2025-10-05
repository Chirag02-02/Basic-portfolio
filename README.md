# Portfolio Backend - Spring Boot Contact Form API

A Spring Boot backend application for a portfolio website with a contact form API that allows users to submit their contact information.

## Features

- **Contact Form API**: Submit contact information with validation
- **RESTful Endpoints**: Full CRUD operations for contact management
- **Data Validation**: Built-in validation for all contact fields
- **CORS Support**: Configured for frontend integration
- **H2 Database**: In-memory database for development
- **JPA/Hibernate**: Object-relational mapping for database operations

## Contact Form Fields

- **Name** (String, required, max 100 characters)
- **Email** (String, required, valid email format, max 100 characters)
- **Contact Number** (String, required, max 20 characters)
- **Message** (String, required, max 1000 characters)

## API Endpoints

### Contact Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contacts` | Submit a new contact form |
| GET | `/api/contacts` | Get all contact submissions |
| GET | `/api/contacts/{id}` | Get a specific contact by ID |
| DELETE | `/api/contacts/{id}` | Delete a contact by ID |
| GET | `/api/contacts/count` | Get total count of contacts |

### Search Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts/email/{email}` | Find contacts by email |
| GET | `/api/contacts/name/{name}` | Find contacts by name (case-insensitive) |
| GET | `/api/contacts/phone/{contactNumber}` | Find contacts by contact number |

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## Setup and Installation

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd portfolio-backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   
   Or run the main class `PortfolioBackendApplication` from your IDE.

4. **Access the application**
   - API Base URL: `http://localhost:8080/api`
   - H2 Database Console: `http://localhost:8080/h2-console`
     - JDBC URL: `jdbc:h2:mem:portfolio_db`
     - Username: `sa`
     - Password: (leave empty)

## API Usage Examples

### Submit a Contact Form

```bash
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "contactNumber": "+1234567890",
    "message": "Hello, I would like to discuss a project opportunity."
  }'
```

### Get All Contacts

```bash
curl -X GET http://localhost:8080/api/contacts
```

### Get Contact by ID

```bash
curl -X GET http://localhost:8080/api/contacts/1
```

### Search Contacts by Email

```bash
curl -X GET http://localhost:8080/api/contacts/email/john.doe@example.com
```

### Delete a Contact

```bash
curl -X DELETE http://localhost:8080/api/contacts/1
```

## Frontend Integration

The API is configured with CORS to allow frontend integration. You can integrate this with your frontend using JavaScript fetch or any HTTP client library.

### JavaScript Example

```javascript
// Submit contact form
async function submitContact(contactData) {
  try {
    const response = await fetch('http://localhost:8080/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Contact submitted successfully:', result);
      return result;
    } else {
      throw new Error('Failed to submit contact');
    }
  } catch (error) {
    console.error('Error submitting contact:', error);
    throw error;
  }
}

// Example usage
const contactData = {
  name: "Jane Smith",
  email: "jane.smith@example.com",
  contactNumber: "+1987654321",
  message: "Interested in your portfolio work."
};

submitContact(contactData);
```

## Project Structure

```
src/
├── main/
│   ├── java/com/portfolio/
│   │   ├── PortfolioBackendApplication.java    # Main application class
│   │   ├── config/
│   │   │   └── CorsConfig.java                 # CORS configuration
│   │   ├── controller/
│   │   │   └── ContactController.java          # REST API endpoints
│   │   ├── model/
│   │   │   └── Contact.java                    # Contact entity
│   │   ├── repository/
│   │   │   └── ContactRepository.java          # Data access layer
│   │   └── service/
│   │       └── ContactService.java             # Business logic layer
│   └── resources/
│       └── application.properties              # Application configuration
└── test/                                       # Test files (to be added)
```

## Configuration

The application uses the following key configurations:

- **Port**: 8080 (configurable in `application.properties`)
- **Database**: H2 in-memory database
- **CORS**: Enabled for all origins (configure for production)
- **Validation**: Bean validation enabled
- **Logging**: Debug level for development

## Development Notes

- The H2 database is in-memory, so data will be lost when the application restarts
- For production, replace H2 with a persistent database (MySQL, PostgreSQL, etc.)
- Update CORS configuration for production security
- Add authentication/authorization as needed
- Consider adding email notifications for new contact submissions

## Testing

You can test the API using:
- cURL commands (examples provided above)
- Postman or similar API testing tools
- Frontend integration
- H2 Console for database inspection

## Production Deployment

For production deployment:

1. Replace H2 with a persistent database
2. Update CORS configuration for your domain
3. Add proper security configurations
4. Configure logging levels
5. Set up monitoring and health checks

## License

This project is open source and available under the MIT License.