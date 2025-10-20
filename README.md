# Innomate

A platform for connecting innovators and managing user skills and preferences.

## Setup Instructions

1. Install MongoDB on your system if you haven't already
2. Clone this repository
3. Install dependencies:
```bash
npm install
```
4. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/innomate
JWT_SECRET=your_super_secret_jwt_key_2024
PORT=5000
```
5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Public Routes
- POST `/api/auth/signup` - Create a new user account
- POST `/api/auth/login` - Login to existing account

### Protected Routes (Require Authentication)
- PUT `/api/auth/preferences` - Update user preferences
- GET `/api/auth/profile` - Get user profile
- GET `/api/auth/verify` - Verify authentication token

## Database Schema

### User Model
- Basic Information:
  - fullname
  - email
  - password (hashed)
- Skills Array
- Preferences:
  - Selected Categories
  - Interests
  - Experience Level
- Profile:
  - Bio
  - Avatar
  - Location
  - Social Links
- System Fields:
  - isOnboarded
  - lastLogin
  - createdAt
  - updatedAt

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer your_token_here
``` 