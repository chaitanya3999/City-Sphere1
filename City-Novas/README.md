# City Novas Authentication Setup

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

## Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server
- Development mode:
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

## Authentication Flow
- Signup: POST to `/api/signup`
  - Requires: `phoneEmail`, `password`, `name`
- Login: POST to `/api/login`
  - Requires: `phoneEmail`, `password`

## Notes
- This is an in-memory authentication system
- Replace with a proper database in production
- Use HTTPS and secure environment variables in production
