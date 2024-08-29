import useGetUserProfile from "@/hooks/useGetUserProfile";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AtSign } from "lucide-react";

export default function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);

  return (
    <>
      {/* make it responsive */}
      <div className="flex lg:max-w-7xl mx-auto justify-center mt-10 ">
        <div className="grid grid-cols-2 space-x-6  p-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section className="">
            <div className="flex flex-col items-start justify-center space-y-3">
              <div className="text-lg font-bold">
                {userProfile?.username}

                {userProfile?._id === user._id ? (
                  <Button
                    className="ml-2 hover:bg-gray-200 h-8"
                    variant="secondary"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    {userProfile?.followers.includes(user?._id) ? (
                      <>
                        <Button variant="secondary" className=" ml-2 h-8">
                          Unfollow
                        </Button>
                        <Button variant="secondary" className="  ml-2 h-8">
                          Message
                        </Button>
                      </>
                    ) : (
                      <Button className=" bg-[#0895f6] hover:bg-[#3192d2] cursor-pointer ml-4 h-8">
                        Follow
                      </Button>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-5">
                <span>
                  <span className="font-semibold">
                    {userProfile?.posts.length}
                  </span>{" "}
                  posts
                </span>
                <span>
                  <span className="font-semibold">
                    {userProfile?.followers.length}
                  </span>{" "}
                  followers
                </span>
                <span>
                  <span className="font-semibold">
                    {userProfile?.following.length}
                  </span>{" "}
                  following
                </span>
              </div>
              <span className="text-sm p-1">{userProfile?.bio}</span>
              <Badge variant="secondary">
                <AtSign /> <span className="pl-2">{userProfile?.username}</span>
              </Badge>
            </div>
          </section>
        </div>
      </div>
      <hr className="max-w-7xl mx-auto" />
      <div className="flex items-center justify-center mx-auto space-x-10">
        <span className="font-semibold cursor-pointer my-4">POSTS</span>
        <span className="font-semibold cursor-pointer my-4">SAVED</span>
        <span className="font-semibold cursor-pointer my-4">TAGGED</span>
      </div>
    </>
  );
}
