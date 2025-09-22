import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileThunk } from "./store/slice/user/userThunk";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader } from "lucide-react";
import Navbar from "./components/Navbar";

// Lazy load components
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/blog/Dashboard"));
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));
const PostEditor = lazy(() => import("./pages/blog/PostEditor"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const PublicRoute = lazy(() => import("./components/PublicRoute"));

// Loading component for fallback
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
    <div className="text-center">
      {/* Spinner */}
      <div className="mb-6">
        <Loader className="size-12 animate-spin text-slate-600 mx-auto" />
      </div>
      
      {/* Loading message */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Loading ChronicalX</h3>
        <p className="text-gray-600">Please wait while we connect to the server...</p>
        
        {/* Free tier notice */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md">
          <p className="text-sm text-blue-700">
            ⏱️ <strong>First-time load:</strong> Initial connection may take up to 50 seconds 
            due to free hosting service startup time.
          </p>
        </div>
        
        {/* Loading dots animation */}
        {/* <div className="flex justify-center items-center mt-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div> */}
      </div>
    </div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, screenLoading } = useSelector((state) => state.userReducer);

  useEffect(() => {
    // Only try to get user profile if we're not already authenticated
    // This prevents auto-login after logout
    if (!isAuthenticated) {
      (async () => {
        await dispatch(getUserProfileThunk());
      })();
    }
  }, [dispatch, isAuthenticated]);

  if (screenLoading && !isAuthenticated) return <LoadingSpinner />;

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>

              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  </Suspense>
                }
              />
              <Route
                path="/register"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  </Suspense>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/profile"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/post/:id"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <BlogPost />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/create-post"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <PostEditor />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/edit-post/:id"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <PostEditor />
                    </ProtectedRoute>
                  </Suspense>
                }
              />

              {/* Catch all route - 404 */}
              <Route
                path="*"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
