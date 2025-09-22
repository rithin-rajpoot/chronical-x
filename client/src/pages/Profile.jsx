import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaCalendar, FaImage, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { updateProfileThunk, deleteUserThunk } from '../store/slice/user/userThunk';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfile, buttonLoading } = useSelector(state => state.userReducer);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [profileData, setProfileData] = useState({
    fullName: '',
    bio: '',
    avatar: ''
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        fullName: userProfile.fullName || '',
        bio: userProfile.bio || '',
        avatar: userProfile.avatar || ''
      });
      setImagePreview(userProfile.avatar || '');
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

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

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (validateProfile()) {
      const result = await dispatch(updateProfileThunk(profileData));
      if (result.type === 'user/updateProfile/fulfilled') {
        setIsEditing(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      fullName: userProfile.fullName || '',
      bio: userProfile.bio || '',
      avatar: userProfile.avatar || ''
    });
    setImagePreview(userProfile.avatar || '');
    setErrors({});
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.toLowerCase() === 'delete my account') {
      const result = await dispatch(deleteUserThunk());
      if (result.type === 'user/deleteUser/fulfilled') {
        navigate('/login');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Profile Header */}
          <div className="px-8 py-10 bg-slate-800 relative">
            <div className="relative flex items-center space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white shadow-2xl border-4 border-white flex items-center justify-center">
                  {(imagePreview || userProfile?.avatar || '/avatar.png') ? (
                    <img
                      src={imagePreview || userProfile?.avatar || '/avatar.png'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-slate-700 text-white p-3 rounded-full cursor-pointer hover:bg-slate-600 shadow-lg transition-colors duration-200">
                    <FaImage className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className={`w-full px-4 py-3 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-800 font-medium ${
                          errors.fullName ? 'border-red-400' : 'border-gray-300'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
                      )}
                    </div>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows="3"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-gray-800"
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{userProfile?.fullName}</h2>
                    <p className="text-white/90 text-lg leading-relaxed">{userProfile?.bio || 'Welcome to my profile! ✨'}</p>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <div>
                {isEditing ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={buttonLoading}
                      className="inline-flex items-center px-6 py-3 bg-white text-slate-800 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 shadow-sm transition-colors duration-200"
                    >
                      <FaSave className="mr-2" />
                      {buttonLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-6 py-3 bg-white text-slate-800 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-500 shadow-sm transition-colors duration-200"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center mr-3">
                    <FaUser className="text-white text-sm" />
                  </div>
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mr-4">
                      <FaEnvelope className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</p>
                      <p className="text-gray-900 font-medium">{userProfile?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center mr-4">
                      <FaCalendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Member Since</p>
                      <p className="text-gray-900 font-medium">{formatDate(userProfile?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete Account Section */}
              <div className="bg-red-50 rounded-lg p-6 border border-red-200 h-fit">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Delete Account</h3>
                    <p className="text-red-700 text-sm mb-4">
                      Once you delete your account, there is no going back. This action cannot be undone.
                      All your posts, comments, and profile data will be permanently deleted.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <FaTrash className="w-4 h-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
                <p className="text-gray-600 text-sm">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-bold text-red-600">"delete my account"</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="delete my account"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation.toLowerCase() !== 'delete my account' || buttonLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {buttonLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;