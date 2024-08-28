import React, { Fragment } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Comment({ comment }) {
  //   console.log(comment);

  return (
    <Fragment>
      <div className="mb-2">
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={comment?.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-bold text-sm">
            {comment?.author?.username}{" "}
            <span className="font-normal pl-2">{comment?.text}</span>
          </h1>
        </div>
      </div>
    </Fragment>
  );
}
