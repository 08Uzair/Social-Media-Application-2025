"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import upload from "../../public/assets/upload.png";
import member1 from "../../public/assets/member-1.png";
import member2 from "../../public/assets/member-2.png";
import member3 from "../../public/assets/member-3.png";
import member4 from "../../public/assets/member-4.png";
import profile from "../../public/assets/profile-pic.png";
import feed from "../../public/assets/feed-image-1.png";
import profile1 from "../../public/assets/profile-pic.png";
import { uploadImageToCloudinary } from "../utility/uploadImage";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  getPosts,
  toggleFollow,
  toggleFollowing,
  toggleLike,
  updatePost,
} from "../redux/actions/post";
import FormattedDate from "../utility/formattedDate";
import { addBookMark, getBookMark } from "../redux/actions/bookMark";
import { getUserByID } from "../redux/actions/auth";
import BottomPopup from "./BottomPopup";
const MainContent = () => {
  const storyData = [
    {
      image: upload,
      title: "Post Story",
    },
    {
      image: member1,
      title: "Alison",
    },
    {
      image: member2,
      title: "Jackson",
    },
    {
      image: member3,
      title: "Samona",
    },
    {
      image: member4,
      title: "John Doe",
    },
  ];
  const [isModelOpen, setModelOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [localData, setLocalData] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.post.posts);
  const bookmark = useSelector((state) => state.bookmark.bookmark.marks);
  const users = useSelector((state) => state);
  // console.log(posts, " This are post");
  // console.log(bookmark, " This are bookmark");
  // console.log(users, " This are Users");
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const data = await uploadImageToCloudinary(file);
      // console.log(data);
      setImage(data);
    }
  };

  const handleLike = (id, userId) => {
    const isAlreadyLiked = likedPosts.has(id);
  
    if (isAlreadyLiked) {
      // If the post is already liked, remove it from the set
      setLikedPosts((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    } else {
      // If the post is not liked yet, add it to the set
      setLikedPosts((prev) => new Set(prev).add(id));
    }
  
    // Dispatch the like/unlike action to the store
    dispatch(toggleLike(id, userId));
  };
  

  useEffect(() => {
    setLocalData(JSON.parse(localStorage.getItem("profile")));
    dispatch(getPosts());
    dispatch(getBookMark());
  }, []);

  useEffect(() => {
    if (localData?.result?._id) {
      dispatch(getUserByID(localData?.result?._id));
    }
  }, [localData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      user: localData?.result?._id,
      image: image,
      title: title,
      content: content,
    };
    // console.log(data);
    dispatch(createPost(data));
    setImage("");
    setTitle("");
    setContent("");
  };

  const handleBookMark = (postId, userId) => {
    const data = {
      user: userId,
      post: postId,
    };
    dispatch(addBookMark(data));
    dispatch(updatePost(postId, { isBookMark: true }));

    setBookmarkedPosts((prev) => new Set(prev).add(postId));
  };

  const handleFollow = async (id, userId) => {
    await dispatch(toggleFollow(id, userId), toggleFollowing(userId, id));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3500);
  };
  return (
    <div className="main-content ">
      {isModelOpen ? (
        <>
          <div className="w-[100%] h-[100vh] backdrop-blur-md z-50 flex items-center justify-center flex-col fixed right-6">
            <div className="max-w-lg mx-auto bg-gray-100 p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Create Post</h2>

              <div className="mb-4">
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="mb-2 w-full rounded-md "
                  />
                )}
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="block w-full border-2 border-gray-400 p-2 rounded-2xl cursor-pointer"
                />
              </div>

              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-3 border rounded-md focus:ring focus:ring-blue-200"
              />

              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 mb-3 border rounded-md focus:ring focus:ring-blue-200"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModelOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="story-gallery overflow-x-scroll">
        {storyData.map((item, index) => {
          return (
            <div key={index} className="story story1">
              <Image src={item.image} alt="" />
              <p>{item.title}</p>
            </div>
          );
        })}
      </div>

      <div className="write-post-container shadow">
        <div className="user-profile">
          <Image
            width={200}
            height={200}
            src={localData?.result?.profileImage || profile}
            alt=""
          />
          <div className="">
            <p>
              {localData?.result?.firstName}{" "}
              {localData?.result?.surname || "User Name"}
            </p>
            <small>Public</small>
          </div>
        </div>
        <div className="post-input-container">
          <div className="w-full rounded-3xl border-2 border-gray-200 p-[15px]">
            {" "}
            Start a Post
          </div>
          <div className="add-post-links">
            <button
              onClick={() => setModelOpen(true)}
              className="p-[12px] cursor-pointer m-2 rounded-3xl bg-[#1876f2] text-[#fff]"
            >
              Create Post
            </button>
          </div>
        </div>
      </div>
      {posts?.map((item, index) => {
        return (
          <div key={index} className="post-container">
            <div className="post-row">
              <div className="user-profile">
                <Image
                  src={item?.user?.profileImage || profile}
                  width={200}
                  height={200}
                  alt=""
                />
                <div className="">
                  <p>
                    {" "}
                    {item?.user?.firstName} {item?.user?.surname || "User Name"}
                  </p>

                  <span>
                    {" "}
                    <FormattedDate dateString={item.createdAt} />
                  </span>

                  {item?.user?._id !== localData?.result?._id && (
                    <button
                      className={`follow-btn m-2 ${
                        users?.auth?.[0]?.following?.includes(item?.user?._id)
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                      onClick={() =>
                        handleFollow(item?.user?._id, localData?.result?._id)
                      }
                    >
                      {users?.auth?.[0]?.following?.includes(item?.user?._id)
                        ? "Following"
                        : "Follow"}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <button
                  onClick={() =>
                    handleBookMark(item._id, localData?.result?._id)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="cursor-pointer"
                    style={{
                      fill:
                        bookmark?.some(
                          (bookmarkItem) =>
                            bookmarkItem.user._id === localData?.result?._id &&
                            bookmarkItem.post._id === item._id
                        ) || bookmarkedPosts.has(item._id)
                          ? "green"
                          : "gray",
                    }}
                  >
                    <path d="M18.5 2h-12C4.57 2 3 3.57 3 5.5V22l7-3.5 7 3.5v-9h5V5.5C22 3.57 20.43 2 18.5 2zM15 18.764l-5-2.5-5 2.5V5.5C5 4.673 5.673 4 6.5 4h8.852A3.451 3.451 0 0 0 15 5.5v13.264zM20 11h-3V5.5c0-.827.673-1.5 1.5-1.5s1.5.673 1.5 1.5V11z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <p className="post-text">{item?.title} </p>
            <Image
              src={item.image || feed}
              width={800}
              height={800}
              alt=" feed"
              className="post-Image"
            />
            <div className="post-row">
              <div className="active-icons">
              <div
                  onClick={() => handleLike(item._id, localData?.result?._id)}
                  className="text-center flex items-center justify-center"
                >
                  {item.likes.includes(localData?.result?._id) ||
                  likedPosts.has(item._id) ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        className="mt-2 mr-2 cursor-pointer "
                        viewBox="0 0 24 24"
                        style={{ fill: "red" }}
                      >
                        <path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2zM4 10h2v9H4v-9zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7v1.819z" />
                      </svg>
                    </>
                  ) : (
                    <>
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        className="mt-2 mr-2 cursor-pointer "
                        viewBox="0 0 24 24"
                        style={{ fill: "gray" }}
                      >
                        <path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2zM4 10h2v9H4v-9zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7v1.819z" />
                      </svg>
                    </>
                  )}
                  {likedPosts.size || item.likes.length}
                </div>
                <div className="text-center flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    className="mt-2 mr-2 cursor-pointer "
                    viewBox="0 0 24 24"
                    style={{ fill: "gray" }}
                  >
                    <path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z"></path>
                  </svg>
                  45
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    className="mt-2 mr-2 cursor-pointer "
                    viewBox="0 0 24 24"
                    style={{ fill: "gray" }}
                  >
                    <path d="M5.5 15a3.51 3.51 0 0 0 2.36-.93l6.26 3.58a3.06 3.06 0 0 0-.12.85 3.53 3.53 0 1 0 1.14-2.57l-6.26-3.58a2.74 2.74 0 0 0 .12-.76l6.15-3.52A3.49 3.49 0 1 0 14 5.5a3.35 3.35 0 0 0 .12.85L8.43 9.6A3.5 3.5 0 1 0 5.5 15zm12 2a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5zm0-13A1.5 1.5 0 1 1 16 5.5 1.5 1.5 0 0 1 17.5 4zm-12 6A1.5 1.5 0 1 1 4 11.5 1.5 1.5 0 0 1 5.5 10z"></path>
                  </svg>
                  20
                </div>
              </div>
              <div className="post-profile-icon">
                <Image
                  alt="profile"
                  width={200}
                  height={200}
                  src={item?.user?.profileImage || profile1}
                />
              </div>
            </div>
          </div>
        );
      })}
      {showPopup && <BottomPopup message="Request Successfully 🫡" />}
      <button type="button" className="load-more-btn">
        Load More
      </button>
    </div>
  );
};

export default MainContent;
