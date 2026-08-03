# Backend Implementation Guide

This document outlines the backend implementation for the advanced features added to the Online Coaching System.

## 🎯 Overview

The backend has been enhanced with:
- **Role-based Authentication**: Enhanced login API with user type validation
- **Payment Processing**: Complete Razorpay integration for course enrollment
- **Analytics System**: Event tracking and analytics reporting
- **Enhanced API Responses**: User object included in authentication responses

## 🔐 Authentication Enhancements

### Updated Login API

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "student" // Optional: "student", "teacher", or "admin"
}
```

**Response**:
```json
{
  "token": "jwt_token_here",
  "role": "STUDENT",
  "name": "John Doe",
  "message": "Login successful!",
  "userId": 1,
  "user": {
    "userId": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "STUDENT",
    "phone": "1234567890"
  }
}
```

### Changes Made

1. **LoginRequest.java**: Added `userType` field for role-based login
2. **AuthService.java**: Enhanced login method to validate user type
3. **AuthResponse.java**: Added `UserResponse` nested class for user details

## 💳 Payment Processing (Razorpay)

### Database Schema

**Table**: `payments`

```sql
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    razorpay_order_id VARCHAR(255) NOT NULL,
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    amount DOUBLE NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
    student_id BIGINT,
    course_id BIGINT,
    plan_type VARCHAR(50),
    receipt VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    refund_id VARCHAR(255),
    refund_amount DOUBLE,
    refund_status VARCHAR(50) DEFAULT 'NONE',
    refund_created_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
```

### Payment APIs

#### 1. Create Order
**Endpoint**: `POST /api/payments/create-order`

**Request Body**:
```json
{
  "studentId": 1,
  "courseId": 1,
  "amount": 999.00,
  "currency": "INR",
  "planType": "FULL",
  "receipt": "receipt_123",
  "notes": "Course enrollment"
}
```

**Response**:
```json
{
  "id": 1,
  "razorpayOrderId": "order_12345",
  "razorpayPaymentId": null,
  "amount": 999.00,
  "currency": "INR",
  "status": "PENDING",
  "planType": "FULL",
  "message": "Order created successfully",
  "studentId": 1,
  "courseId": 1
}
```

#### 2. Verify Payment
**Endpoint**: `POST /api/payments/verify`

**Request Parameters**:
- `orderId`: Razorpay order ID
- `paymentId`: Razorpay payment ID
- `signature`: Razorpay signature

**Response**:
```json
{
  "id": 1,
  "razorpayOrderId": "order_12345",
  "razorpayPaymentId": "pay_12345",
  "amount": 999.00,
  "currency": "INR",
  "status": "COMPLETED",
  "planType": "FULL",
  "message": "Payment verified and enrollment successful",
  "studentId": 1,
  "courseId": 1
}
```

#### 3. Process Refund
**Endpoint**: `POST /api/payments/refund/{paymentId}`

**Response**:
```json
{
  "id": 1,
  "razorpayOrderId": "order_12345",
  "razorpayPaymentId": "pay_12345",
  "amount": 999.00,
  "currency": "INR",
  "status": "REFUNDED",
  "planType": "FULL",
  "message": "Refund processed successfully",
  "studentId": 1,
  "courseId": 1
}
```

#### 4. Get Payment Status
**Endpoint**: `GET /api/payments/status/{paymentId}`

**Response**: Returns current payment status

### Components Created

1. **Payment.java**: Entity class for payments
2. **PaymentRepository.java**: JPA repository for payment operations
3. **PaymentService.java**: Business logic for payment processing
4. **PaymentController.java**: REST API endpoints
5. **PaymentRequest.java**: DTO for payment requests
6. **PaymentResponse.java**: DTO for payment responses

## 📊 Analytics System

### Database Schema

**Table**: `analytics_events`

```sql
CREATE TABLE analytics_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    properties TEXT,
    session_id VARCHAR(255) NOT NULL,
    user_id BIGINT,
    user_role VARCHAR(50),
    device_info TEXT,
    app_version VARCHAR(50),
    platform VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(100),
    user_agent TEXT
);
```

### Analytics APIs

#### 1. Track Event
**Endpoint**: `POST /api/analytics/track`

**Request Body**:
```json
{
  "eventName": "course_enrollment",
  "properties": "{\"courseId\": 1, \"courseName\": \"Mathematics\"}",
  "sessionId": "session_12345",
  "userId": 1,
  "userRole": "STUDENT",
  "deviceInfo": "iPhone 13",
  "appVersion": "1.0.0",
  "platform": "iOS",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

#### 2. Get Events by Session
**Endpoint**: `GET /api/analytics/session/{sessionId}`

#### 3. Get User Analytics
**Endpoint**: `GET /api/analytics/user/{userId}`

**Response**:
```json
{
  "totalEvents": 150,
  "recentEvents": [...],
  "eventsByType": {
    "page_view": 50,
    "course_enrollment": 10,
    "quiz_attempt": 25
  }
}
```

#### 4. Get Events by Name
**Endpoint**: `GET /api/analytics/event/{eventName}`

#### 5. Get Analytics Summary
**Endpoint**: `GET /api/analytics/summary`

**Response**:
```json
{
  "totalEvents": 5000,
  "eventsByType": {
    "page_view": 2000,
    "course_enrollment": 500,
    "quiz_attempt": 1000
  },
  "recentEvents": 250,
  "weeklyEvents": 1500
}
```

#### 6. Get Events in Date Range
**Endpoint**: `GET /api/analytics/range?start=2024-01-01T00:00:00&end=2024-01-31T23:59:59`

### Components Created

1. **AnalyticsEvent.java**: Entity class for analytics events
2. **AnalyticsEventRepository.java**: JPA repository with custom queries
3. **AnalyticsService.java**: Business logic for analytics processing
4. **AnalyticsController.java**: REST API endpoints
5. **AnalyticsEventRequest.java**: DTO for event tracking

## ⚙️ Configuration

### Application Properties

Update `src/main/resources/application.properties`:

```properties
# Razorpay Configuration
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET

# JWT Configuration
jwt.secret=yourSecretKeyHere
jwt.expiration=86400000
```

### Maven Dependencies

Added to `pom.xml`:

```xml
<!-- Razorpay -->
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.6</version>
</dependency>
```

## 🚀 Setup Instructions

### 1. Database Setup

Run the SQL migration scripts:

```bash
# Create payments table
mysql -u root -p OnlineCoachingInstitute < create_payments_table.sql

# Create analytics table
mysql -u root -p OnlineCoachingInstitute < create_analytics_table.sql
```

### 2. Razorpay Configuration

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API Key ID and Secret
3. Update `application.properties` with your credentials:
   ```properties
   razorpay.key.id=rzp_test_XXXXXXXXXXXXX
   razorpay.key.secret=XXXXXXXXXXXXXXXXXXXXX
   ```

### 3. Build and Run

```bash
cd online-coaching-system
mvn clean install
mvn spring-boot:run
```

### 4. Test the APIs

#### Test Login with User Type
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "userType": "student"
  }'
