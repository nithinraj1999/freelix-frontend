import React, { useState } from 'react';
import { MdMenu, MdClose } from 'react-icons/md'; // Import menu and close icons

function Navbar() {
  // State to track sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Toggle the sidebar menu
  const toggleSidebar = () => {
    console.log("Sidebar toggle clicked"); // Debug log
    setSidebarVisible(prev => {
      console.log("Toggling sidebar, new state:", !prev); // Debug log
      return !prev;
    });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-neutral-900  md:px-16  h-20 flex items-center justify-between relative">
        
        {/* Menu Icon for Mobile */}
        <div className="md:hidden absolute left-4 top-1/2 transform -translate-y-1/2 z-50">
          <MdMenu 
            className="text-neutral-50 w-8 h-8 cursor-pointer" 
            onClick={toggleSidebar} 
            aria-label="Menu" // Accessibility improvement
          />
        </div>

        {/* Navbar Content */}
        <div className="flex flex-grow items-center justify-between">
          {/* Centered text for mobile */}
          <div className="md:hidden absolute inset-0 flex items-center justify-center">
            <h1 className="text-neutral-50 text-3xl font-bold">freelix</h1>
          </div>

          {/* Left-aligned text for screens larger than `md` */}
          <div className="hidden md:flex items-center ">
            <h1 className="text-neutral-50 text-3xl font-bold">freelix</h1>
            <a href="#" className="text-neutral-50 ml-8 mr-4">Hire Freelancer</a>
            <a href="#" className="text-neutral-50 ">Find Work</a>
          </div>

          {/* Right-aligned content for screens larger than `md` */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-neutral-50">Become a Freelancer</a>
            <a href="#" className="text-neutral-50">Sign in</a>
            <button className="text-neutral-50 rounded border w-16 h-8">Join</button>
          </div>

          {/* Small screen "Join" button */}
          <div className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
            <button className="text-neutral-50 rounded border w-16 h-8">Join</button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-neutral-800 text-neutral-50 transform transition-transform duration-300 z-40 ${
          sidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <MdClose 
            className="text-neutral-50 w-8 h-8 cursor-pointer" 
            onClick={toggleSidebar} 
            aria-label="Close Sidebar" // Accessibility improvement
          />
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col p-4 space-y-4">
          <a href="#" className="text-neutral-50">Sign in</a>
          <a href="#" className="text-neutral-50">Hire Freelancer</a>
          <a href="#" className="text-neutral-50">Find Work</a>
          <a href="#" className="text-neutral-50">Become a Freelancer</a>
        </nav>
      </div>

      {/* Overlay to close sidebar when clicked outside */}
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default Navbar;
























