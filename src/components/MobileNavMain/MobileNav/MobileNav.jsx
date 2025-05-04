import React from "react";
import { Link } from "react-router-dom";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";

const MobileNav = () => {
  return (
    <div className="navbar bg-base-300 shadow-sm flex sticky justify-between p-5">
      <div className="flex-none">
        <Link to={'/'}>Logo</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to={'/notifications'}><IoMdNotificationsOutline size={30}/></Link>
        <Link to={'/chat'}><IoChatbubbleOutline size={25} /></Link>
      </div>
    </div>
  );
};

export default MobileNav;
