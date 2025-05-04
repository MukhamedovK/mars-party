import React from "react";
import { NavLink } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { MdOutlineAddTask } from "react-icons/md";
import { IoGameControllerOutline } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { BsPersonFill } from "react-icons/bs";

// Filled icons
import { GoHomeFill } from "react-icons/go";
import { IoChatbubblesSharp } from "react-icons/io5";
import { IoGameController } from "react-icons/io5";

const MobileBottomNav = React.memo(() => {
  const routes = [
    { 
      path: "/", 
      name: "Home", 
      icon: <GoHome size={30} />, 
      activeIcon: <GoHomeFill size={30} /> 
    },
    {
      path: "/projects",
      name: "Projects",
      icon: <MdOutlineAddTask size={30} />,
      activeIcon: <MdOutlineAddTask size={30} /> // Note: No filled version available
    },
    { 
      path: "/games", 
      name: "Games", 
      icon: <IoGameControllerOutline size={30} />, 
      activeIcon: <IoGameController size={30} /> 
    },
    { 
      path: "/profile", 
      name: "Profile", 
      icon: <BsPerson size={30} />, 
      activeIcon: <BsPersonFill size={30} /> 
    },
  ];

  return (
    <nav className="btm-nav btm-nav-md shadow-lg flex py-3 bg-base-100 border-t border-base-200">
      {routes.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 transition-all duration-200 ${
              isActive
                ? "text-primary font-bold"
                : "text-base-content hover:text-primary hover:bg-base-200/50"
            }`
          }
          end={route.path === "/"}
        >
          {({ isActive }) => (isActive ? route.activeIcon : route.icon)}
        </NavLink>
      ))}
    </nav>
  );
});

MobileBottomNav.displayName = "MobileBottomNav";

export default MobileBottomNav;