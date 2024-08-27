import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

// <----------Add New Post----------> //
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res
        .status(404)
        .josn({ message: "Image Required!", success: false });
    }

    //Image Optimization
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //Bffer to DataUri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudRespnse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudRespnse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res
      .status(201)
      .json({ message: "Post Added Successfully!", success: true });
  } catch (error) {
    console.log("Error from Add New Post @ Post Controller ---------->", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error!", success: false });
  }
};

// <----------Get All Posts----------> //
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username , profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username,profilePicture" },
      });

    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.log("Error from Get All Posts @ Post Controller ---------->".error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// <----------Get Your Post----------> //
export const getYourPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username , profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username,profilePicture" },
      });

    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.log("Error from Get Your Post @ Post Controller ---------->".error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// <----------Like Post----------> //
export const likePost = async (req, res) => {
  try {
    const user = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post No Longer Unavailable", success: false });

    // Logic Logic
    await post.updateOne({ $addToSet: { likes: user } });
    await post.save();

    // Implement Socket IO

    return res.status(200).json({ message: "Post Liked", success: true });
  } catch (error) {
    console.log("Error from Like Post @ Post Controller ---------->".error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// <----------Dislike Post----------> //
export const dislikePost = async (req, res) => {
  try {
    const user = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post No Longer Unavailable", success: false });

    // Logic Logic
    await post.updateOne({ $pull: { likes: user } });
    await post.save();

    // Implement Socket IO

    return res.status(200).json({ message: "Post Disliked", success: true });
  } catch (error) {
    console.log("Error from Dislike Post @ Post Controller ---------->".error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// <----------Comment Added---------> //
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = req.id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post Not Available Anymore!", success: false });
    }

    if (!text) {
      return res
        .status(404)
        .json({ message: "Text is Required!", success: false });
    }

    const comment = await Comment.create({
      text,
      author: authorId,
      post: postId,
    }).populate({
      path: "author",
      select: "username,profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res
      .status(200)
      .json({ message: "Comment Added", comment, success: true });
  } catch (error) {
    console.log("Error from Add Comment @ Post Controller --------->", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// <----------Get Post Comments----------> //
export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ psot: postId }).populate(
      "author",
      "username,profilePicture"
    );
    if (!comments) {
      return res
        .status(404)
        .json({ message: "Comment Not Available Anymore!", success: false });
    }
    return res.status(200).json({ comments, success: true });
  } catch (error) {
    console.log(
      "Error from Get Post Commnents @ Post Controller ---------->",
      error
    );
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// <----------Delete Post----------> //
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post Already Deleted!", success: false });
    }

    if (post.author.toString() != authorId) {
      return res.status(403).json({ message: "Unauthorized!", success: false });
    }

    await Post.findByIdAndDelete(postId);

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() != postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({ message: "Post Deleted", success: true });
  } catch (error) {
    console.log("Error from Delete Post @ Post Controller ---------->", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// <----------Bookmark Post----------> //
export const bookmarkPost = async (req, res) => {
  try {
    const postId = res.params.id;
    const authorId = res.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .josn({ message: "Post Not Available!", success: false });

    const user = await User.findById(authorId);
    if (!user)
      return res.status(403).json({ message: "Unauthorized", success: false });

    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post Removed from Save!",
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post Save!", success: true });
    }
  } catch (error) {
    console.log("Error from Bookmark Post ---------->", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
