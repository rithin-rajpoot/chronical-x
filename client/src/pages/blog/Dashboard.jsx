import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaHeart, FaComment } from 'react-icons/fa';
import { getAllPostsThunk, deletePostThunk, toggleLikeThunk } from '../../store/slice/post/postThunk';
import { logoutUserThunk } from '../../store/slice/user/userThunk';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { posts, screenLoading, deleteLoading, likeLoading } = useSelector(state => state.postReducer);
  const { userProfile } = useSelector(state => state.userReducer);
  
  const [deletingPostId, setDeletingPostId] = useState(null);

  useEffect(() => {
    dispatch(getAllPostsThunk());
  }, [dispatch]);

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setDeletingPostId(postId);
      await dispatch(deletePostThunk(postId));
      setDeletingPostId(null);
    }
  };

  const handleLikePost = (postId) => {
    dispatch(toggleLikeThunk(postId));
  };

  const isLikedByUser = (post) => {
    return post?.likes?.some(like => 
      (typeof like === 'string' ? like : like._id || like) === userProfile?._id
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (screenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Welcome Message - Top Right Corner */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <p className="text-lg font-medium text-gray-700">
              Welcome back, <span className="text-slate-800 font-semibold">{userProfile?.fullName}</span>! ✨
            </p>
          </div>
          
          {/* Create Post Button - Moved to top right */}
          <Link
            to="/create-post"
            className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <FaPlus className="mr-2" />
            Create New Post
          </Link>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <FaEdit className="h-10 w-10 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No posts yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start your blogging journey! Create your first post and share your amazing ideas with the world.
            </p>
            <Link
              to="/create-post"
              className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              <FaPlus className="mr-2" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-shadow duration-300 border border-gray-200">
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-slate-700 transition-colors duration-200">
                      {post.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateContent(post.content)}
                  </p>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium"
                        >
                          {`#${tag}`}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="font-medium">By {post.author?.fullName || 'Anonymous'}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <button
                      onClick={() => handleLikePost(post._id)}
                      disabled={likeLoading}
                      className={`flex items-center transition-all duration-200 ${
                        isLikedByUser(post) 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-500 hover:text-red-500'
                      } disabled:opacity-50`}
                    >
                      <FaHeart className={`mr-1 ${isLikedByUser(post) ? 'text-red-500' : 'text-gray-400'}`} />
                      <span className="font-medium">{post.likes?.length || 0}</span>
                    </button>
                    <div className="flex items-center">
                      <FaComment className="mr-1 text-blue-500" />
                      <span className="font-medium">Comments</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/post/${post._id}`}
                      className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200"
                    >
                      <FaEye className="mr-2" />
                      Read More
                    </Link>
                    
                    {userProfile?._id === post.author?._id && (
                      <div className="flex space-x-2">
                        <Link
                          to={`/edit-post/${post._id}`}
                          className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          disabled={deletingPostId === post._id}
                          className="inline-flex items-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          <FaTrash className="mr-1" />
                          {deletingPostId === post._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
