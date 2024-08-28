import {
  Compass,
  Heart,
  House,
  Instagram,
  LogOut,
  MessageCircleIcon,
  Search,
  SquarePlus,
} from "lucide-react";
import React, { Fragment, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import logo from "../assets/logo.png";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/constants/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

export default function LeftSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const logoutHandler = async () => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (text) => {
    // if (text === "Logout") logoutHandler();
    switch (text) {
      case "Logout":
        logoutHandler();
        break;
      case "Create":
        setOpen(true);
        break;

      default:
        break;
    }
  };

  const sidebarItems = [
    { icon: <Instagram />, text: "Instagram" },
    { icon: <House />, text: "Home" },
    { icon: <Search />, text: "Seach" },
    { icon: <Compass />, text: "Explore" },
    { icon: <MessageCircleIcon />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <SquarePlus />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <>
      <div className="fixed top-0 z-10 left-0 px-4 border-r-2 border-r-gray-300 w-[16%] h-screen ">
        <div className="flex flex-col items-start space-y-2">
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => {
                  sidebarHandler(item.text);
                }}
                className="flex gap-3 items-center relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                key={index}
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
}
