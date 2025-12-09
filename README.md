# Faisal Qura'anic Memorization Center - School Management System

A comprehensive school management system for Faisal, His Parents and Family's Qura'anic Memorization Center.

## Features

- **Student Management**: Complete CRUD operations for student records, attendance tracking
- **Teacher Management**: Manage teacher profiles, qualifications, and schedules
- **Quran Progress Tracking**: Track memorization progress, surahs, ayahs, and grades
- **Fee Management**: Handle tuition fees, payments, and financial records
- **Reports & Analytics**: Comprehensive reports for students, fees, attendance, and Quran progress
- **Notifications System**: Real-time notifications for all users
- **Role-Based Access**: Admin, Teacher, and Accountant roles with appropriate permissions

## Technology Stack

- **Frontend**: React.js with React Router
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository or navigate to the project directory

2. Install root dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Set up environment variables:

Create a `.env` file in the `backend` directory:
```
PORT=7000
MONGODB_URI=mongodb+srv://ubaidttech_db_user:tra%40tech.281986@cluster0.lxszwnk.mongodb.net/faisal-center?appName=Cluster0
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

Create a `.env` file in the `frontend` directory:
```
REACT_APP_API_URL=http://localhost:7000/api
```

6. Start MongoDB (if running locally):
```bash
mongod
```

7. Seed initial users:
```bash
cd backend
npm run seed
```

This will create default users:
- **Admin**: username: `admin`, password: `admin123`
- **Teacher**: username: `teacher`, password: `teacher123`
- **Accountant**: username: `accountant`, password: `accountant123`

## Running the Application

### Development Mode

From the root directory, run:
```bash
npm run dev
```

This will start both the backend server (port 7000) and frontend development server (port 3000).

### Separate Servers

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm start
```

## Project Structure

```
.
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── scripts/         # Seed scripts
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static files (logo, favicon, banner)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components
│   │   └── App.js       # Main app component
│   └── package.json
└── package.json         # Root package.json

```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/:id/attendance` - Get student attendance

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Quran Progress
- `GET /api/quran-progress` - Get all progress records
- `POST /api/quran-progress` - Create progress record
- `PUT /api/quran-progress/:id` - Update progress record
- `DELETE /api/quran-progress/:id` - Delete progress record
- `GET /api/quran-progress/student/:studentId/summary` - Get student summary

### Fees
- `GET /api/fees` - Get all fees
- `POST /api/fees` - Create fee record
- `PUT /api/fees/:id` - Update fee record
- `DELETE /api/fees/:id` - Delete fee record
- `GET /api/fees/student/:studentId/summary` - Get student fee summary

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/students` - Student reports
- `GET /api/reports/fees` - Fee reports
- `GET /api/reports/attendance` - Attendance reports
- `GET /api/reports/quran-progress` - Quran progress reports

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread` - Get unread count
- `POST /api/notifications` - Create notification (Admin only)
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## User Roles

- **Admin**: Full access to all features
- **Teacher**: Access to students, Quran progress, reports, and notifications
- **Accountant**: Access to fees, reports, and notifications

## Branding

The system uses the following branding assets:
- `logo.jpg` - Main logo displayed in navigation and login page
- `favicon.ico` - Browser tab icon
- `banner.jpg` - Banner image on home/about page

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options:

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel
```

**Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**Docker:**
```bash
docker-compose up -d
```

### Build for Production:

```bash
# Build all
npm run build:all

# Or separately
npm run build:backend  # Backend dependencies
npm run build          # Frontend build
```

### Environment Variables:

See `DEPLOYMENT.md` for complete environment variable setup. Generate secrets:
```bash
cd backend
node scripts/generate-secrets.js
```

## License

This project is proprietary software for Faisal Qura'anic Memorization Center.

