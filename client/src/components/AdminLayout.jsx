import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FiMenu, FiHome, FiUserPlus } from 'react-icons/fi';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hovered, setHovered] = useState(false);

  const sidebarWidth = sidebarOpen || hovered ? 'w-64' : 'w-20';

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-md transform transition-all duration-300 ease-in-out ${sidebarWidth} 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-56'} md:relative md:translate-x-0`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex items-center justify-between h-16 border-b px-4">
          {(sidebarOpen || hovered) && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <div className="flex items-center">
            {sidebarOpen || hovered ? (
              <FaArrowLeft size={22} className="cursor-pointer" onClick={() => setSidebarOpen(false)} />
            ) : (
              <FaArrowRight size={22} className="cursor-pointer" onClick={() => setSidebarOpen(true)} />
            )}
          </div>
        </div>
        <nav className="mt-4 flex flex-col">
          <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-200 transition-all">
            <FiHome size={20} />
            {(sidebarOpen || hovered) && <span className="ml-3">Dashboard</span>}
          </Link>
          <Link to="/admin/accounts/create" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-200 transition-all">
            <FiUserPlus size={20} />
            {(sidebarOpen || hovered) && <span className="ml-3">Create Account</span>}
          </Link>
        </nav>
      </div>
      {(sidebarOpen || hovered) && (
        <div className="fixed inset-0 bg-opacity-30 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="flex items-center justify-between bg-white shadow p-4 md:p-6">
          <div className="flex items-center">
            <button className="md:hidden mr-4 text-gray-700 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu size={24} />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold">Admin Panel</h2>
          </div>
        </header>
        <main className="p-4 sm:p-6 md:p-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;