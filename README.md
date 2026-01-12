# Recipe Generator

A full-stack MERN (MongoDB, Express, React, Node.js) application for generating and managing recipes with user authentication.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm

## Setup Instructions

### 1. Install Dependencies

```bash
npm run install-all
```

Or manually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables

Create `.env` files from the examples:

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/recipe
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

Make sure MongoDB is running locally:
```bash
mongod
```

Or use MongoDB Atlas (free cloud database):
1. Sign up at https://cloud.mongodb.com
2. Create a cluster
3. Get your connection string
4. Update `MONGO_URI` in `backend/.env`

### 4. Run the Application

**Option 1: Run both servers together**
```bash
npm run dev
```

**Option 2: Run separately**

Backend (in one terminal):
```bash
cd backend
npm start
```

Frontend (in another terminal):
```bash
cd frontend
npm start
```

The app will open at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
├── backend/
│   ├── models/          # Mongoose models (User, Recipe)
│   ├── server.js        # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── config.js    # API configuration
│   │   └── App.js
│   ├── package.json
│   └── .env.example
├── package.json         # Root package with scripts
└── .gitignore

```

## Features

- User signup and login with JWT authentication
- Password hashing with bcryptjs
- Recipe search using Spoonacular API
- Save and manage favorite recipes
- Security features (helmet, rate limiting, CORS)

## Security Features

- **Helmet.js**: Adds security headers
- **Rate Limiting**: Prevents spam/brute force (5 login attempts per 15 min)
- **CORS**: Configured to allow only specified origins
- **JWT**: Secure token-based authentication
- **Password Hashing**: Passwords encrypted with bcryptjs

## Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check your `MONGO_URI` in backend/.env
- For Atlas: Whitelist your IP address

**CORS Error:**
- Verify `ALLOWED_ORIGINS` in backend/.env includes `http://localhost:3000`

**Port Already in Use:**
- Change `PORT` in backend/.env to a different number
- Update `REACT_APP_API_URL` in frontend/.env accordingly

**JWT Secret Error:**
- Make sure `JWT_SECRET` is set in backend/.env
- Should be at least 32 characters long

## Available Scripts

```bash
npm run install-all    # Install all dependencies
npm run dev           # Run both frontend and backend
npm run dev:backend   # Run only backend
npm run dev:frontend  # Run only frontend
npm run build         # Build frontend for production
```

## API Endpoints

- `POST /api/signup` - Register new user
- `POST /api/login` - Login user
- `GET /api/recipes` - Get all saved recipes
- `POST /api/recipes` - Save a recipe
- `DELETE /api/recipes/:id` - Delete a recipe
- `GET /health` - Health check

## Notes

- Never commit `.env` files to version control
- Keep your JWT secret secure
- The Spoonacular API key in Recipe.js should be replaced with your own
