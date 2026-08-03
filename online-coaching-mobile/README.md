# Online Coaching System - Mobile App

A comprehensive React Native mobile application for the Online Coaching System. Built with Expo, React Native Paper, and integrated with the existing Spring Boot backend.

## 🚀 Features

### Authentication
- User registration (Student/Teacher)
- JWT-based authentication
- Password reset functionality
- Role-based access control (RBAC)
- Secure token storage with AsyncStorage

### Student Features
- Course browsing and enrollment
- Progress tracking dashboard
- Lecture viewing
- Assignment submissions
- Quiz participation
- Messaging system
- Results and grades
- Profile management

### Teacher Features
- Course creation and management
- Lecture management (video content)
- Assignment creation and grading
- Quiz creation and management
- Student progress monitoring
- Messaging with students
- View ratings and feedback
- Results management

### Admin Features
- Platform analytics and statistics
- User management (Students & Teachers)
- Block/unblock users
- Dashboard overview

## 🛠️ Tech Stack

### Core Framework
- **React Native** - Mobile framework
- **Expo** - Development tool
- **React Navigation 6** - Navigation (Stack, Bottom Tabs)
- **React Native Paper** - Material Design components

### State Management & Data Fetching
- **React Context API** - Global state (Auth, Toast)
- **Axios** - HTTP client for API calls
- **AsyncStorage** - Local storage

### UI Libraries
- **React Native Paper** - Material Design components
- **React Native Vector Icons** - Icon library
- **React Native Toast Notifications** - Toast notifications
- **React Native Chart Kit** - Data visualization

### Additional Libraries
- **React Native Video** - Video player
- **React Native Image Picker** - File uploads
- **React Native Reanimated** - Animations

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **npm or yarn**
3. **Expo CLI** - Install globally: `npm install -g expo-cli`
4. **Expo Go app** - Download from App Store/Play Store for testing
5. **Spring Boot backend** running on port 8080
6. **MySQL database** configured

## 🔧 Installation

1. **Navigate to the mobile directory:**
   ```bash
   cd online-coaching-mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL:**
   Open `src/services/api.js` and update the API_BASE_URL:
   ```javascript
   // For Android emulator
   const API_BASE_URL = 'http://10.0.2.2:8080/api';
   
   // For iOS simulator
   // const API_BASE_URL = 'http://localhost:8080/api';
   
   // For real device - use your computer's IP
   // const API_BASE_URL = 'http://YOUR_IP:8080/api';
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the Expo development server:**
   ```bash
   npm start
   ```

2. **Scan the QR code** with Expo Go app on your mobile device
   OR
   Press `a` for Android emulator
   OR
   Press `i` for iOS simulator

### Android Emulator

```bash
npm run android
```

### iOS Simulator

```bash
npm run ios
```

### Web Preview

```bash
npm run web
```

## 📁 Project Structure

```
online-coaching-mobile/
├── src/
│   ├── components/          # Reusable components
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.js
│   │   └── useApi.js
│   ├── navigation/          # React Navigation
│   │   ├── AppNavigator.jsx
│   │   ├── AuthNavigator.jsx
│   │   ├── StudentNavigator.jsx
│   │   ├── TeacherNavigator.jsx
│   │   └── AdminNavigator.jsx
│   ├── screens/             # Screen components
│   │   ├── auth/            # Authentication screens
│   │   ├── admin/           # Admin screens
│   │   ├── student/         # Student screens
│   │   ├── teacher/         # Teacher screens
│   │   └── shared/          # Shared screens
│   ├── services/            # API services
│   │   └── api.js
│   ├── App.jsx              # Main app component
│   └── index.js             # Entry point
├── assets/                 # Images, fonts
├── App.js                  # React Native entry
├── package.json
├── app.json
└── babel.config.js
```

## 🔐 Authentication Flow

1. **Registration:** Users can register as Student or Teacher
2. **Login:** Credentials sent to backend, JWT token stored in AsyncStorage
3. **Protected Routes:** All dashboard routes require authentication
4. **Role-Based Access:** Different navigators for Admin, Student, and Teacher
5. **Auto-Logout:** Automatic redirect to login on token expiration

## 🎨 Design Features

- **Material Design:** Using React Native Paper components
- **Responsive Layout:** Adapts to different screen sizes
- **Bottom Navigation:** Easy access to main features
- **Toast Notifications:** Real-time feedback
- **Loading States:** Activity indicators during API calls
- **Error Handling:** User-friendly error messages
- **Icon Integration:** Material Icons throughout the app

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
- **Study Material API:** File upload/download
- **Submission API:** Assignment submissions and grading
- **Result API:** Student results and grades

## 📱 Platform-Specific Notes

### Android Emulator
- Use `http://10.0.2.2:8080/api` for API calls
- Emulator maps localhost to 10.0.2.2

### iOS Simulator
- Use `http://localhost:8080/api` for API calls
- Simulator can access localhost directly

### Real Device
- Use your computer's IP address: `http://YOUR_IP:8080/api`
- Ensure device and computer are on the same network
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure Spring Boot backend is running on port 8080
- Check API_BASE_URL in src/services/api.js
- Verify device/emulator can reach the backend

### Metro Bundler Issues
- Clear cache: `npm start -- --clear`
- Reset cache: `expo start -c`
- Delete node_modules and reinstall

### Build Errors
- Delete node_modules and package-lock.json
- Run `npm install` again
- Ensure Node.js version is 16 or higher

### Navigation Issues
- Ensure React Navigation dependencies are installed
- Check navigation structure in navigators

## 🚀 Deployment

### Building for Production

**Android APK:**
```bash
expo build:android
```

**iOS IPA:**
```bash
expo build:ios
```

### Using EAS Build

```bash
eas build --platform android
eas build --platform ios
```

## 📝 Environment Variables

For production, create a `.env` file:

```env
API_BASE_URL=https://your-production-api.com/api
```

## 🔒 Security Considerations

- JWT tokens stored in AsyncStorage
- Automatic token injection via axios interceptors
- Token expiration handling
- Protected routes with role-based access
- Input validation on forms
- HTTPS in production

## 🎯 Key Differencesfrom Web App

### Navigation
- **Web:** React Router with URL routes
- **Mobile:** React Navigation with stack/tab navigators

### Storage
- **Web:** localStorage
- **Mobile:** AsyncStorage

### Components
- **Web:** HTML elements (div, span, input)
- **Mobile:** React Native components (View, Text, TextInput)

### Styling
- **Web:** CSS/TailwindCSS
- **Mobile:** StyleSheet objects

### File Upload
- **Web:** File input + FormData
- **Mobile:** Image Picker + FormData

## 🤝 Contributing

This is part of the Online Coaching System project. For any issues or improvements, please contact the development team.

## 📄 License

This project is created for educational purposes as part of the Online Coaching System.

## 🎓 Architecture Highlights

- **Same API Layer:** Identical to web app for consistency
- **Context API:** Replaces web's Context with AsyncStorage
- **Navigation:** React Navigation instead of React Router
- **Components:** React Native Paper instead of HTML/Tailwind
- **State Management:** Same patterns as web app

This mobile app maintains the same architecture and business logic as the web application, providing a seamless experience across platforms.
