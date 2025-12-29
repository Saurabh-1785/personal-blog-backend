const Post = require('../models/postModel');

/**
 * @desc    Create a new blog post
 * @route   POST /api/posts
 * @access  Public (for now)
 */
const createPost = async (req, res) => {
  try {
    const { title, markdownContent, author } = req.body;
    if (!title || !markdownContent) {
      return res.status(400).json({ message: 'Please provide a title and content for the post.' });
    }
    const newPost = await Post.create({
      title,
      markdownContent,
      author, // This will use the provided author or the default 'Admin' from our schema.
    });
    res.status(201).json(newPost);

  } catch (error) {
    console.error(error); // Log the full error to the console for debugging.
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
};

/**
 * @desc    Get all blog posts
 * @route   GET /api/posts
 * @access  Public
 */
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }); //We tell Mongoose to go to the posts collection, find all documents ({}), and then sort them by the createdAt field from newest to oldest (-1)

    res.status(200).json(posts);// if the query is successful, we send an HTTP 200 OK status, which is the standard response for a successful GET request. We then send the array of posts back to the client in JSON format.

  } catch (error) {
    console.error(error); // Log the error for debugging.
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //pass it the id that Express extracted from the URL and placed in req.params
    if (post) {
      // If the post exists, send a 200 OK status with the post data.
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
      
    console.error(error);
    
    // A common error here is a `CastError` from Mongoose, which occurs if the provided ID
    // is not in a valid ObjectId format. This is a client-side error (bad request).
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
    }
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id, 
      req.body,      
      {
        new: true,          
        runValidators: true, 
      }
    );
    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    }

    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (deletedPost) {
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid post ID format: ${req.params.id}` });
    }

    // For all other errors, send a 500 Internal Server Error.
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};


module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};