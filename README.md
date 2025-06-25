# 🍽️ Recipe Generator App

A full-stack Recipe Generator application built using **React**, **Node.js**, **Express**, and **MongoDB**. This app allows users to **sign up, log in, save favorite recipes**, and manage their personal collection.

---

## 🌟 Features

### 🔐 Authentication
- User Signup & Login
- Secure password hashing with bcrypt
- JWT-based authentication

### 🍲 Recipe Management
- Save, view, and delete recipes
- Recipes linked to logged-in user

### 🖥️ Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React, React Router | Node.js, Express | MongoDB (via Mongoose) |

---



---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js
- MongoDB
- npm or yarn

### ⚙️ Setup Instructions

#### Backend

```bash
# Go to backend folder
cd backend

# Install dependencies
npm install

# (Optional) Create .env file
echo "MONGO_URI=mongodb://localhost:27017/recipe" >> .env
echo "JWT_SECRET=your_jwt_secret" >> .env

# Run server
npm start
```
#### Frontend

```bash

# Go to frontend folder
cd frontend

# Install dependencies
npm install

# Run React app
npm start
```

![recipefinder](https://github.com/user-attachments/assets/c8166ec7-1a65-44b2-9195-7af0c8897e60)


