# Ethara.AI - Team Task Manager

Ethara.AI is a premium, minimalist full-stack task management platform designed for high-performance teams. It features a sleek, Apple-inspired UI and robust role-based access control.

## 🚀 Live Demo
**Frontend:** [Link to be added by user]
**Backend API:** [Link to be added by user]

## ✨ Features
- **Minimalist UI/UX:** Clean, distraction-free design built with Tailwind CSS v4.
- **Role-Based Access:** Specialized dashboards for Admins and Members.
- **Project Management:** Create, track, and manage workspace repositories.
- **Kanban Task Board:** Drag-and-drop task management (In development).
- **Theme Support:** Native Light/Dark mode with system persistence.
- **Secure Auth:** JWT-based authentication with protected routes.

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite 6, Tailwind CSS v4, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB, Mongoose.
- **Auth:** JSON Web Tokens (JWT), Bcrypt.js.
- **Deployment:** Railway (Mandatory).

## 📦 Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/astikgupta/Ethara.ai.git
cd Ethara.ai
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# PORT=5000
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Create a .env file with:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

## 📄 License
This project is for technical assessment purposes.
