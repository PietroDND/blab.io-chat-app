# Blab.io 🗨️  
A real-time chat application built with the MERN stack.

## 🚀 About the Project

**Blab.io** is a real-time chat platform developed using the **MERN stack** (MongoDB, Express.js, React, Node.js). It enables users to engage in one-on-one or group conversations with real-time updates powered by **Socket.IO**.  
It features user authentication, media uploads, theme switching, and basic profile management — with many more features i'm planning to implement soon.

## 📸 Screenshots

![Blab.io UI](/blab-preview.png)

## ✨ Features

- 🧑‍🤝‍🧑 **One-on-one chat**: Select any registered user and start chatting instantly.
- 👥 **Group chats**: Create and leave group conversations, update group names and pictures.
- 🖼️ **Media uploads**: Store profile pictures and chat images on **Cloudinary**.
- 🔒 **Authentication**: Handled securely with **JWT** and **bcrypt**.
- 🧑 **User profile editing**: Change your username and avatar.
- 🌗 **Theme support**: Toggle between light and dark mode.
- ⚡ **Real-time messaging**: All chats are updated live using **Socket.IO**.
- 🟢 **Online status indicators**: See who’s online in real time.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, DaisyUI, socket.IO client
- **Backend**: Node.js, Express.js, Socket.IO server
- **Database**: MongoDB (Mongoose)
- **Media Hosting**: Cloudinary
- **Authentication**: JWT (JSON Web Tokens), bcrypt

## 🔮 Roadmap

- ✅ Group chats implementation
- ✅ Toast notification system for messages
- 🔜 Friends list (chat only with approved contacts)
- 🔜 Group admin features (add/remove/promote/demote users)
- 🔜 Fully responsive UI for mobile and tablet
- 🔜 Message read receipts & typing indicators
- 🔜 Browser Push Notifications (Web Notifications API)

## 🔧 Environment Variables

### Backend (`.env`)
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_BASE_URL=http://localhost:3000
```


## 📂 Getting Started

To run this project locally:

```bash
git clone https://github.com/yourusername/blab.io.git
cd blab.io
npm install
npm run dev
```

## 📄 Credit

This project is based on [fullstack-chat-app](https://github.com/burakorkmez/fullstack-chat-app) by [burakorkmez](https://github.com/burakorkmez).  
The original project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

Significant modifications have been made, including new features, changes to core logic, and UI adjustments, to develop a customized version tailored to my own goals and use cases.
