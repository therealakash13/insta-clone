import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("posts");
  const dispayPosts =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {/* make it responsive */}
      <div className="grid grid-cols-2">
        <div className="flex w-screen">
          <div className="lg:flex-[1]"></div>
          <div className="lg:flex-[7] md:flex-[3] sm:flex-[1] mx-6 mt-10">
            <div className="flex justify-center mt-10 mb-10">
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
                              <Button
                                variant="secondary"
                                className="  ml-2 h-8"
                              >
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
                      <AtSign />{" "}
                      <span className="pl-2">{userProfile?.username}</span>
                    </Badge>
                  </div>
                </section>
              </div>
            </div>
            <hr />
            <div className="flex items-center justify-center mx-auto space-x-10 ">
              <span
                onClick={() => handleTabChange("posts")}
                className={` cursor-pointer my-4 ${
                  activeTab === "posts" ? "font-bold" : ""
                }`}
              >
                POSTS
              </span>
              <span
                onClick={() => handleTabChange("saved")}
                className={` cursor-pointer my-4 ${
                  activeTab === "saved" ? "font-bold" : ""
                }`}
              >
                SAVED
              </span>
              <span
                onClick={() => handleTabChange("tagged")}
                className={`  cursor-pointer my-4 ${
                  activeTab === "tagged" ? "font-bold" : ""
                }`}
              >
                TAGGED
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {dispayPosts.map((post) => {
                return (
                  <>
                    <div key={post._id} className="relative group">
                      <div className="relative ">
                        <img
                          className="rounded-sm my-2 w-auto cursor-pointer aspect-square object-cover hover:blur-sm transition duration-300 ease-in-out"
                          src={post.image}
                          alt=""
                        />
                        {/* fix hover pr text nhi dikhrha and dikh rha h to image blur nhi horhi */}
                        <span className="absolute inset-auto flex items-center justify-center text-white text-xl font-bold z-10">
                          Message
                        </span>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
