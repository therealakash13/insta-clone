import React from "react";
import Post from "./Post";

export default function Posts() {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((item, index) => {
        return <Post />;
      })}
    </div>
  );
}
