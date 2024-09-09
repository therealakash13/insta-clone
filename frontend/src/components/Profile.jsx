import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

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
                        <Link to="/account/edit">
                          <Button
                            className="ml-2 hover:bg-gray-200 h-8"
                            variant="secondary"
                          >
                            Edit Profile
                          </Button>
                        </Link>
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
              {userProfile?._id === user._id && (
                <>
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
                </>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {dispayPosts.map((post) => {
                return (
                  <>
                    <div key={post._id} className="group relative">
                      <div className="relative">
                        <img
                          className="rounded-sm my-2 w-auto cursor-pointer aspect-square object-cover transition duration-300 ease-in-out group-hover:blur-sm"
                          src={post.image}
                          alt=""
                        />
                        <div className="absolute inset-0 gap-5 flex items-center justify-center text-gray-300 text-xl cursor-pointer font-bold z-10 opacity-0 group-hover:bg-black group-hover:bg-opacity-50 group-hover:opacity-100 transition duration-300 ease-in-out">
                          <span className="flex gap-2">
                            <Heart /> {post.likes.length}
                          </span>
                          <span className="flex gap-2">
                            <MessageCircle /> {post.comments.length}
                          </span>
                        </div>
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
