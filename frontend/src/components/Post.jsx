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

export default function Post() {
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

  return (
    <>
      <div className="my-8 w-full mx-auto max-w-sm ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="" alt="Post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>Username</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center">
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>

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
          src="https://images.unsplash.com/photo-1719937206220-f7c76cc23d78?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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

        <span className="font-medium block mb-1">1k Likes</span>

        <p>
          <span className="font-medium mr-2">Username</span>
          Caption
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
