# Faisal Qura'anic Memorization Center - School Management System

A comprehensive school management system for Faisal, His Parents and Family's Qura'anic Memorization Center.

## Features

- **Student Management**: Complete CRUD operations with automated ID generation (STU-YYYY-XXXX), attendance tracking, and parent information
- **Teacher Management**: Manage teacher profiles, qualifications, schedules with automated ID generation (TCH-YYYY-XXXX)
- **Halqa Management**: Create and manage study circles (Halqas), assign teachers and students to halqas, schedule management
- **Quran Progress Tracking**: Track memorization progress, surahs, ayahs, and grades with detailed progress reports
- **Fee Management**: Handle tuition fees, payments, and financial records in Gambian Dalasi (GMD)
- **Withdrawal Management**: Track expenses and withdrawals with categories, approval workflow, and financial reporting
- **Reports & Analytics**: Comprehensive reports for students, fees, attendance, Quran progress, and financial summaries
- **Notifications System**: Real-time notifications for all users with read/unread status
- **Role-Based Access Control**: Admin, Teacher, and Accountant roles with appropriate permissions
- **Modern UI**: Colorful, responsive design with React Icons, mobile-friendly navigation
- **Automated ID Generation**: Student and Teacher IDs are automatically generated
- **Currency Support**: All financial amounts displayed in Gambian Dalasi (GMD)

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

### Withdrawals
- `GET /api/withdrawals` - Get all withdrawals (with filters)
- `GET /api/withdrawals/:id` - Get withdrawal by ID
- `POST /api/withdrawals` - Create withdrawal (Admin/Accountant)
- `PUT /api/withdrawals/:id` - Update withdrawal (Admin/Accountant)
- `DELETE /api/withdrawals/:id` - Delete withdrawal (Admin only)
- `GET /api/withdrawals/summary/totals` - Get withdrawal summary

### Halqas
- `GET /api/halqas` - Get all halqas (with search/filter)
- `GET /api/halqas/:id` - Get halqa details
- `POST /api/halqas` - Create halqa (Admin only)
- `PUT /api/halqas/:id` - Update halqa (Admin only)
- `DELETE /api/halqas/:id` - Delete halqa (Admin only)
- `POST /api/halqas/:id/students` - Add students to halqa
- `DELETE /api/halqas/:id/students/:studentId` - Remove student from halqa

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

## Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md) - Vercel-specific deployment guide
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines
- [Changelog](./CHANGELOG.md) - Version history

## Support

For issues, questions, or contributions, please:
- Open an issue on GitHub
- Check existing documentation
- Review API documentation for integration help

## License

This project is proprietary software for Faisal Qura'anic Memorization Center.

See [LICENSE](./LICENSE) for details.

