import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Bookmark,
  Heart,
  HeartOff,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import CommentsDialog from "./CommentsDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { POST_API_ENDPOINT } from "@/constants/constants";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

export default function Post({ post }) {
  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const dispatch = useDispatch();
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setCommnent] = useState(post.comments);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const handlePostDelete = async () => {
    try {
      const response = await axios.delete(
        `${POST_API_ENDPOINT}/delete/${post._id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedData = posts.filter(
          (postItems) => postItems?._id !== post?._id
        );
        dispatch(setPosts(updatedData));
        toast.success(response.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleLikeUnlike = async (postId) => {
    try {
      const action = liked ? "dislike" : "like";
      const response = await axios.get(
        `${POST_API_ENDPOINT}/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        //Post update after like
        const updateddPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updateddPostData));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleComment = async () => {
    try {
      const response = await axios.post(
        `${POST_API_ENDPOINT}/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const updatedCommentData = [...comment, response.data.comment];
        setCommnent(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="my-8 w-full mx-auto max-w-sm ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={post?.author?.profilePicture}
                alt="Post_image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-3">
              <h1>{post?.author?.username}</h1>
              {user?._id === post.author._id && (
                <Badge variant="secondary">You</Badge>
              )}
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center">
              {user && user?._id === post?.author?._id ? (
                <Button
                  variant="ghost"
                  onClick={() => handlePostDelete()}
                  className="cursor-pointer w-fit text-[#ED4956] font-bold"
                >
                  Delete
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="cursor-pointer w-fit text-[#ED4956] font-bold"
                >
                  Unfollow
                </Button>
              )}

              <Button variant="ghost" className="cursor-pointer w-fit">
                Add to favourites
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                }}
                className="cursor-pointer w-fit"
              >
                Cancel
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <img
          className="rounded-lg w-full aspect-square object-cover my-2"
          src={post?.image}
          alt="post_img"
        />

        <div className="flex items-center justify-between my-2">
          <div className="flex items-center gap-3">
            {liked ? (
              <HeartOff
                className="cursor-pointer hover:text-gray-600"
                onClick={() => handleLikeUnlike(post?._id)}
              />
            ) : (
              <Heart
                className="cursor-pointer hover:text-gray-600"
                onClick={() => handleLikeUnlike(post?._id)}
              />
            )}
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="cursor-pointer hover:text-gray-600"
            />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
          <Bookmark className="cursor-pointer hover:text-gray-600" />
        </div>

        <span className="font-medium block mb-1">{postLike} Likes</span>

        <p>
          <span className="font-medium mr-2">{post?.author?.username}</span>
          {post?.caption}
        </p>
        {comment.length > 0 && (
          <span
            className="cursor-pointer text-gray-400 mt-1 text-sm"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
          >
            View all {comment.length} comments
          </span>
        )}

        <CommentsDialog open={open} setOpen={setOpen} />

        <div className="flex items-center justify-between ">
          <input
            type="text"
            value={text}
            onChange={changeEventHandler}
            placeholder="Add a comment..."
            className="outline-none text-sm w-full"
          />
          {text && (
            <span
              onClick={handleComment}
              className="text-[#3badf8] cursor-pointer"
            >
              Post
            </span>
          )}
        </div>
      </div>
    </>
  );
}
