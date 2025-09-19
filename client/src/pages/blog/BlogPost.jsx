import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaEdit, FaTrash, FaCalendar, FaUser, FaComment } from 'react-icons/fa';
import { getPostByIdThunk, deletePostThunk, toggleLikeThunk } from '../../store/slice/post/postThunk';
import { getCommentsByPostThunk, addCommentThunk } from '../../store/slice/comment/commentThunk';
import Comment from '../../components/Comment';

const BlogPost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentPost, screenLoading, deleteLoading, likeLoading } = useSelector(state => state.postReducer);
  const { comments, addCommentLoading } = useSelector(state => state.commentReducer);
  const { userProfile } = useSelector(state => state.userReducer);
  
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    if (id) {
      // Only fetch if we don't have the current post or if it's a different post
      if (!currentPost || currentPost._id !== id) {
        dispatch(getPostByIdThunk(id));
      }
      dispatch(getCommentsByPostThunk(id));
    }
  }, [dispatch, id, currentPost]);

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await dispatch(deletePostThunk(id));
      if (result.type === 'post/deletePost/fulfilled') {
        navigate('/dashboard');
      }
    }
  };

  const handleLikePost = () => {
    if (currentPost) {
      dispatch(toggleLikeThunk(currentPost._id));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentText.trim() && currentPost) {
      const result = await dispatch(addCommentThunk({
        postId: currentPost._id,
        text: commentText.trim()
      }));
      if (result.type === 'comment/addComment/fulfilled') {
        setCommentText('');
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

  const isLikedByUser = currentPost?.likes?.some(like => 
    (typeof like === 'string' ? like : like._id || like) === userProfile?._id
  );
  const isAuthor = currentPost?.author?._id === userProfile?._id;

  if (screenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post Content - Left Side (2/3 width) */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {/* Cover Image */}
              {currentPost.coverImage && (
                <div className="h-48 md:h-60 overflow-hidden">
                  <img
                    src={currentPost.coverImage}
                    alt={currentPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="p-6">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 leading-tight">
                  {currentPost.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-6">
                  <div className="flex items-center bg-slate-100 px-3 py-1 rounded-lg">
                    <FaUser className="mr-2 text-slate-600" />
                    <span className="font-medium">By {currentPost.author?.fullName || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center bg-slate-100 px-3 py-1 rounded-lg">
                    <FaCalendar className="mr-2 text-slate-600" />
                    <span className="font-medium">{formatDate(currentPost.createdAt)}</span>
                  </div>
                  <div className="flex items-center bg-slate-100 px-3 py-1 rounded-lg">
                    <FaComment className="mr-2 text-slate-600" />
                    <span className="font-medium">{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Tags */}
                {currentPost.tags && currentPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-base max-w-none mb-8">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {currentPost.content}
                  </div>
                </div>

                {/* Like Button and Actions */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleLikePost}
                      disabled={likeLoading}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        isLikedByUser
                          ? 'bg-slate-800 border-slate-800 text-white hover:bg-slate-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      } disabled:opacity-50`}
                    >
                      <FaHeart className={`mr-2 ${isLikedByUser ? 'text-white' : 'text-red-500'}`} />
                      {currentPost.likes?.length || 0} Like{(currentPost.likes?.length || 0) !== 1 ? 's' : ''}
                    </button>
                    
                    {isAuthor && (
                      <div className="flex space-x-3">
                        <Link
                          to={`/edit-post/${currentPost._id}`}
                          className="inline-flex items-center px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-800 transition-all duration-200"
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </Link>
                        <button
                          onClick={handleDeletePost}
                          disabled={deleteLoading}
                          className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg border border-red-600 transition-all duration-200 disabled:opacity-50"
                        >
                          <FaTrash className="mr-2" />
                          {deleteLoading ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Comments Section - Right Side (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaComment className="mr-2 text-slate-600" />
                    Comments ({comments.length})
                  </h2>
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="px-3 py-1 bg-slate-100 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-200 transition-all duration-200 border border-slate-200"
                  >
                    {showComments ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {showComments && (
                <div className="p-4">
                  {/* Add Comment Form */}
                  {userProfile && (
                    <form onSubmit={handleAddComment} className="mb-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {userProfile.avatar ? (
                              <img
                                src={userProfile.avatar}
                                alt="Your avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaUser className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                          />
                          <div className="mt-2 flex justify-end">
                            <button
                              type="submit"
                              disabled={!commentText.trim() || addCommentLoading}
                              className="px-3 py-1 bg-slate-800 text-white rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              {addCommentLoading ? 'Posting...' : 'Post'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-center py-6">
                        <FaComment className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No comments yet</h3>
                        <p className="text-gray-500 text-xs">Be the first to comment on this post.</p>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <Comment
                          key={comment._id}
                          comment={comment}
                          currentUserId={userProfile?._id}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;