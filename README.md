# 🚀 X Clone (Twitter Clone) – Full-Stack MERN Application

A modern, production-ready **X (formerly Twitter) clone** built using the **MERN stack**, designed with scalability, performance, and real-world deployment best practices in mind.  
The application is fully deployed on **Render** and mirrors core social media functionalities end-to-end.

---

## 🌐 Live Deployment

- **Live App**: https://x-social-qldo.onrender.com  
- **Status**: ✅ Production Ready  
- **Hosting**: Render (Frontend + Backend)

---

## 🧩 Tech Stack

### Frontend
- React (Vite)
- React Router
- TanStack React Query
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- Bcrypt.js
- Cookie-based Auth
- Cloudinary (Media Uploads)

### DevOps / Tooling
- Render (Deployment)
- dotenv (Environment Management)
- CORS Configuration (Production Safe)
- Git & GitHub

---

## ✨ Core Features

- 🔐 User Authentication (Signup / Login / Logout)
- 🧵 Create, Like & Delete Posts
- 🔁 Follow / Unfollow Users
- 🖼️ Profile Image & Cover Image Upload
- 🔔 Notifications System
- 🍪 Secure JWT + HTTP-only Cookies
- ⚡ Optimized API Calls with React Query
- 📦 Production Build with Static Serving
- 🌍 Fully Deployed & CORS-Safe

---

## 🏗️ Project Structure
```
X-CLONE/
│
├── backend/
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── db/
│ ├── middleware/
│ └── server.js
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── dist/ (production build)
│
├── .env
├── package.json
└── README.md
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production

▶️ Running Locally
1️⃣ Clone the Repository
git clone https://github.com/your-username/x-clone.git
cd x-clone

2️⃣ Install Dependencies
npm install

3️⃣ Build Frontend
npm run build

4️⃣ Start the App
npm start


App will run on:
http://localhost:5000
