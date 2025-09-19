# ChronicalX - Modern Blog Platform

A full-stack blog platform built with React, Node.js, Express, and MongoDB. Features user authentication, post management, comments, likes, and modern UI design.

## 🚀 Features

- **User Authentication**: Register, login, logout with JWT
- **Google OAuth**: Sign in with Google account
- **Post Management**: Create, read, update, delete blog posts
- **Comments System**: Add, edit, delete comments on posts
- **Like System**: Like/unlike posts with real-time updates
- **Image Upload**: Cover images for posts using Cloudinary
- **Responsive Design**: Professional, mobile-friendly UI
- **User Profiles**: Manage user profiles and account settings
- **Tag System**: Organize posts with tags
- **Modern UI**: Clean, professional design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image hosting
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
ChronicalX/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── api/           # API configuration
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── utilities/        # Helper functions
│   ├── db/              # Database connection
│   └── app.js           # Express app
├── scripts/             # Utility scripts
│   └── createTestAccounts.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ChronicalX.git
   cd ChronicalX
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd ../server
   cp .env.example .env
   ```
   
   Edit the `.env` file with your actual values:
   ```env
   MONGODB_URL=mongodb://localhost:27017/chronicalx
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   CLIENT_URL=http://localhost:3000
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `POST /api/user/logout` - Logout user
- `POST /api/user/google-auth` - Google OAuth

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Toggle like on post

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments/post/:postId` - Add comment to post
- `PUT /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/delete-account` - Delete user account

## 🧪 Testing Data

Use the test account creation script to populate your database:

```bash
cd scripts
npm install
npm run create-accounts
```

This creates 20 test accounts with the password `123456`.

## 🎨 UI Design

The application features a professional, modern design with:
- Clean, minimalist interface
- Responsive grid layouts
- Professional color scheme (slate/gray palette)
- Smooth transitions and hover effects
- Mobile-friendly design
- Accessible components

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Input validation
- CORS configuration
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🚢 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Set environment variables in deployment platform

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set up MongoDB Atlas for production database
2. Configure environment variables
3. Deploy the server folder
4. Update CORS settings for production URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**ChronicalX Team**

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Tailwind CSS for the styling system
- All the open-source contributors

---

**Happy Blogging! 🎉**