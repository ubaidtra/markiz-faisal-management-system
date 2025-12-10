# API Documentation

Base URL: `http://localhost:7000/api` (development) or `https://your-domain.com/api` (production)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### POST /api/auth/login
Login and get authentication token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "name": "Admin User",
    "role": "admin",
    "email": "admin@example.com"
  }
}
```

### GET /api/auth/me
Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "admin",
  "name": "Admin User",
  "role": "admin",
  "email": "admin@example.com"
}
```

## Students

### GET /api/students
Get all students with optional filters.

**Query Parameters:**
- `status` - Filter by status (active, inactive, graduated)
- `class` - Filter by class
- `search` - Search by name or student ID

**Example:** `GET /api/students?status=active&search=ahmad`

### GET /api/students/:id
Get student by ID.

### POST /api/students
Create a new student. Student ID is automatically generated.

**Request Body:**
```json
{
  "firstName": "Ahmad",
  "lastName": "Faisal",
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "address": "Sotokou Layout",
  "phone": "+2201234567",
  "email": "ahmad@example.com",
  "parentName": "Mohammed Faisal",
  "parentPhone": "+2207654321",
  "parentEmail": "mohammed@example.com",
  "class": "Level 1",
  "status": "active"
}
```

**Response:** Student object with auto-generated `studentId` (e.g., `STU-2025-0001`)

### PUT /api/students/:id
Update student information.

### DELETE /api/students/:id
Delete a student.

### GET /api/students/:id/attendance
Get student attendance records.

## Teachers

### GET /api/teachers
Get all teachers with optional filters.

**Query Parameters:**
- `status` - Filter by status (active, inactive)
- `search` - Search by name or teacher ID

### GET /api/teachers/:id
Get teacher by ID.

### POST /api/teachers
Create a new teacher. Teacher ID is automatically generated.

**Request Body:**
```json
{
  "firstName": "Ibrahim",
  "lastName": "Said",
  "dateOfBirth": "1985-03-20",
  "gender": "male",
  "phone": "+2201234567",
  "email": "ibrahim@example.com",
  "qualification": "Hafiz",
  "specialization": "Tajweed",
  "salary": 5000,
  "status": "active"
}
```

**Response:** Teacher object with auto-generated `teacherId` (e.g., `TCH-2025-0001`)

### PUT /api/teachers/:id
Update teacher information.

### DELETE /api/teachers/:id
Delete a teacher.

## Halqas

### GET /api/halqas
Get all halqas with optional search.

**Query Parameters:**
- `search` - Search by halqa name

### GET /api/halqas/:id
Get halqa details with populated teacher and students.

### POST /api/halqas
Create a new halqa (Admin only).

**Request Body:**
```json
{
  "name": "Morning Halqa",
  "description": "Morning study circle",
  "teacher": "507f1f77bcf86cd799439011",
  "students": ["507f1f77bcf86cd799439012"],
  "schedule": {
    "days": ["Monday", "Wednesday", "Friday"],
    "startTime": "08:00",
    "endTime": "10:00"
  },
  "location": "Main Hall",
  "maxStudents": 30,
  "status": "active"
}
```

### PUT /api/halqas/:id
Update halqa (Admin only).

### DELETE /api/halqas/:id
Delete halqa (Admin only).

### POST /api/halqas/:id/students
Add students to halqa.

**Request Body:**
```json
{
  "studentIds": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
}
```

### DELETE /api/halqas/:id/students/:studentId
Remove student from halqa.

## Quran Progress

### GET /api/quran-progress
Get all Quran progress records.

**Query Parameters:**
- `studentId` - Filter by student
- `status` - Filter by status (memorized, in-progress, under-review)

### POST /api/quran-progress
Create progress record.

**Request Body:**
```json
{
  "student": "507f1f77bcf86cd799439011",
  "surah": "Al-Fatiha",
  "fromAyah": 1,
  "toAyah": 7,
  "status": "memorized",
  "grade": "A",
  "notes": "Excellent memorization"
}
```

### GET /api/quran-progress/student/:studentId/summary
Get student's Quran progress summary.

## Fees

### GET /api/fees
Get all fee records.

**Query Parameters:**
- `studentId` - Filter by student
- `status` - Filter by status (paid, pending, overdue)

### POST /api/fees
Create fee record.

**Request Body:**
```json
{
  "student": "507f1f77bcf86cd799439011",
  "amount": 500,
  "dueDate": "2025-02-01",
  "description": "Monthly tuition fee"
}
```

### GET /api/fees/student/:studentId/summary
Get student's fee summary.

## Withdrawals

### GET /api/withdrawals
Get all withdrawals with filters.

**Query Parameters:**
- `status` - Filter by status (pending, approved, rejected)
- `category` - Filter by category (salary, utilities, maintenance, supplies, transport, other)
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `search` - Search by description, recipient, or receipt number

### POST /api/withdrawals
Create withdrawal (Admin/Accountant only).

**Request Body:**
```json
{
  "amount": 1000,
  "category": "salary",
  "description": "Teacher salary payment",
  "paymentMethod": "bank-transfer",
  "recipient": "Ibrahim Said",
  "receiptNumber": "REC-001",
  "date": "2025-01-15",
  "notes": "Monthly salary"
}
```

### PUT /api/withdrawals/:id
Update withdrawal (Admin/Accountant only). Can approve/reject.

### DELETE /api/withdrawals/:id
Delete withdrawal (Admin only).

### GET /api/withdrawals/summary/totals
Get withdrawal summary totals.

## Reports

### GET /api/reports/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "totalStudents": 150,
  "totalTeachers": 10,
  "todayAttendance": 120,
  "totalFees": 75000,
  "totalPaid": 60000,
  "totalPending": 15000,
  "totalWithdrawals": 40000,
  "netBalance": 20000,
  "totalMemorized": 50,
  "inProgress": 30
}
```

### GET /api/reports/fees
Get fee reports with optional date range.

**Query Parameters:**
- `startDate` - Start date filter
- `endDate` - End date filter

### GET /api/reports/withdrawals
Get withdrawal reports with optional date range.

### GET /api/reports/attendance
Get attendance reports.

### GET /api/reports/quran-progress
Get Quran progress reports.

## Notifications

### GET /api/notifications
Get all notifications for current user.

### GET /api/notifications/unread
Get unread notification count.

### POST /api/notifications
Create notification (Admin only).

**Request Body:**
```json
{
  "title": "New Student Registered",
  "message": "A new student has been registered",
  "type": "info",
  "recipients": ["all"] // or specific user IDs
}
```

### PUT /api/notifications/:id/read
Mark notification as read.

### PUT /api/notifications/read-all
Mark all notifications as read.

## Health Check

### GET /api/health
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "environment": "production"
}
```

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## Pagination

Most list endpoints support pagination (to be implemented):
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

