import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxLength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    minLength: [10, 'Content must be at least 10 characters long']
  },
  coverImage: {
    type: String, // Cloudinary URL
    default: ""
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, 'Post author is required']
  },
  tags: [{
    type: String,
    trim: true,
    maxLength: [30, 'Tag cannot be more than 30 characters']
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  readingTime: {
    type: Number, // in minutes
    default: 1
  },
  views: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for likes count
postSchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for excerpt (first 150 characters of content)
postSchema.virtual('excerpt').get(function() {
  return this.content.length > 150 
    ? this.content.substring(0, 150) + '...' 
    : this.content;
});

// Pre-save middleware to generate slug and calculate reading time
postSchema.pre('save', function(next) {
  // Generate slug from title if not provided
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();
    
    // Add timestamp to ensure uniqueness
    this.slug = `${this.slug}-${Date.now()}`;
  }

  // Calculate reading time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200) || 1;
  }

  next();
});

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ isPublished: 1, createdAt: -1 });

// Static method to get posts by tag
postSchema.statics.findByTag = function(tag) {
  return this.find({ tags: { $in: [tag] } })
    .populate('author', 'fullName email avatar')
    .sort({ createdAt: -1 });
};

// Instance method to increment views
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

export default mongoose.model("Post", postSchema);