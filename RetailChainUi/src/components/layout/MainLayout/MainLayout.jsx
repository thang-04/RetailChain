import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-gray-100 overflow-hidden h-screen flex">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-y-auto flex flex-col scroll-smooth">
          <div className="flex-1 p-4 lg:p-10">
            <Outlet />
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
