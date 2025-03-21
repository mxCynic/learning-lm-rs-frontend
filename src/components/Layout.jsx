import React from "react"; 
import { useState } from "react";
import { useEffect } from "react";
import Story from "./Story.jsx";
import Chat  from "./Chat.jsx";



function Layout() {
  const [page, setPage] = useState(1);

  console.log("Current page:", page); 

  useEffect(() => {
    console.log("Page updated to:", page);
  }, [page]);

  return (
    <div>
      <h1>Astro.js + Rust 后端示例</h1>
      <div className="model">
        <button className="story"
          onClick={() =>  {
            console.log("Story 按钮被点击");
            setPage(1);} }>Story
        </button>
        <button className="chat"
          onClick={() =>  {
            console.log("Chat按钮被点击");
            setPage(2);} }>Chat
        </button>
      </div>
      <div className="Pages">
        {page === 1 ? <Story /> : <Chat />}
      </div>
    </div>
  );
}

export default Layout;

