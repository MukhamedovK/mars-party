import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineChat, MdOutlineAddTask } from "react-icons/md";
import { FaRegCirclePlay } from "react-icons/fa6";
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import  MarsHub  from "/2025-05-04 08.20.24.jpg"

const Sidebar = () => {
  const routes = [
    { path: '/', name: 'Home', icon: <AiOutlineHome /> },
    { path: '/chat-list', name: 'Chat', icon: <MdOutlineChat /> },
    { path: '/projects', name: 'Projects', icon: <MdOutlineAddTask /> },
    { path: '/games', name: 'Games', icon: <FaRegCirclePlay /> },
  ];

  const swiperItems = [
    {
      title: "Online suxbatlashing!",
      image: "/chat.png",
      link: "/chat",
      buttonLabel: "Chatga o'tish",
    },
    {
      title: "Yangi loyiha qo'shing",
      image: "https://static.thenounproject.com/png/2534766-200.png",
      link: "/projects",
      buttonLabel: "Yangi loyiha qo'shing",
    },
    {
      title: "O'yinlarni ko'ring",
      image: "https://png.pngtree.com/png-clipart/20210912/original/pngtree-play-game-play-game-boy-png-image_6752383.jpg",
      link: "/games",
      buttonLabel: " O'yinlarni ko'ring",
    },
  ];

  return (
    <div className="w-full h-full p-5 bg-transparent">
      <div className="bg-base-300 w-full h-full rounded-2xl shadow-lg flex flex-col p-4">
        <div className='w-full flex justify-center'>
         <img src={MarsHub} alt="logo" className='w-[90ox] h-[90px] rounded-full' />
        </div>
        <div className="flex flex-col gap-2 mt-auto relative bottom-14">
          {routes.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-2 text-sm font-medium text-center p-3 bg-base-200 rounded-lg hover:bg-primary hover:text-white transition-all "
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>
        <div className="mt-auto w-full">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            Autoplay={
              {
                delay: 1000,
                disableOnInteraction: false,
              }
            }
            loop={true}
            modules={[Autoplay]}
            className="h-full w-full"
          >
            {swiperItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center gap-2 text-lg font-medium text-center p-3 bg-base-200 rounded-lg  transition-all w-full">
                  <img src={item.image} alt={item.title} className="h-12 w-12 object-cover" />
                  <p>{item.title}</p>
                  <Link
                    to={item.link}
                    className="btn btn-primary btn-outline"
                  >
                    {item.buttonLabel}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div >
  );
};

export default Sidebar;