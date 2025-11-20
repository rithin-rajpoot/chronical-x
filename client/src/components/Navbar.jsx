import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUserThunk } from '../store/slice/user/userThunk';
import { Home, User, PlusCircle, LogOut, Edit3 } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, userProfile } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    navigate('/login');
  };

  // Don't show navbar on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Create Post', path: '/create-post', icon: PlusCircle },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-800">ChronicalX</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${ //
                    location.pathname === item.path
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* User Profile & Logout */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={userProfile?.avatar || '/avatar.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {userProfile?.fullName || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 border border-red-200 hover:border-red-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-slate-800 hover:bg-gray-100 focus:outline-none focus:text-slate-800 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile User Info & Logout */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg mb-3 border border-gray-200">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={userProfile?.avatar || '/avatar.png'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-base font-semibold text-gray-800">
                      {userProfile?.fullName || 'User'}
                    </div>
                    <div className="text-sm text-gray-500">{userProfile?.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 border border-red-200 hover:border-red-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;