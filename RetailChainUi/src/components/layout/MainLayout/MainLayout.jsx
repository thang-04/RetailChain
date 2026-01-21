// src/components/layout/MainLayout/MainLayout.jsx
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-gray-100 overflow-hidden h-screen flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
