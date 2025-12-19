
// Import the Post model we created in the models directory.
import Post from '../models/postModel.js';

const createPost = async (req, res) => {
  try {
    const { title, markdownContent, author } = req.body; // Destructure the required fields from the request body.
    if (!title || !markdownContent) {
      return res.status(400).json({ message: 'Please provide a title and content for the post.' }); // Send a 400 Bad Request status with a clear error message.
    }

    const newPost = await Post.create({ // Use the Mongoose `create` method on our Post model.
      title,
      markdownContent,
      author, // This will use the provided author or the default 'Admin' from our schema.
    });
    // Send a success response.
    // HTTP status 201 means "Created". It's the most appropriate status for a successful POST request.
    // We send back a JSON object containing the newly created post document. This is useful for the client,
    // which might want to immediately display the new post or redirect to its page.
    res.status(201).json(newPost);

  } catch (error) {
    // Handle potential errors.
    // This could be a validation error from Mongoose (if the data doesn't match the schema)
    // or a database connection issue.
    // We send a 400 Bad Request status, as the error is likely due to invalid data from the client.
    console.error(error); // Log the full error to the console for debugging.
    res.status(400).json({ message: 'Error creating post', error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    // Use the Post model's find() method to retrieve all documents.
    // The empty object {} as the first argument means "match all documents".
    // We then chain the sort() method to organize the results.
    // { createdAt: -1 } sorts the posts by their creation date in descending order (newest first).
    const posts = await Post.find({}).sort({ createdAt: -1 });

    // Send a success response.
    // HTTP status 200 means "OK". It's the standard success code for a GET request.
    // We send back a JSON object containing the array of posts we found.
    //   If no posts are found, this will correctly return an empty array [].
    res.status(200).json(posts);

  } catch (error) {
    // Handle potential server-side errors.
    // If something goes wrong with the database query, it's a server error, not a client error.
    // Therefore, we use the HTTP status 500 "Internal Server Error".
    console.error(error); // Log the error for debugging.
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

export { createPost, getAllPosts };
