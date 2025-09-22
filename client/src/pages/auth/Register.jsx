import { useEffect, useState } from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  googleAuthThunk,
  registerUserThunk,
} from "../../store/slice/user/userThunk";
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, buttonLoading } = useSelector(
    (state) => state.userReducer
  );

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  // ✅ Google Signup Handler
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
      console.log("Google signup failed");
    },
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      gender: "",
    };

    if (!signupData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (signupData.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
      isValid = false;
    }

    if (!signupData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!signupData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (signupData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSignup = async () => {
    if (validateForm()) {
      const response = await dispatch(registerUserThunk(signupData));
      if (response?.payload.success) {
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
            Join Us Today! 🚀
          </h2>
          <p className="text-gray-600 mt-2">Create your account and start sharing</p>
        </div>

        {/* Google Signup Button */}
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
            <span className="px-4 bg-white text-gray-500 font-medium">or create with email</span>
          </div>
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="fullName"
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 ${
                errors.fullName ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-300"
              }`}
              placeholder="Enter your full name"
              onChange={handleInputChange}
              value={signupData.fullName}
            />
          </div>
          {errors.fullName && (
            <span className="text-red-500 text-sm mt-1">{errors.fullName}</span>
          )}
        </div>
        {/* Email */}
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
              value={signupData.email}
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaKey className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 ${
                errors.password ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-300"
              }`}
              placeholder="Create a password"
              onChange={handleInputChange}
              value={signupData.password}
            />
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">{errors.password}</span>
          )}
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                id="male"
                type="radio"
                name="gender"
                value="male"
                className="w-4 h-4 text-slate-600 border-gray-300 focus:ring-slate-500"
                defaultChecked
              onChange={handleInputChange}
            />
            <span className="ml-2 text-gray-700 font-medium">Male</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              id="female"
              type="radio"
              name="gender"
              value="female"
              className="w-4 h-4 text-slate-600 border-gray-300 focus:ring-slate-500"
              onChange={handleInputChange}
            />
            <span className="ml-2 text-gray-700 font-medium">Female</span>
          </label>
        </div>
        </div>

        {/* Signup Button */}
        {buttonLoading ? (
          <button className="w-full py-3 bg-slate-800 text-white font-medium rounded-lg shadow-sm opacity-75 cursor-not-allowed mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </div>
          </button>
        ) : (
          <button
            onClick={handleSignup}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            disabled={
              !signupData.fullName ||
              !signupData.email ||
              !signupData.password 
            }
          >
            Create Account
          </button>
        )}

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link 
              className="text-slate-800 font-medium hover:text-slate-600 transition-all duration-200" 
              to="/login"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
