import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaEdit, FaTrash, FaSave, FaTimes, FaCalendar } from 'react-icons/fa';
import { updateCommentThunk, deleteCommentThunk } from '../store/slice/comment/commentThunk';

const Comment = ({ comment, currentUserId }) => {
  const dispatch = useDispatch();
  const { buttonLoading, deleteLoading } = useSelector(state => state.commentReducer);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isOwner = comment.author?._id === currentUserId;

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(comment.text);
  };

  const handleSaveEdit = async () => {
    if (editText.trim() && editText.trim() !== comment.text) {
      const result = await dispatch(updateCommentThunk({
        commentId: comment._id,
        text: editText.trim()
      }));
      if (result.type === 'comment/updateComment/fulfilled') {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteCommentThunk(comment._id));
    if (result.type === 'comment/deleteComment/fulfilled') {
      setShowConfirmDelete(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    }
  };

  return (
    <div className="flex space-x-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {comment.author?.avatar ? (
            <img
              src={comment.author.avatar}
              alt={`${comment.author.fullName}'s avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          {/* Author and Date */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-gray-900">
                {comment.author?.fullName || 'Anonymous'}
              </h4>
              <span className="text-xs text-gray-500 flex items-center">
                <FaCalendar className="mr-1" />
                {formatDate(comment.createdAt)}
              </span>
            </div>
            
            {/* Action Buttons */}
            {isOwner && !isEditing && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit comment"
                >
                  <FaEdit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete comment"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Comment Text */}
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <FaTimes className="inline mr-1" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={!editText.trim() || buttonLoading}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="inline mr-1" />
                  {buttonLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.text}
            </p>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Comment
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;