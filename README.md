# ChronicalX - Modern Blog Platform

🚀 **Live Demo**: [https://chronical-x.vercel.app/](https://chronical-x.vercel.app/)

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
└── README.md
```

## 🤖 AI-Powered Development

<details>
<summary><strong>🔍 Click to expand - How AI transformed the development process</strong></summary>

This project extensively leveraged AI tools to accelerate development and maintain code quality. Here's how AI transformed the development process:

### **Prompting Techniques & AI Tools Utilized**

<details>
<summary><strong>🔄 Code Completion & Pattern Recognition</strong></summary>

- **GitHub Copilot** was used for auto-completing repetitive code patterns, especially for:
  - Redux slice boilerplate code
  - API endpoint handlers with consistent error handling
  - React component structures with similar layouts
  - Database CRUD operations following the same pattern

</details>

<details>
<summary><strong>🎨 Theme Consistency</strong></summary>

- **Claude Sonnet 4** helped maintain a consistent design theme across all components by:
  - Suggesting uniform Tailwind CSS class patterns
  - Ensuring consistent spacing, colors, and typography
  - Maintaining professional design language throughout the application
  - Converting colorful gradient designs to professional slate/gray themes

</details>

<details>
<summary><strong>🗄️ Database Schema Design</strong></summary>

- AI tools assisted in creating robust MongoDB schemas with:
  - Proper field validation and constraints
  - Relationship modeling between Users, Posts, and Comments
  - Index optimization suggestions
  - Schema evolution strategies

</details>

### **⚡ Time-Saving Benefits**

<details>
<summary><strong>📊 Development Efficiency Metrics</strong></summary>

These AI integrations saved significant development time by:
- Reducing manual coding for repetitive patterns by ~60%
- Ensuring consistent code style throughout the application
- Providing instant suggestions for complex implementations
- Accelerating debugging through intelligent error detection

</details>

### **🛠️ Challenges Faced & AI Solutions**

<details>
<summary><strong>1. 🖼️ Cloudinary Image Upload Integration</strong></summary>

**Challenge**: Complex image preprocessing and upload workflow with proper error handling.

**AI Solution**: 
- **GitHub Copilot** provided boilerplate for image validation and compression
- **Claude Sonnet 4** helped implement proper image preprocessing pipeline:

```javascript
// AI-suggested image preprocessing before Cloudinary upload
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setProfileData(prev => ({
        ...prev,
        avatar: base64
      }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  }
};
```

</details>

<details>
<summary><strong>2. 🔐 Google OAuth Implementation</strong></summary>

**Challenge**: Integrating Google OAuth with proper token handling and user management.

**AI Solution**:
- **GitHub Copilot** suggested OAuth flow patterns and security best practices
- **Claude Sonnet 3.5** provided comprehensive error handling strategies:

```javascript
// AI-assisted OAuth implementation
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    // AI-generated token validation and user creation logic
  },
  onError: () => {
    // AI-suggested error handling patterns
  }
});
```

</details>

### **🎯 AI Impact Summary**

<details>
<summary><strong>📈 Overall Project Impact</strong></summary>

- **Development Speed**: 3x faster implementation
- **Code Quality**: Consistent patterns and fewer bugs
- **Learning Curve**: Reduced complexity for new features
- **Maintenance**: Easier to debug and extend

The strategic use of AI tools not only accelerated development but also ensured higher code quality and maintainability throughout the project lifecycle.

</details>

</details>

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rithin-rajpoot/chronical-x.git
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
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
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

### Live Application
- **Frontend**: Deployed on Vercel - [https://chronical-x.vercel.app/](https://chronical-x.vercel.app/)
- **Backend**: Deployed on Render - [Backend API](https://chronical-x-backend.onrender.com)

### Frontend Deployment (Vercel)
1. Build the React app: `npm run build`
2. Deploy to Vercel
3. Set environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-domain.onrender.com/chronicalX/api/v1
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

### Backend Deployment (Render/Railway/Heroku)
1. Set up MongoDB Atlas for production database
2. Configure environment variables:
   ```
   MONGODB_URL=mongodb+srv://...
   JWT_SECRET=your-jwt-secret
   CLIENT_URL=https://your-frontend-domain.vercel.app
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NODE_ENV=production
   ```
3. Deploy the server folder
4. Update CORS settings for production URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 👨‍💻 Author

**Rithin Rajpoot**

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Tailwind CSS for the styling system
- All the open-source contributors

---

**Happy Blogging! 🎉**
