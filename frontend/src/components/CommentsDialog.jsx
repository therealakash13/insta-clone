import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { POST_API_ENDPOINT } from "@/constants/constants";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

export default function CommentsDialog({ open, setOpen }) {
  const dispatch = useDispatch();
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const [comment, setCommnent] = useState([]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendCommentHandler = async () => {
    try {
      const response = await axios.post(
        `${POST_API_ENDPOINT}/${selectedPost._id}/comment`,
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
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
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

  useEffect(() => {
    if (selectedPost) {
      setCommnent(selectedPost.comments);
    }
  }, [selectedPost]);
  return (
    <>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="max-w-5xl p-0 flex flex-col outline-none border-0"
        >
          <div className="flex flex-1">
            <div className="w-1/2">
              <img
                className="rounded-l-lg w-full h-full object-cover "
                src={selectedPost?.image}
                alt="post_img"
              />
            </div>

            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Link>
                    <Avatar>
                      <AvatarImage
                        src={selectedPost?.author?.profilePicture}
                        alt=""
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs">
                      {selectedPost?.author?.username}
                    </Link>
                    {/* <span className="text-gray-600 text-sm">Bio Here...</span> */}
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="p-0 flex flex-col outline-none border-0">
                    <div className="flex flex-col my-2">
                      <Button
                        variant="ghost"
                        className="text-[#ED4956] hover:text-[#ED4956]"
                      >
                        Unfollow
                      </Button>
                      <Button variant="ghost">Add to favourite</Button>
                      <Button variant="ghost">Cancel</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {comment.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder="Add a comment..."
                    className="w-full outline-none border border-gray-300 py-2 px-4 text-sm rounded-3xl"
                  />
                  <Button
                    disabled={!text.trim()}
                    onClick={sendCommentHandler}
                    variant="outline"
                    className="rounded-3xl"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
