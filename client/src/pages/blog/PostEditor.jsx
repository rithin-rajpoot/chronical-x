import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaImage, FaTrash } from 'react-icons/fa';
import { createPostThunk, updatePostThunk, getPostByIdThunk } from '../../store/slice/post/postThunk';

const PostEditor = () => {
  const { id } = useParams(); // If id exists, we're editing; otherwise, we're creating
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentPost, createPostLoading, buttonLoading, screenLoading } = useSelector(state => state.postReducer);
  
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    coverImage: '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      dispatch(getPostByIdThunk(id));
    }
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && currentPost && currentPost._id === id) {
      setPostData({
        title: currentPost.title || '',
        content: currentPost.content || '',
        coverImage: currentPost.coverImage || '',
        tags: currentPost.tags || []
      });
      setImagePreview(currentPost.coverImage || '');
    }
  }, [currentPost, id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({
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
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          coverImage: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        setPostData(prev => ({
          ...prev,
          coverImage: base64
        }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPostData(prev => ({
      ...prev,
      coverImage: ''
    }));
    setImagePreview('');
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !postData.tags.includes(tag) && postData.tags.length < 10) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!postData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (postData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    if (!postData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (postData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submissionData = {
        ...postData,
        title: postData.title.trim(),
        content: postData.content.trim()
      };
      
      let result;
      if (isEditing) {
        result = await dispatch(updatePostThunk({
          postId: id,
          ...submissionData
        }));
      } else {
        result = await dispatch(createPostThunk(submissionData));
      }
      
      if (result.type.includes('/fulfilled')) {
        navigate('/');
      }
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (isEditing && screenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="p-4 space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={postData.title}
                onChange={handleInputChange}
                placeholder="Enter your post title..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {postData.title.length}/200 characters
              </p>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-slate-400 transition-colors">
                  <div className="text-center">
                    <FaImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Click to upload cover image</p>
                    <p className="text-gray-400 text-xs">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.coverImage && (
                <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={postData.content}
                onChange={handleInputChange}
                placeholder="Write your post content here..."
                rows="10"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {postData.content.length} characters
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {postData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-lg border border-slate-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-slate-500 hover:text-slate-700"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagInputKeyPress}
                  onBlur={addTag}
                  placeholder="Type a tag and press Enter..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  disabled={postData.tags.length >= 10}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || postData.tags.length >= 10}
                  className="px-4 py-2 bg-slate-800 text-white rounded-r-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {postData.tags.length}/10 tags. Press Enter or comma to add tags.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <FaTimes className="inline mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPostLoading || buttonLoading}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="inline mr-2" />
              {(createPostLoading || buttonLoading) 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Post' : 'Create Post')
              }
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PostEditor;