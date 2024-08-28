import React, { Fragment } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

export default function RightSidebar() {
  const { user } = useSelector((store) => store.auth);
  return (
    <Fragment>
      <div className="my-10 w-fit pr-32">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${user?._id}`}>
            <Avatar>
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link to={`/profile/${user?._id}`}>
              <h1 className="font-semibold text-sm">{user?.username}</h1>
            </Link>
            <span className="text-gray-600">{user?.bio || "Bio here..."}</span>
          </div>
        </div>
        <SuggestedUsers />
      </div>
    </Fragment>
  );
}
