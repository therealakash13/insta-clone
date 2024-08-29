import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetAllSuggestedUsers from "@/hooks/useGetAllSuggestedUsers";
import LeftSidebar from "./LeftSidebar";

export default function Home() {
  useGetAllPost();
  useGetAllSuggestedUsers();
  return (
    // <div className="grid grid-cols-3  w-screen">
    //   {/* <div className="flex-grow">
    //     <Feed />
    //     <Outlet />
    //   </div>
    //   <RightSidebar /> */}
    //   <div className="w-[35%] outline-dashed">
    //     <LeftSidebar />
    //   </div>
    //   <div className="w-[50%] outline-dashed">
    //     <Feed />
    //     <Outlet />
    //   </div>
    //   <div className="w-[15%] hidden vsm:block outline-dashed ">
    //     <RightSidebar />
    //   </div>
    // </div>
    <div className="flex w-screen">
      <div className="flex-[1]">
        <LeftSidebar />
      </div>
      <div className="flex-[5]">
        <Feed />
        <Outlet />
      </div>
      <div className="flex-[1]  hidden vsm:block">
        <RightSidebar />
      </div>
    </div>
  );
}
