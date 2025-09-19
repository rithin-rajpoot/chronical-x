
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

// Import environment variables
import dotenv from 'dotenv';
dotenv.config();


// MongoDB connection
import {connectDB} from './db/connection1.db.js';
connectDB();


// // integration
import cors from 'cors';
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_DEV
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

//routes : 

// user routes : 

import userRoute from './routes/user.route.js';
app.use('/chronicalX/api/v1/user', userRoute);

import postRoute from './routes/post.route.js';
app.use('/chronicalX/api/v1/posts', postRoute);

import commentRoute from './routes/comment.route.js';
app.use('/chronicalX/api/v1/comments', commentRoute);

import authRoute from "./routes/auth.route.js";
app.use("/chronicalX/api/v1/auth", authRoute);

//Error handling middleware
import { errorMiddleware } from './middlewares/error.middleware.js';
app.use(errorMiddleware); // Error handling middleware should be placed after all routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()  =>{
    console.log(`Server is running on port ${PORT}`);
})