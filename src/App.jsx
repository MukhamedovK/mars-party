import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import MobileBottomNav from "./components/MobileNavMain/MobileBottomNav/MobileBottomNav";
import { Outlet } from "react-router-dom";
import UserList from "./components/UserList/UserList";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="flex min-h-screen">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0 w-60 lg:w-72`}
      >
        <Sidebar />
      </aside>

      <section className="flex flex-col flex-1 md:p-5">
        {isMobile ? (
          <MobileBottomNav />
        ) : (
          <Navbar
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            toggleUserList={() => setIsUserListOpen(!isUserListOpen)}
            isSidebarOpen={isSidebarOpen}
          />
        )}

        <div className="flex-1 flex flex-col lg:pt-3 md:flex-row gap-4 overflow-y-hidden">
          <Outlet />
          <div
            className={`fixed inset-y-0 right-0 z-50 w-60 transform transition-transform duration-300 ease-in-out 
              ${isUserListOpen ? "translate-x-0" : "translate-x-full"} 
              md:relative md:translate-x-0 md:w-72 max-h-[79.9vh]`}
          >
            <UserList />
          </div>
        </div>
      </section>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MobileBottomNav />
        </div>
      )}

      {(isSidebarOpen || isUserListOpen) && (
        <div
          className="fixed inset-0 bg-gray-900 opacity-20 z-40 md:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsUserListOpen(false);
          }}
        />
      )}
    </main>
  );
}

export default App;
