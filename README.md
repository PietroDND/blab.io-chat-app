# Blab.io 🗨️  
A real-time chat application built with the MERN stack.

🚧 **Note:** This is an early version of Blab.io. The UI is currently optimized for desktop only and may not display correctly on mobile devices. Mobile responsiveness improvements are planned for a future update.

## 🚀 About the Project

**Blab.io** is a real-time chat platform developed using the **MERN stack** (MongoDB, Express.js, React, Node.js). It enables users to engage in one-on-one or group conversations with real-time updates powered by **Socket.IO**.  
It features user authentication, media uploads, theme switching, and basic profile management — with many more features i'm planning to implement soon.

**Try it live:** [https://blab-io-chat-app.onrender.com/](https://blab-io-chat-app.onrender.com/)

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
- ✅ Toast notifications system for messages
- 🔜 Fully responsive UI for mobile and tablet
- 🔜 Group admin features besides adding users (remove/promote/demote)
- 🔜 Message read receipts & typing indicators
- 🔜 Friends list (chat only with approved contacts)
- 🔜 Browser Push Notifications (Web Notifications API)

## Known Issues

- **[Major] New Group Members Not Reflected in Real Time**: When a group admin adds a user to a group, existing group members must reload the page to:
  - See the new user(s) in the chat info box
  - Receive real-time messages from them
  This is a high-priority bug affecting group chat consistency
- **Mobile Optimization**: The interface is not currently optimized for mobile devices and may have layout or usability issues on smaller screens.
- **Chat Info Box Image Sync**: New images in the chat info box don't appear until you close and reopen the chat.
- **Notification Stack**: Notifications do not disappear after being clicked, and continue to stack. This can eventually cover the entire screen if messages arrive in rapid succession.
- **Chat Sorting on Update**: When the page is initially loaded, chats in the sidebar are sorted correctly. However, when new messages arrive dynamically, the order isn't updated, and newer chats can appear below inactive ones.
- **Emoji Picker Theme Color Inconsistency**: The emoji picker follows the app's current theme (light/dark), but its color tones are slightly different from the app’s main theme shades.


## 📂 Getting Started

To run this project locally, make sure you have the following prerequisites:

- A running **MongoDB** instance or a MongoDB URI (e.g. from MongoDB Atlas)
- A **Cloudinary** account with API credentials for media uploads

You’ll need to create `.env` files in both backend and frontend directories with the required environment variables (see below).

Then, clone the repo and install dependencies:

```bash
git clone https://github.com/PietroDND/blab.io-chat-app.git
cd blab.io-chat-app
npm install
npm run build
npm run start
cd frontend
npm run dev
```

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

## 📄 Credit

This project is based on [fullstack-chat-app](https://github.com/burakorkmez/fullstack-chat-app) by [burakorkmez](https://github.com/burakorkmez).  
The original project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

Significant modifications have been made, including new features, changes to core logic, and UI adjustments, to develop a customized version tailored to my own goals and use cases.
