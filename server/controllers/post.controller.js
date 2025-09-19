import Post from '../models/posts.model.js';
import cloudinary from '../utilities/cloudinary.utilty.js'; // Missing import
import { asyncHandler } from '../utilities/asyncHandler.utility.js';
import { errorHandler } from '../utilities/errorHandler.utility.js';

// Create a new post
export const createPost = asyncHandler(async (req, res, next) => {
    const { title, content, coverImage, tags } = req.body;
    
    if (!title || !content) {
        return next(new errorHandler('Title and content are required', 400));
    }

    let coverImageUrl = '';
    
    // Handle cover image upload
    if (coverImage) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(coverImage);
            coverImageUrl = uploadResponse.secure_url;
        } catch (error) {
            return next(new errorHandler("Failed to upload cover image", 500));
        }
    }

    const post = await Post.create({
        title,
        content,
        coverImage: coverImageUrl,
        tags: tags || [],
        author: req.user._id
    });

    // Populate author info for response
    const populatedPost = await Post.findById(post._id).populate('author', 'fullName email avatar');
    console.log(populatedPost);

    res.status(201).json({ 
        success: true, 
        message: 'Post created successfully',
        responseData: populatedPost 
    });
});

// Get all posts with pagination and filtering
export const getAllPosts = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Optional filtering by tag or author
    const filter = {};
    if (req.query.tag) {
        filter.tags = { $in: [req.query.tag] };
    }
    if (req.query.author) {
        filter.author = req.query.author;
    }

    const posts = await Post.find(filter)
        .populate('author', 'fullName email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({ 
        success: true, 
        responseData: {
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    });
});

// Get a single post by ID
export const getPostById = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'fullName email avatar')
        .populate('likes', 'fullName email');
        
    if (!post) {
        return next(new errorHandler('Post not found', 404));
    }

    // Increment views when someone reads the post
    await post.incrementViews();

    res.status(200).json({ 
        success: true, 
        responseData: post 
    });
});

// Update a post
export const updatePost = asyncHandler(async (req, res, next) => {
    const { title, content, coverImage, tags } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new errorHandler('Post not found', 404));
    }

    // Check if user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
        return next(new errorHandler('You are not authorized to update this post', 403));
    }

    // Handle cover image update
    let coverImageUrl = post.coverImage;
    if (coverImage) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(coverImage);
            coverImageUrl = uploadResponse.secure_url;
        } catch (error) {
            return next(new errorHandler("Failed to upload cover image", 500));
        }
    }

    // Update post fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.coverImage = coverImage !== undefined ? coverImageUrl : post.coverImage;
    post.tags = tags || post.tags;

    await post.save();

    // Return updated post with author info
    const updatedPost = await Post.findById(post._id).populate('author', 'fullName email avatar');

    res.status(200).json({ 
        success: true, 
        message: 'Post updated successfully',
        responseData: updatedPost 
    });
});

// Delete a post
export const deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
        return next(new errorHandler('Post not found', 404));
    }

    // Check if user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
        return next(new errorHandler('You are not authorized to delete this post', 403));
    }

    await post.deleteOne();

    res.status(200).json({ 
        success: true, 
        message: 'Post deleted successfully' 
    });
});

// Like/Unlike a post
export const toggleLike = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
        return next(new errorHandler('Post not found', 404));
    }

    const userId = req.user._id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
        // Unlike the post
        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
        // Like the post
        post.likes.push(userId);
    }

    await post.save();

    // Return the complete updated post with author info
    const updatedPost = await Post.findById(post._id).populate('author', 'fullName email avatar');

    res.status(200).json({ 
        success: true, 
        message: isLiked ? 'Post unliked' : 'Post liked',
        responseData: updatedPost
    });
});

// Get posts by specific author
export const getPostsByAuthor = asyncHandler(async (req, res, next) => {
    const authorId = req.params.authorId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: authorId })
        .populate('author', 'fullName email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPosts = await Post.countDocuments({ author: authorId });
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({ 
        success: true, 
        responseData: {
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    });
});