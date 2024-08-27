import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import CommentsDialog from "./CommentsDialog";
import { useSelector } from "react-redux";
import axios from "axios";
import { POST_API_ENDPOINT } from "@/constants/constants";
import { toast } from "sonner";

export default function Post({ post }) {
  const { user } = useSelector((store) => store.auth);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const handlePostDelete = async (id) => {
    try {
      const response = await axios.post(
        `${POST_API_ENDPOINT}/delete/${id}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setOpen(false);
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
            <h1>{post?.author?.username}</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center">
              {user && user?._id === post?.author?._id ? (
                <Button
                  variant="ghost"
                  onClick={() => handlePostDelete(post?._id)}
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

              <Button variant="ghost" className="cursor-pointer w-fit">
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
            <Heart className="cursor-pointer hover:text-gray-600" />
            <MessageCircle
              onClick={() => {
                setOpen(true);
              }}
              className="cursor-pointer hover:text-gray-600"
            />
            <Send className="cursor-pointer hover:text-gray-600" />
          </div>
          <Bookmark className="cursor-pointer hover:text-gray-600" />
        </div>

        <span className="font-medium block mb-1">
          {post?.likes.length} Likes
        </span>

        <p>
          <span className="font-medium mr-2">{post?.author?.username}</span>
          {post?.caption}
        </p>
        <span
          className="cursor-pointer text-gray-400 mt-1 text-sm"
          onClick={() => {
            setOpen(true);
          }}
        >
          View all 10 comments
        </span>

        <CommentsDialog open={open} setOpen={setOpen} />

        <div className="flex items-center justify-between ">
          <input
            type="text"
            value={text}
            onChange={changeEventHandler}
            placeholder="Add a comment..."
            className="outline-none text-sm w-full"
          />
          {text && <span className="text-[#3badf8]">Post</span>}
        </div>
      </div>
    </>
  );
}
