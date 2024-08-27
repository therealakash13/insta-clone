import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

export default function CommentsDialog({ open, setOpen }) {
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendCommentHandler = async () => {
    alert(text);
  };
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
                src="https://images.unsplash.com/photo-1719937206220-f7c76cc23d78?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="post_img"
              />
            </div>

            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Link>
                    <Avatar>
                      <AvatarImage src="" alt="" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs">Username</Link>
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
                comments..
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder="Add a comment..."
                    className="w-full outline-none border border-gray-300 py-2 px-4 rounded-3xl"
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
