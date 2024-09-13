// Navbar.tsx
import React, { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import Modal from "./ModalComponent"; // Import the Modal component
import { FcGoogle } from "react-icons/fc";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";

const Navbar: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  type ModalContentType =
    | "options"
    | "login"
    | "signup"
    | "resetPassword"
    | "verification";
  const [modalContentType, setModalContentType] =
    useState<ModalContentType>("options");

  const handleOptionClick = (type: ModalContentType) => () => {
    setModalContentType(type);
  };

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleArrowClick = () => {
    setModalContentType("options");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-neutral-900 md:px-16 h-20 flex items-center justify-between relative">
        {/* Menu Icon for Mobile */}
        <div className="md:hidden absolute left-4 top-1/2 transform -translate-y-1/2 z-50">
          <MdMenu
            className="text-neutral-50 w-8 h-8 cursor-pointer"
            onClick={toggleSidebar}
            aria-label="Menu"
          />
        </div>

        {/* Navbar Content */}
        <div className="flex flex-grow items-center justify-between">
          {/* Centered text for mobile */}
          <div className="md:hidden absolute inset-0 flex items-center justify-center">
            <h1 className="text-neutral-50 text-3xl font-bold">freelix</h1>
          </div>

          {/* Left-aligned text for screens larger than `md` */}
          <div className="hidden md:flex items-center">
            <h1 className="text-neutral-50 text-3xl font-bold">freelix</h1>
            <a href="#" className="text-neutral-50 ml-8 mr-4">
              Hire Freelancer
            </a>
            <a href="#" className="text-neutral-50">
              Find Work
            </a>
          </div>

          {/* Right-aligned content for screens larger than `md` */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-neutral-50">
              Become a Freelancer
            </a>
            <button className="text-neutral-50" onClick={openModal}>
              Sign in
            </button>
            <button className="text-neutral-50 rounded border w-16 h-8">
              Join
            </button>
          </div>

          {/* Small screen "Join" button */}
          <div className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
            <button className="text-neutral-50 rounded border w-16 h-8">
              Join
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-neutral-800 text-neutral-50 transform transition-transform duration-300 z-40 ${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <MdClose
            className="text-neutral-50 w-8 h-8 cursor-pointer"
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          />
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col p-4 space-y-4">
          <a href="#" className="text-neutral-50">
            Sign in
          </a>
          <a href="#" className="text-neutral-50">
            Hire Freelancer
          </a>
          <a href="#" className="text-neutral-50">
            Find Work
          </a>
          <a href="#" className="text-neutral-50">
            Become a Freelancer
          </a>
        </nav>
      </div>

      {/* Overlay to close sidebar when clicked outside */}
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Modal */}
      <Modal isOpen={modalVisible} onClose={closeModal} title="Sign In">
        {/* Modal Content */}

        {(() => {
          switch (modalContentType) {
            case "options":
              return (
                <>
                  <div>
                    <div>
                      <h1 className="text-2xl pt-14 pb-2 px-5 font-bold">
                        Sign in to your account
                      </h1>
                      <p className="px-5 pb-10">
                        Don’t have an account?{" "}
                        <span
                          className="underline cursor-pointer"
                          onClick={() => handleOptionClick("signup")()}
                        >
                          Join here
                        </span>
                      </p>
                    </div>
                    <div className="px-5 space-y-3.5">
                      <button className="border-2 w-full h-10 font-medium rounded-md flex items-center relative">
                        <span className="absolute left-5">
                          <FcGoogle />
                        </span>
                        <span className="w-full text-center">
                          Continue with Google
                        </span>
                      </button>

                      <button
                        className="border-2 w-full h-10 font-medium rounded-md flex items-center relative"
                        onClick={() => handleOptionClick("login")()}
                      >
                        <span className="absolute left-5">
                          <MdOutlineMailOutline />
                        </span>
                        <span className="w-full text-center">
                          Continue with Email & Password
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              );
            case "login":
              return (
                <>
                  <div>
                    <div>
                      <div className="py-4 px-5 flex items-center">
                        {/* Icon */}
                        <span className="flex items-center pr-3">
                          <IoArrowBack
                            onClick={handleArrowClick}
                            className="cursor-pointer"
                          />
                        </span>
                        {/* Text */}
                        <span className="text-sm">Back</span>
                      </div>

                      <h1 className="text-2xl px-5 font-bold">
                        Continue with Email or Username
                      </h1>
                    </div>
                    <div className="px-5 py-5 space-y-3.5">
                      <h1>Email or username</h1>
                      <input className="border-2 w-full h-10 font-medium rounded-md  " />

                      <h1>password</h1>
                      <input className="border-2 w-full h-10 font-medium rounded-md  " />
                      <h1 className="text-right underline cursor-pointer">
                        Forgot password?
                      </h1>
                    </div>
                  </div>
                </>
              );
            case "signup":
              return (
                <div>
                  <div>
                    <div className="py-4 px-5 flex items-center">
                      {/* Icon */}
                      <span className="flex items-center pr-3">
                        <IoArrowBack
                          onClick={handleArrowClick}
                          className="cursor-pointer"
                        />
                      </span>
                      {/* Text */}
                      <span className="text-sm">Back</span>
                    </div>

                    <h1 className="text-2xl px-5 font-bold">Signup</h1>
                  </div>
                  <div className="px-5 py-5 space-y-4">
                    <div>
                      <h1 className="font-medium">Name</h1>
                      <input className="border-2 w-full h-10 font-medium rounded-md px-3" />
                    </div>

                    <div>
                      <h1 className="font-medium">Email</h1>
                      <input
                        type="email"
                        className="border-2 w-full h-10 font-medium rounded-md px-3"
                      />
                    </div>

                    <div>
                      <h1 className="font-medium">Password</h1>
                      <input
                        type="password"
                        className="border-2 w-full h-10 font-medium rounded-md px-3"
                      />
                    </div>

                    <div>
                      <h1 className="font-medium">Phone Number</h1>
                      <input className="border-2 w-full h-10 font-medium rounded-md px-3" />
                    </div>

                    <button
                      className="border-2 w-full h-10  font-medium rounded-md"
                      onClick={() => handleOptionClick("verification")()}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              );
            case "verification":
              return (
                <div>
                  <div>
                    <div className="py-4 px-5 flex items-center">
                      {/* Icon */}
                      <span className="flex items-center pr-3">
                        <IoArrowBack
                          onClick={handleArrowClick}
                          className="cursor-pointer"
                        />
                      </span>
                      {/* Text */}
                      <span className="text-sm">Back</span>
                    </div>

                    <h1 className="text-2xl px-5 font-bold">
                      Verify your email
                    </h1>
                    <p>

                    </p>

                    {/* OTP Inputs */}
                    <div className="flex justify-center space-x-4 px-5 py-4">
                      <input
                        className="border-2 w-12 h-12 text-center text-xl rounded-md"
                        maxLength={1}
                        type="text"
                      />
                      <input
                        className="border-2 w-12 h-12 text-center text-xl rounded-md"
                        maxLength={1}
                        type="text"
                      />
                      <input
                        className="border-2 w-12 h-12 text-center text-xl rounded-md"
                        maxLength={1}
                        type="text"
                      />
                      <input
                        className="border-2 w-12 h-12 text-center text-xl rounded-md"
                        maxLength={1}
                        type="text"
                      />
                       <input
                        className="border-2 w-12 h-12 text-center text-xl rounded-md"
                        maxLength={1}
                        type="text"
                      />
                    </div>
                    <div>
                      <p className="mx-5 cursor-pointer underline">Resend OTP</p>
                    </div>
                    <div className="px-5 ">
                      <button className="cursor-pointer bg-black w-full  h-10 text-white" >Verify</button>
                    </div>
                  </div>
                </div>
              );
            case "resetPassword":
              return (
                <div>
                  {/* Reset Password content here */}
                  <h2 className="text-xl font-bold">Reset Password</h2>
                  {/* Additional reset password form elements */}
                </div>
              );
            default:
              return <div>Default Content</div>;
          }
        })()}
      </Modal>
    </>
  );
};

export default Navbar;
