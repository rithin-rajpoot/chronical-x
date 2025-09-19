import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/user/userSlice.js'
import postReducer from './slice/post/postSlice.js'
import commentReducer from './slice/comment/commentSlice.js'

export const store = configureStore({
  reducer: {
    userReducer,
    postReducer,
    commentReducer
  },
})