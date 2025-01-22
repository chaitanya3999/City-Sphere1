# City Sphere Custom Database System

## Overview
City Sphere uses a custom backend with SQLite, providing a lightweight, file-based database solution with robust authentication and user management.

## Features
- Custom Express.js backend
- SQLite database
- JWT-based authentication
- Secure password hashing
- User profile management

## Database Schema
### Users Table
- id (Primary Key)
- name
- email
- password (hashed)
- phone
- address
- workplace
- profile_picture
- services
- created_at

### User Preferences Table
- user_id (Foreign Key)
- transport_preferences
- city_interests
- family_members

## Authentication Flow
1. User Registration
2. Password Hashing
3. JWT Token Generation
4. Secure API Endpoints

## Setup Instructions
1. Install Dependencies
   ```bash
   npm install
   ```

2. Start Development Server
   ```bash
   npm run dev
   ```

3. Production Build
   ```bash
   npm run build
   ```

## Security Measures
- Bcrypt password hashing
- JWT token authentication
- CORS protection
- Input validation

## API Endpoints
- POST /api/signup
- POST /api/login
- GET /api/profile
- PUT /api/profile

## Recommended Improvements
- Implement rate limiting
- Add more robust input validation
- Create database migration scripts
- Implement refresh token mechanism
