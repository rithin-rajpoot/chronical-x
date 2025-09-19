import { useEffect, useState } from "react";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { googleAuthThunk, loginUserThunk } from "../../store/slice/user/userThunk";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc"; // Google icon

const Login = () => {
  const { isAuthenticated, buttonLoading } = useSelector(
    (state) => state.userReducer
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  // Google Login Handler
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const credential = tokenResponse?.credential || tokenResponse?.access_token;
      if (credential) {
        const response = await dispatch(googleAuthThunk({ credential }));
        if (response?.payload?.success) {
          navigate("/");
        }
      }
    },
    onError: () => {
      console.log("Google login failed");
    },
  });
  //  Validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (loginData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Login with email/password
  const handleLogin = async () => {
    if (validateForm()) {
      const response = await dispatch(loginUserThunk(loginData));
      if (response?.payload?.success) {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
        </div>

        {/* Google Login Button */}
        <div className="mb-6">
          <button
            onClick={() => googleLogin()}
            className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm py-4 px-6 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <FcGoogle size={24} />
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">or continue with email</span>
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 ${
                errors.email ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-300"
              }`}
              placeholder="Enter your email address"
              onChange={handleInputChange}
              value={loginData.email}
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email}</span>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaKey className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 ${
                errors.password ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-300"
              }`}
              onChange={handleInputChange}
              value={loginData.password}
            />
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">{errors.password}</span>
          )}
        </div>

        {/* Login Button */}
        {buttonLoading ? (
          <button className="w-full py-3 bg-slate-800 text-white font-medium rounded-lg shadow-sm opacity-75 cursor-not-allowed mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Signing In...
            </div>
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            disabled={!loginData.email || !loginData.password}
          >
            Sign In
          </button>
        )}

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link 
              className="text-slate-800 font-medium hover:text-slate-600 transition-all duration-200" 
              to="/register"
            >
              Create a new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
