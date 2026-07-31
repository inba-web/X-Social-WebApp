import React from "react";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdHomeFilled } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import XSvg from "../svgs/X";
import { useAuth } from "@clerk/clerk-react";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout successful");
      queryClient.setQueryData(["authUser"], null);
      queryClient.clear();
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const { data: authUser } = useQuery({
    queryKey: ["authUser"]
  });

  const navItem =
    "flex items-center gap-4 px-3 py-2 rounded-full transition-all hover:bg-stone-900";

  return (
    <aside className="flex flex-col h-screen sticky top-0 border-r border-base-300
                      w-20 md:w-[275px] px-2 flex-shrink-0 z-20 bg-black/30 backdrop-blur-md">

      {/* Logo */}
      <Link to="/" className="flex justify-center md:justify-start px-3 py-4">
        <XSvg className="w-8 h-8 fill-white" />
      </Link>

      {/* Navigation */}
      <ul className="flex flex-col gap-2 mt-4">
        <li>
          <Link to="/" className={`${navItem} justify-center md:justify-start`}>
            <MdHomeFilled className="w-6 h-6" />
            <span className="hidden md:block text-lg font-medium">Home</span>
          </Link>
        </li>

        <li>
          <Link
            to="/notifications"
            className={`${navItem} justify-center md:justify-start`}
          >
            <IoNotifications className="w-6 h-6" />
            <span className="hidden md:block text-lg font-medium">
              Notifications
            </span>
          </Link>
        </li>

        <li>
          <Link
            to={`/profile/${authUser?.userName}`}
            className={`${navItem} justify-center md:justify-start`}
          >
            <FaUser className="w-6 h-6" />
            <span className="hidden md:block text-lg font-medium">Profile</span>
          </Link>
        </li>
      </ul>

      {/* User Section */}
      {authUser && (
        <div className="mt-auto mb-6">
          <Link
            to={`/profile/${authUser.userName}`}
            className="flex items-center justify-center md:justify-between
                       gap-3 px-3 py-2 rounded-full hover:bg-[#181818] transition-all"
          >
            <img
              src={authUser.profileImg || "/avatar-placeholder.png"}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
            />

            <div className="hidden md:flex items-center justify-between flex-1">
              <p className="text-sm font-semibold truncate">
                {authUser.userName}
              </p>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              />
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

