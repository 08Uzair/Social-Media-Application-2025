"use client"
import React, { useState } from "react";
import news from "../../public/assets/news.png";
import friends from "../../public/assets/friends.png";
import group from "../../public/assets/group.png";
import marketplace from "../../public/assets/marketplace.png";
import watch from "../../public/assets/watch.png";
import shortcut1 from "../../public/assets/shortcut-1.png";
import shortcut2 from "../../public/assets/shortcut-2.png";
import shortcut3 from "../../public/assets/shortcut-3.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
const LeftSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
const navigate = useRouter()
  return (
    <>
      {/* Menu Button (Only Visible on Small Screens) */}
      <button 
        className="menu-btn md:hidden fixed top-[4rem] left-4  text-white px-3 py-2 rounded-md"
        onClick={() => setIsOpen(true)}
      >
        ☰ 
      </button>

      <div className={`left-sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn md:hidden" onClick={() => setIsOpen(false)}>✖</button>

        <div className="imp-links">
          <span className="cursor-pointer "><Image src={news} alt="News" />Latest News</span>
          <span onClick={()=>navigate.push("/friends")} className="cursor-pointer "><Image src={friends} alt="Friends" />Friends</span>
          <span className="cursor-pointer "><Image src={group} alt="Group" />Group</span>
          <span onClick={()=>navigate.push("/bookmark")} className="cursor-pointer "><Image src={marketplace} alt="Bookmark" />BookMark</span>
          <span className="cursor-pointer "><Image src={watch} alt="Watch" />Watch</span>
        </div>

        <div className="shortcut-links">
          <p>Your Shortcuts</p>
          <span><Image src={shortcut1} alt="Web Dev" />Web Developers</span>
          <span><Image src={shortcut2} alt="Web Design" />Web Design Course</span>
          <span><Image src={shortcut3} alt="Experts" />Website Experts</span>
        </div>
      </div>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default LeftSidebar;
