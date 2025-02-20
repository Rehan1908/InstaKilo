import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: 'Image required' });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: 'author', select: '-password' });

    return res.status(201).json({
      message: 'New post added',
      post,
      success: true,
    });
  } catch (error) {
    console.error("Error in addNewPost:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      });
    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.error("Error in getAllPost:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      });
    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.error("Error in getUserPost:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const likePost = async (req, res) => {
  try {
    const likerUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found', success: false });
    }

    await Post.findByIdAndUpdate(postId, { $addToSet: { likes: likerUserId } });


    return res.status(200).json({ message: 'Post liked', success: true });
  } catch (error) {
    console.error("Error in likePost:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likerUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found', success: false });
    }

    await Post.findByIdAndUpdate(postId, { $pull: { likes: likerUserId } });


    return res.status(200).json({ message: 'Post disliked', success: true });
  } catch (error) {
    console.error("Error in dislikePost:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commenterId = req.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required', success: false });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found', success: false });
    }

    const comment = await Comment.create({
      text,
      author: commenterId,
      post: postId
    });
    await comment.populate({ path: 'author', select: 'username profilePicture' });
    
    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: 'Comment Added',
      comment,
      success: true
    });
  } catch (error) {
    console.error("Error in addComment:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username profilePicture');
    if (!comments.length) {
      return res.status(404).json({ message: 'No comments found for this post', success: false });
    }
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error in getCommentsOfPost:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found', success: false });
    }
    if (post.author.toString() !== authorId) {
      return res.status(403).json({ message: 'Unauthorized', success: false });
    }

    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(authorId, { $pull: { posts: postId } });
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error("Error in deletePost:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found', success: false });
    }
    
    const user = await User.findById(authorId);
    const isBookmarked = user.bookmarks.includes(post._id);
    
    if (isBookmarked) {
      await User.findByIdAndUpdate(authorId, { $pull: { bookmarks: post._id } });
      return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true });
    } else {
      await User.findByIdAndUpdate(authorId, { $addToSet: { bookmarks: post._id } });
      return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true });
    }
  } catch (error) {
    console.error("Error in bookmarkPost:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};