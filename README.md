# Online Coaching System

A full-stack Learning Management System built with Spring Boot, React, and React Native for online education with features for students, teachers, and administrators.

## 🌟 Features

### Core Functionality
- **Multi-Role Authentication**: Secure login system for Students, Teachers, and Admins
- **Course Management**: Create, edit, and manage courses with rich content
- **Video Lectures**: Support for both video URLs and direct file uploads (MP4, MOV, AVI, MKV)
- **Quiz System**: Create quizzes with multiple question types, auto-grading, and result tracking
- **Assignment Management**: Create assignments, student submissions, and teacher evaluation
- **Messaging**: In-app messaging between students and teachers
- **Progress Tracking**: Track student progress, quiz scores, and assignment grades
- **Payment Integration**: Razorpay integration for course enrollment payments
- **Dark Mode**: Dark mode support across all interfaces
- **Role-Based Access Control**: Different permissions for students, teachers, and admins
- **Course Ratings & Feedback**: Students can rate courses and provide feedback
- **File Upload Management**: Secure file handling for lectures and assignments

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot
- **Language**: Java
- **Database**: MySQL
- **ORM**: Hibernate/JPA
- **Security**: Spring Security with JWT authentication
- **Payment**: Razorpay Java SDK
- **Build Tool**: Maven

### Frontend (Web)
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.8
- **Styling**: Tailwind CSS 3.4.12
- **State Management**: React Context API
- **Routing**: React Router DOM 6.26.1
- **HTTP Client**: Axios 1.7.7
- **Charts**: Recharts 2.12.7
- **Forms**: React Hook Form 7.53.0
- **Validation**: Zod 3.23.8
- **Payment**: Razorpay 2.8.6
- **Notifications**: React Hot Toast 2.4.1

### Mobile App
- **Framework**: React Native 0.74.5
- **Runtime**: Expo 51.0.0
- **Navigation**: React Navigation 6.x
- **UI Components**: React Native Paper 5.12.5
- **Charts**: React Native Chart Kit 6.12.0
- **Storage**: AsyncStorage
- **Payment**: Razorpay React Native 2.3.0

## 📁 Project Structure

```
online-coaching/
├── online-coaching-system/          # Backend Spring Boot application
│   ├── src/main/java/com/coaching/
│   │   ├── controller/              # REST API controllers
│   │   ├── service/                 # Business logic
│   │   ├── repository/              # Data access layer
│   │   ├── entity/                  # JPA entities
│   │   ├── dto/                     # Data transfer objects
│   │   ├── config/                  # Configuration classes
│   │   └── security/                # Security configuration
│   ├── src/main/resources/
│   │   ├── application.properties   # Application configuration
│   │   └── static/                  # Static files
│   └── pom.xml                      # Maven dependencies
├── online-coaching-frontend/         # React web application
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Page components
│   │   ├── contexts/                # React contexts
│   │   ├── services/                # API services
│   │   ├── utils/                   # Utility functions
│   │   └── App.jsx                  # Main app component
│   ├── public/                      # Static assets
│   └── package.json                 # NPM dependencies
├── online-coaching-mobile/           # React Native mobile app
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── screens/                 # Screen components
│   │   ├── navigation/              # Navigation configuration
│   │   ├── services/                # API services
│   │   └── App.js                   # Main app component
│   └── package.json                 # NPM dependencies
├── database_setup.sql               # Database schema
├── BACKEND_IMPLEMENTATION_GUIDE.md  # Backend documentation
├── WEB_FRONTEND_IMPLEMENTATION_GUIDE.md # Frontend documentation
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Git

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE OnlineCoachingInstitute;
```

2. Run the database setup script:
```bash
mysql -u root -p OnlineCoachingInstitute < database_setup.sql
```

3. Run additional migration scripts if needed:
```bash
mysql -u root -p OnlineCoachingInstitute < create_new_features_tables.sql
mysql -u root -p OnlineCoachingInstitute < create_payments_table.sql
mysql -u root -p OnlineCoachingInstitute < create_analytics_table.sql
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd online-coaching-system
```

2. Configure application properties:
```bash
# Edit src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/OnlineCoachingInstitute
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

# JWT Configuration
jwt.secret=yourSecretKeyHere
jwt.expiration=86400000

# Razorpay Configuration
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET
```

3. Build and run the application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd online-coaching-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API base URL:
```bash
# Edit src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';
```

4. Add Razorpay checkout script to `index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

5. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Mobile App Setup

1. Navigate to the mobile directory:
```bash
cd online-coaching-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure API base URL:
```bash
# Edit src/services/api.js
const API_BASE_URL = 'http://YOUR_SERVER_IP:8080/api';
```

4. Start the development server:
```bash
npm start
```

5. Run on specific platform:
```bash
npm run android    # For Android
npm run ios        # For iOS
npm run web        # For web
```

## 📚 API Documentation

For complete API documentation, refer to [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🧪 Testing

### Backend Testing
```bash
cd online-coaching-system
mvn test
```

### Frontend Testing
```bash
cd online-coaching-frontend
npm test
```

## 📊 Database Schema

### Main Tables
- users
- students
- teachers
- courses
- enrollments
- lectures
- assignments
- quiz
- quiz_questions
- quiz_submissions
- messages
- payments
- course_ratings

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt password hashing
- **Role-Based Access Control**: Different permissions per role
- **CORS Configuration**: Cross-origin resource sharing protection
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries via JPA
- **XSS Protection**: Input sanitization and output encoding

## 🌐 Deployment

### Backend Deployment

1. Build the JAR file:
```bash
cd online-coaching-system
mvn clean package -DskipTests
```

2. Deploy to server:
```bash
java -jar target/online-coaching-system-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment

1. Build the production bundle:
```bash
cd online-coaching-frontend
npm run build
```

2. Deploy the `dist` folder to your web server

### Mobile App Deployment

1. Build for production:
```bash
cd online-coaching-mobile
# For Android
eas build --platform android

# For iOS
eas build --platform ios
```

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Shailesh Kole** - *Initial development* - [shaileshkole16](https://github.com/shaileshkole16)


## 🗺 Roadmap

- [ ] Add live classes
- [ ] Implement AI-based course recommendations
- [ ] Add certificate generation
- [ ] Add multi-language support


## 🔧 Configuration

### Environment Variables

Backend:
```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/OnlineCoachingInstitute
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Frontend:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY=your_razorpay_key
```

## 🐛 Known Issues

Please refer to the GitHub Issues page for a list of known issues and their status.

## 📚 Documentation

- [Backend Implementation Guide](BACKEND_IMPLEMENTATION_GUIDE.md)
- [Web Frontend Implementation Guide](WEB_FRONTEND_IMPLEMENTATION_GUIDE.md)
- [Mobile App Implementation Guide](online-coaching-mobile/IMPLEMENTATION_GUIDE.md)
- [Database Schema](database_setup.sql)
- [API Documentation](API_DOCUMENTATION.md)


---

**Built with ❤️ for education**
