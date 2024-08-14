import React from "react";
import Posts from "./Posts";

export default function Feed() {
  return (
    <div className="flex-1 my-8 flex flex-col items-center px-[20%]">
      <Posts />
    </div>
  );
}