```

#### Test Payment Order Creation
```bash
curl -X POST http://localhost:8080/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseId": 1,
    "amount": 999.00,
    "currency": "INR",
    "planType": "FULL",
    "receipt": "receipt_123"
  }'
```

#### Test Analytics Event Tracking
```bash
curl -X POST http://localhost:8080/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "page_view",
    "sessionId": "session_12345",
    "userId": 1,
    "userRole": "STUDENT"
  }'
```

## 🔒 Security Considerations

1. **Razorpay Keys**: Never commit actual Razorpay keys to version control
2. **JWT Secret**: Use a strong, randomly generated secret in production
3. **Payment Verification**: Always verify payment signatures on the server
4. **Input Validation**: All inputs are validated through Spring Validation
5. **SQL Injection**: JPA/Hibernate prevents SQL injection attacks
6. **CORS**: Configure CORS properly for production domains

## 📝 API Documentation

### Base URL
`http://localhost:8080/api`

### Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Response Format
All APIs return JSON responses with consistent structure:
```json
{
  "data": { ... },
  "message": "Success message",
  "status": "SUCCESS"
}
```

## 🧪 Testing

### Unit Tests
Create test classes for:
- `PaymentServiceTest.java`
- `AnalyticsServiceTest.java`
- `AuthServiceTest.java`

### Integration Tests
Test the complete payment flow:
1. Create order
2. Process payment (mock Razorpay)
3. Verify payment
4. Check enrollment creation

## 🔄 Integration with Frontend

### Mobile App Integration

Update mobile app API calls:

1. **Login**: Include `userType` parameter
2. **Payment**: Use new payment endpoints
3. **Analytics**: Send events to analytics endpoint

### Frontend Integration

Update web frontend to:
1. Handle enhanced login response with user object
2. Integrate Razorpay checkout
3. Send analytics events

## 🐛 Troubleshooting

### Payment Issues
- **Order Creation Failed**: Check Razorpay credentials
- **Payment Verification Failed**: Verify signature generation
- **Refund Failed**: Check payment status before refunding

### Analytics Issues
- **Event Not Tracked**: Check database connection
- **Summary Empty**: Verify events are being tracked
- **Date Range Issues**: Check timestamp format

### Authentication Issues
- **Login Failed**: Check user type parameter
- **Token Invalid**: Verify JWT secret matches
- **Role Validation**: Check user role in database

## 📊 Monitoring

### Key Metrics to Monitor
- Payment success rate
- Average payment amount
- Event tracking volume
- API response times
- Error rates

### Logging
Enable detailed logging for:
- Payment processing
- Analytics events
- Authentication attempts
- API errors

## 🚀 Production Deployment

### Environment Variables
Set these in production:
```bash
RAZORPAY_KEY_ID=production_key_id
RAZORPAY_KEY_SECRET=production_key_secret
JWT_SECRET=strong_random_secret
DB_URL=production_database_url
```

### Database
- Use connection pooling
- Enable SSL for database connections
- Set up regular backups
- Configure read replicas for analytics queries

### Security
- Enable HTTPS
- Configure firewall rules
- Set up rate limiting
- Enable request logging
- Monitor for suspicious activity

## 📞 Support

For issues with:
- **Razorpay**: https://razorpay.com/docs/
- **Spring Boot**: https://spring.io/projects/spring-boot
- **Database**: Check MySQL documentation

---

**Note**: This backend implementation provides a complete foundation for the advanced features. Ensure proper testing before deploying to production.
