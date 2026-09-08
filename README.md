# Online Coaching Management System

A comprehensive online coaching platform with Spring Boot backend, React frontend, and MySQL database.

## Implemented Features

### Backend (Spring Boot)
- Authentication & Authorization (JWT)
- User Management (Admin, Teacher, Student)
- Course Management
- Lecture Management
- Quiz System
- Assignment System
- File Upload
- Discussion Forums
- Results & Grading
- Support Tickets
- Audit Logging
- AI Chat Integration

### Frontend (React)
- User Authentication (Login, Register, Password Reset)
- Admin Dashboard (Dashboard, Analytics, Audit Logs, Tickets, Course/Student/Teacher Management, Enrollment Management)
- Teacher Dashboard (Dashboard, Profile, Discussion Forum, Course Ratings)
- Student Dashboard (Dashboard, Profile, Discussion Forum, Progress, Support Tickets)
- Course Management (Catalog, Details, Creation, Editing, Preview, Ratings, Students, Enrollment)
- Lecture Management (Lecture List with video playback)
- Quiz System (Quiz List, Quiz Taking, Submissions, Student Quiz View)
- Assignment System (Assignment List, Submissions, Grading)
- Discussion Forums (Course discussions, replies, answer acceptance)
- Support Ticket System (Create, view, manage tickets)
- AI Chat Interface (AI-powered conversation assistant)
- Study Materials (Upload, download, manage course materials)
- Results & Grading (View results, manage grades)

### Database
- MySQL with Flyway migrations

## Project Structure

```
online_coaching/
├── online-coaching-system/      # Spring Boot Backend
│   ├── src/main/java/com/coaching/
│   │   ├── controller/         # REST API controllers
│   │   ├── service/            # Business logic
│   │   ├── repository/         # Data access layer
│   │   ├── model/              # Entity models
│   │   └── config/             # Configuration classes
│   └── pom.xml                 # Maven dependencies
├── online-coaching-frontend/    # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts (Auth, etc.)
│   │   ├── pages/              # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── student/       # Student pages
│   │   │   ├── teacher/       # Teacher pages
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── courses/       # Course pages
│   │   │   ├── assignments/   # Assignment pages
│   │   │   ├── quizzes/       # Quiz pages
│   │   │   ├── materials/     # Study materials pages
│   │   │   ├── results/       # Results pages
│   │   │   ├── submissions/   # Submission pages
│   │   │   └── ai/            # AI Chat pages
│   │   ├── services/           # API services
│   │   └── App.jsx            # Main app component
│   └── package.json            # NPM dependencies
└── README.md                   # This file
```

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security (JWT Authentication)
- Spring Data JPA
- MySQL Database
- Flyway Migrations

### Frontend
- React 18
- Vite
- React Router
- Axios
- TailwindCSS
- Lucide React Icons

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven (for backend)

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd online-coaching-system
   ```

2. Configure database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/online_coaching
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd online-coaching-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:3000`

## API Documentation

The backend provides RESTful APIs for all features. Key endpoints include:

- `/api/auth/*` - Authentication endpoints
- `/api/admin/*` - Admin management
- `/api/courses/*` - Course management
- `/api/lectures/*` - Lecture management
- `/api/assignments/*` - Assignment management
- `/api/quiz/*` - Quiz management
- `/api/ai/*` - AI Chat integration

## Default Users

After running the database migrations, default users are created:

- **Admin**: admin@coaching.com / admin123
- **Teacher**: teacher@coaching.com / teacher123
- **Student**: student@coaching.com / student123

## Screenshots

### Student Dashboard
![Student Dashboard](screenshots/student_dashboard.jpeg)

### Admin Dashboard
![Admin Dashboard](screenshots/admin_dashboard.jpeg)

### Admin Audit Logs
![Admin Audit Logs](screenshots/admin_audit_logs.jpeg)

### Admin Manage Teachers
![Admin Manage Teachers](screenshots/admin_manage_teacher.jpeg)

### Admin Manage Students
![Admin Manage Students](screenshots/admin_student_manage.jpeg)

### Admin Support Tickets
![Admin Support Tickets](screenshots/admin_support_tickets.jpeg)

### Teacher Discussion Forum
![Teacher Discussion Forum](screenshots/teacher_discussion_forum.jpeg)

### Teacher Ratings
![Teacher Ratings](screenshots/teacher_ratings.jpeg)

### AI Chat Bot
![AI Chat Bot](screenshots/ai_chat_bot.jpeg)

### Sign In
![Sign In](screenshots/sign_in.jpeg)

### Register
![Register](screenshots/register.jpeg)

## License

This project is created for educational purposes.
