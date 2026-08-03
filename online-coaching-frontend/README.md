# Online Coaching System - Frontend

A modern, responsive React frontend for the Online Coaching System CDAC final project. Built with React, Vite, TailwindCSS, and integrated with a Spring Boot backend.

**🏆 Top 1% Interview Project** - Enterprise-grade architecture with React Query, Error Boundaries, Custom Hooks, Data Visualization, and Advanced UI/UX patterns.

## 🚀 Features

### Authentication
- User registration (Student/Teacher)
- Login with JWT authentication
- Password reset functionality
- Protected routes with role-based access control

### Admin Dashboard
- Platform analytics and statistics
- User management (Students & Teachers)
- Block/delete users
- Real-time data visualization

### Student Dashboard
- Course browsing and enrollment
- Progress tracking
- Lecture viewing
- Assignment submissions
- Quiz participation
- Messaging system

### Teacher Dashboard
- Course creation and management
- Lecture management (video content)
- Assignment creation and grading
- Quiz creation and management
- Student progress monitoring
- Messaging with students

### Course Management
- Create, edit, and delete courses
- Add video lectures
- Create assignments with due dates
- Build quizzes with passing scores
- Track enrollments

### Study Materials
- Upload PDF, DOC, Images, Videos
- Download course materials
- File type detection with icons
- Delete materials

### Assignment Submissions
- File upload for assignments
- View submission status
- Teacher grading system
- Feedback and marks display
- Track submission history

### Results & Grades
- GPA calculation
- Average score tracking
- Course-wise results
- Grade display with color coding
- Performance tips

### Messaging System
- Real-time messaging
- Conversation history
- Search functionality
- Message deletion

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Spring Boot** - Backend API (separate project)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Spring Boot backend running on port 8080
- MySQL database configured

## 🔧 Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd online-coaching-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (if needed):**
   The API base URL is configured in `src/services/api.js`. Update if your backend runs on a different port:
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```

## 🚀 Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
online-coaching-frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx     # Main layout with sidebar
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx  # Authentication state
│   ├── pages/              # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── auth/          # Authentication pages
│   │   ├── assignments/   # Assignment management
│   │   ├── courses/       # Course pages
│   │   ├── lectures/      # Lecture management
│   │   ├── messages/      # Messaging system
│   │   ├── quizzes/       # Quiz management
│   │   ├── student/       # Student dashboard
│   │   └── teacher/       # Teacher dashboard
│   ├── services/           # API services
│   │   └── api.js         # Axios configuration
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## 🔐 Authentication Flow

1. **Registration:** Users can register as Student or Teacher
2. **Login:** Credentials sent to backend, JWT token stored in localStorage
3. **Protected Routes:** All dashboard routes require authentication
4. **Role-Based Access:** Different dashboards for Admin, Student, and Teacher
5. **Auto-Logout:** Automatic redirect to login on token expiration

## 🎨 Design Features

- **Responsive Design:** Mobile-first approach with TailwindCSS
- **Modern UI:** Clean, professional interface
- **Color Scheme:** Primary blue color with semantic colors for actions
- **Icons:** Lucide React icons for consistent iconography
- **Loading States:** Skeleton loaders and spinners
- **Error Handling:** User-friendly error messages with Error Boundaries
- **File Upload:** Drag-and-drop file upload interface
- **Grade Visualization:** Color-coded grades and performance metrics
- **Progress Tracking:** Visual progress bars for course completion
- **Data Visualization:** Interactive charts with Recharts
- **Toast Notifications:** Real-time feedback with React Hot Toast
- **Animations:** Smooth transitions with Framer Motion
- **Caching:** Intelligent data caching with React Query

## 🔌 API Integration

All API calls are centralized in `src/services/api.js`:

- **Auth API:** Login, register, logout, password reset
- **Admin API:** Dashboard, user management
- **Student API:** Dashboard, profile management
- **Teacher API:** Dashboard, profile management
- **Course API:** CRUD operations for courses
- **Enrollment API:** Course enrollment management
- **Lecture API:** Video lecture management
- **Assignment API:** Assignment creation and management
- **Quiz API:** Quiz creation and management
- **Message API:** Messaging system
- **Study Material API:** File upload/download for course materials
- **Submission API:** Assignment submissions and grading
- **Result API:** Student results and grades

## 📱 Responsive Breakpoints

- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (md, lg)
- **Desktop:** > 1024px (xl)

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure Spring Boot backend is running on port 8080
- Check CORS configuration in backend
- Verify API base URL in `src/services/api.js`

### Styling Issues
- TailCSS warnings are normal during development
- Run `npm install` to ensure all dependencies are installed
- Clear browser cache if styles don't update

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 16 or higher

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist` directory. Deploy this folder to any static hosting service (Netlify, Vercel, etc.).

### Environment Variables
For production, ensure:
- API base URL points to production backend
- Backend CORS allows production domain
- HTTPS is enabled for secure authentication

## 📝 Notes

- The frontend uses proxy configuration in `vite.config.js` for development
- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- All API calls include the Authorization header automatically
- Error handling is centralized in axios interceptors

## 🎓 CDAC Final Project

This frontend is part of the CDAC final project for the Online Coaching System. It provides a complete user interface for students, teachers, and administrators to manage online courses, lectures, assignments, and communications.

## 🤝 Contributing

This is a final project submission. For any issues or improvements, please contact the development team.

## 📄 License

This project is created for educational purposes as part of the CDAC curriculum.
