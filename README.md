# Skillswitch

A full-stack application combining **React Native (Expo)** frontend and **Node.js (Express)** backend, designed to facilitate seamless skill-based connections and messaging.

## 🚀 Overview

Skillswitch enables users to register, explore profiles, initiate learning requests, chat, and manage their skill exchanges effortlessly.

## 🛠️ Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Node.js, Express
- **Database**: MongoDB (or your chosen DB)
- **Authentication**: JSON Web Tokens (JWT)
- **File Uploads**: Multer
- **Real-time Communication**: Socket.IO (if enabled)

## ✨ Features

- User registration & authentication  
- Profile creation with avatars and skill tags  
- Requesting skill exchanges  
- Real-time chat functionality  
- File/image uploads for profiles or messages  
- Notifications (if configured)  

## 📂 Project Structure

```

skillswitch/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
├── navigation/
├── screens/
├── assets/
└── App.js

````

## ⚡ Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm or Yarn
- MongoDB (local or Atlas)
- Expo CLI (for frontend development)

### Setup

1. **Clone the repository**
   bash
   git clone https://github.com/sivadarshinisankar07/skillswitch.git
   cd skillswitch
   

2. **Install dependencies**

   bash
   cd backend
   npm install
   cd ../frontend
   npm install


3. **Environment variables**

   * Create `.env` inside `backend/`:

     env
     DATABASE_URL=your_db_url
     JWT_SECRET=your_secret
     
   * Create `.env` inside `frontend/`:

     env
     API_URL=http://localhost:5000
     

4. **Run the app**

   * Backend:

     bash
     cd backend
     npm run dev
     
   * Frontend:

     bash
     cd frontend
     expo start
     

## 🎮 Usage

* Register or log in
* Build or update your profile
* Browse other users and send learning requests
* Start chatting via the built-in messaging system

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add some feature"`)
4. Push to your branch (`git push origin feature-name`)
5. Open a pull request

## 📜 License

This project is licensed under the [MIT License](LICENSE).



---

⚡ This is clean, professional, and GitHub-ready — you can **paste it directly into `README.md`**.  

Do you want me to also make a **short GitHub profile-style description** (like a one-liner for the repo top header)?


