"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowersByIds, getUserByID } from "../redux/actions/auth";

const FollowTabs = () => {
  const [activeTab, setActiveTab] = useState("followers");
  const dispatch = useDispatch();
  const localData = JSON.parse(localStorage.getItem("profile"));
  const followers = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      image: "https://i.pravatar.cc/150?img=2",
    },
  ];

  const following = [
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      name: "Daisy Ridley",
      email: "daisy@example.com",
      image: "https://i.pravatar.cc/150?img=4",
    },
  ];

  const mainUser = useSelector((state) => state?.auth?.[0]);

  const followersData = async () => {
    if (mainUser?.followers?.length) {
      const data = await getFollowersByIds(mainUser.followers);
      console.log(data, "These are followers");
    }
  };

  // const followingData = async () => {
  //   if (mainUser?.following?.length) {
  //     const data = await getFollowersByIds(mainUser.following);
  //   //   console.log(data, "These are following");
  //   }
  // };

  useEffect(() => {
    if (localData?.result?._id) {
      dispatch(getUserByID(localData.result._id));
      console.log(localData.result._id);
    }
  }, [localData?.result?._id]);

  useEffect(() => {
    if (mainUser) {
      followersData();
      // followingData();
    }
  }, [mainUser]);

  return (
    <div className=" m-[2rem] mt-10 p-4 bg-white rounded-2xl shadow-lg">
      {/* Tabs */}
      <div className="flex justify-between border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("followers")}
          className={`flex-1 py-2 text-center font-semibold cursor-pointer ${
            activeTab === "followers"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 "
          }`}
        >
          Followers
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-2 text-center font-semibold cursor-pointer ${
            activeTab === "following"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Following
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {(activeTab === "followers" ? followers : following).map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg shadow-sm"
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowTabs;
