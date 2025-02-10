# Personal Finance AI Tracker

A modern, AI-powered personal finance tracking application built with React.js, Node.js, Python, MongoDB, and Firebase.

## Technology Stack

### Frontend
- React.js with Hooks
- Context API for state management
- Tailwind CSS for styling
- Responsive Design principles
- Material-UI components

### Backend
- Node.js Express API
- Python FastAPI for AI services
- MongoDB for data storage
- Firebase Authentication
- RESTful API architecture

### AI/ML Components
- Expense Prediction Model
- User Spending Pattern Clustering
- Personalized Financial Recommendations
- Budget Optimization

## Project Timeline

### Week 1-2: Project Setup & Initial Architecture
- Repository structure setup
- Development environment configuration
- Basic CI/CD pipeline implementation
- Authentication flow setup

### Week 3-4: Core Feature Development
- User dashboard implementation
- Transaction management
- Budget tracking system
- Basic reporting features

### Week 5-6: AI/ML Model Integration
- Expense prediction model deployment
- Spending pattern analysis
- Initial recommendation engine
- Model training pipeline

### Week 7-8: Testing & Refinement
- Unit and integration testing
- Performance optimization
- Security auditing
- User feedback implementation

## Development Workflow

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- MongoDB
- Docker
- Firebase account

### Getting Started
1. Clone the repository
```bash
git clone [repository-url]
cd finance-ai-tracker
```

2. Install Dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install

# AI Service
cd ../ai_service
pip install -r requirements.txt
```

3. Configure Environment Variables
```bash
# Create .env files in client, server, and ai_service directories
cp .env.example .env
```

4. Start Development Servers
```bash
# Using Docker
docker-compose up

# Or manually:
# Frontend (http://localhost:3000)
cd client
npm start

# Backend (http://localhost:5000)
cd server
npm run dev

# AI Service (http://localhost:8000)
cd ai_service
uvicorn main:app --reload
```

## Continuous Integration

### Automated Testing
- Jest for frontend and backend unit tests
- Pytest for AI service testing
- Integration tests using Supertest

### Code Quality
- ESLint for JavaScript/TypeScript
- Black for Python
- SonarQube for code quality analysis

### Security
- GitHub Security scanning
- Dependency vulnerability checks
- Authentication and authorization testing

## API Documentation

Detailed API documentation is available at:
- Backend API: `/api/docs`
- AI Service: `/ai/docs`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Architecture

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/      # React Context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   └── services/     # API integration
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic
│
├── ai_service/           # Python AI/ML service
│   ├── models/          # ML models
│   ├── services/        # AI services
│   └── utils/           # Helper functions
│
└── docker/              # Docker configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Backend Implementation Details

### Project Structure

```
webapp/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/        # Page components
│       ├── context/      # React context providers
│       ├── hooks/        # Custom React hooks
│       └── config/       # Configuration files
├── server/                # Node.js backend
│   └── src/
│       ├── models/       # MongoDB models
│       ├── routes/       # API routes
│       ├── middleware/   # Custom middleware
│       └── index.js      # Server entry point
└── ai_service/           # Python AI service
```

### Technology Stack

#### Backend
- **Node.js & Express**: Server framework
- **MongoDB**: Database
- **Mongoose**: MongoDB ODM
- **Firebase Admin**: Server-side authentication
- **Security Packages**:
  - Helmet: Security headers
  - CORS: Cross-origin resource sharing
  - Morgan: HTTP request logger

### Features

#### Authentication
- Email/Password authentication using Firebase
- Protected routes
- User profile management

#### Transaction Management
- Create, read, update, delete transactions
- Categorize transactions
- Add tags and notes
- Filter and search functionality
- Transaction statistics

#### Budget Management
- Set category-wise budgets
- Monthly and yearly budget periods
- Budget progress tracking
- Notification settings for budget thresholds

#### User Preferences
- Currency settings
- Theme preferences
- Notification settings

### API Endpoints

#### Authentication
- `GET /api/auth/profile`: Get user profile
- `PUT /api/auth/profile`: Update user profile
- `PUT /api/auth/budget`: Update monthly budget

#### Transactions
- `GET /api/transactions`: Get all transactions
- `POST /api/transactions`: Create new transaction
- `PUT /api/transactions/:id`: Update transaction
- `DELETE /api/transactions/:id`: Delete transaction
- `GET /api/transactions/stats`: Get transaction statistics

#### Budgets
- `GET /api/budgets`: Get all budgets
- `POST /api/budgets`: Create new budget
- `PUT /api/budgets/:id`: Update budget
- `DELETE /api/budgets/:id`: Delete budget
- `GET /api/budgets/:id/progress`: Get budget progress

### Models

#### User
- Email (unique)
- Firebase UID
- Display Name
- Preferences (currency, theme)
- Monthly Budget
- Notification Settings

#### Transaction
- User ID (reference)
- Type (income/expense)
- Category
- Amount
- Description
- Date
- Tags
- Recurring settings
- Location

#### Budget
- User ID (reference)
- Category
- Amount
- Period (monthly/yearly)
- Start/End Dates
- Notification Settings
- Notes

### Setup Instructions

#### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Firebase project
- Python 3.8+ (for AI service)

#### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   npm install
   ```
2. Create `.env` file with Firebase config
3. Start development server:
   ```bash
   npm start
   ```

#### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   npm install
   ```
2. Create `.env` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Development Workflow

1. Create feature branch
2. Implement changes
3. Write tests
4. Create pull request
5. Code review
6. Merge to main

### Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

### License

This project is licensed under the MIT License.
