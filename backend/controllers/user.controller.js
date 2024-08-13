import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// <---------- Registration---------- > //
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Something is Missing!",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User Already Exist with this Email!",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the Password //

    await User.create({ username, email, password: hashedPassword });
    return res.status(201).json({
      message: "Account Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error from Registration @ User Controller ---------->", error);
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
};

// <----------Login----------> //
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Something is Missing!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect Email or Password!",
        success: false,
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Incorrect Email or Password!",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPost,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log("Error from Login @ User Controller ---------->", error);
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
};

// <----------Logout----------> //
export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out Successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error from Logout @ User Controller ---------->", error);
  }
};

// <----------Get Profile----------> //
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    let user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({
        message: "No User Found",
        success: false,
      });
    }

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log("Error from Get Profile @ User Controller ---------->", error);
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
};

// <----------Edit Profile----------> //
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({
        message: "No User Found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile Updated Successfully!",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error from Profile Edit @ User Controller ---------->", error);
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
};

// <----------Get Suggested Profiles----------> //
export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res
        .status(400)
        .json({ message: "Currently No User", success: false });
    }
    return res.status(200).json({ users: suggestedUsers, success: true });
  } catch (error) {
    console.log("Error from Get Suggested Users", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// <----------Follow/Unfollow----------> //
export const followOrUnfollow = async (req, res) => {
  try {
    const user = req.id;
    const targetUser = req.params.id;

    if (user === targetUser) {
      return res
        .status(403)
        .json({ message: "Can't Follow/Unfollow Yourself!", success: false });
    }

    const userrr = await User.findById(user);
    const targetUserrr = await User.findById(targetUser);
    if (!userrr || !targetUserrr) {
      return res
        .status(404)
        .json({ message: "User Not Found!", success: false });
    }

    // Follow/Unfollow Logic //
    const isFollowing = userrr.following.includes(targetUser);
    if (isFollowing) {
      // Unfollow Logic //
      await Promise.all([
        User.updateOne({ _id: user }, { $pull: { following: targetUser } }),
        User.updateOne({ _id: targetUser }, { $pull: { followers: user } }),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed Successfully", success: true });
    } else {
      // Follow Logic //
      await Promise.all([
        User.updateOne({ _id: user }, { $push: { following: targetUser } }),
        User.updateOne({ _id: targetUser }, { $push: { followers: user } }),
      ]);
      return res
        .status(200)
        .json({ message: "Followed Successfully", success: true });
    }
  } catch (error) {
    console.log("Error from Follow/Unfollow @ User Controller", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
