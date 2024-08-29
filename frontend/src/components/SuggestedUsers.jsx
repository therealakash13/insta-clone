import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/constants/constants";

export default function SuggestedUsers() {
  const [loading, setLoading] = useState(false);
  const { suggestedUsers, user } = useSelector((store) => store.auth);

  const followUnfollow = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${USER_API_ENDPOINT}/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        // Complete follow unfollow button logic in realtime
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="my-10">
        <div className="flex items-center justify-between text-sm space-x-4">
          <h1 className="font-semibold text-gray-900 ">Suggested for you</h1>
          <span className="font-semibold cursor-pointer hover:text-gray-700 ">
            See All
          </span>
        </div>
        {suggestedUsers.map((userr) => {
          return (
            <>
              <div
                key={userr._id}
                className="flex items-center justify-center space-x-6"
              >
                <div className="flex items-center gap-2 my-5">
                  <Link to={`/profile/${userr?._id}`}>
                    <Avatar>
                      <AvatarImage src={userr?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link to={`/profile/${userr?._id}`}>
                      <h1 className="font-semibold text-sm">
                        {userr?.username}
                      </h1>
                    </Link>
                    <span className="text-gray-600">
                      {userr?.bio || "Bio here..."}
                    </span>
                  </div>
                </div>
                {/* {
                  if(user.)
                } */}
                <span
                  onClick={() => followUnfollow(userr?._id)}
                  className="font-bold text-sm cursor-pointer text-[#3BADF8] hover:text-[#3495d6]"
                >
                  Follow
                </span>
              </div>
            </>
          );
        })}
        <div></div>
      </div>
    </>
  );
}
