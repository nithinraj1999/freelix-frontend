import React, { useState, useRef, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { userLogout } from "../state/slices/userSlice";
import { IoIosNotificationsOutline } from "react-icons/io";
import { RxEnvelopeClosed } from "react-icons/rx";
import { switchToSelling } from "../api/freelancer/freelancerServices";
import { userLogin } from "../state/slices/userSlice";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible((prev) => !prev);
  const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown

  const handleSigninClick = () => navigate("login");
  const handleJoin = () => navigate("signup");

  const handleLogout = () => {
    dispatch(userLogout()); // Dispatch logout action
    navigate("/"); // Navigate to home or login page
  };

  const handleDropdownToggle = () => setDropdownVisible((prev) => !prev);

  const postAJob = () => navigate("/post-a-job");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const becomeSeller = ()=>{
    navigate("/become-a-freelancer")
  }
  const switchToSellingMode = async (userID: string) => {
    const response = await switchToSelling(userID);
    if (response) {
      dispatch(userLogin(response.freelancerData));
      navigate("/freelancer");
    }
  };

  const yourYobPost = ()=>{
    navigate("/my-job-post")
  }
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
            {!user ? (
              <>
                <a href="#" className="text-neutral-50 ml-8 mr-4">
                  Hire Freelancer
                </a>
                <a href="#" className="text-neutral-50  mr-4">
                  Find job
                </a>
              </>
            ) : (
              <>
              <button className="text-neutral-50 ml-8 ">
                Hire Freelancer
              </button>
              <button className="text-neutral-50 ml-4 mr-4" onClick={yourYobPost}>
              Your posts
            </button>
            </>
            )}
          </div>

          {/* Right-aligned content for screens larger than `md` */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {!user.hasFreelancerAccount && (
                  <button
                    className="text-neutral-50   w-30 h-8 rounded"
                    onClick={becomeSeller}
                  >
                    Become A Freelancer
                  </button>
                )}

                <button
                  className="text-neutral-50 bg-green-400 font-bold w-24 h-8 rounded"
                  onClick={postAJob}
                >
                  Post a Job
                </button>
                <IoIosNotificationsOutline color="white" size={24} />
                <RxEnvelopeClosed color="white" size={24} />
                <p className="text-white">{user.name}</p>
                <div
                  className="relative"
                  ref={dropdownRef} // Attach ref to the dropdown container
                >
                  <img
                    src={
                      user.profilePicture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    } // Use a default image if none
                    alt={user.name}
                    className="w-8 h-8 rounded-full cursor-pointer object-cover"
                    onClick={handleDropdownToggle} // Toggle dropdown on click
                  />
                  {dropdownVisible && (
                    <div className="absolute right-0 mt-2 w-40 bg-neutral-800 rounded shadow-lg z-50">
                      <a
                        href="#"
                        className="block px-4 py-2 text-neutral-50 hover:bg-neutral-700"
                      >
                        Profile
                      </a>

                      {user.hasFreelancerAccount && (
                        <button
                          className="block w-full text-left px-4 py-2 text-neutral-50 hover:bg-neutral-700"
                          onClick={() => switchToSellingMode(user._id)}
                        >
                          Switch To Selling
                        </button>
                      )}
                      <button
                        className="block w-full text-left px-4 py-2 text-neutral-50 hover:bg-neutral-700"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button className="text-neutral-50" onClick={handleSigninClick}>
                  Sign in
                </button>
                <button
                  className="text-neutral-50 rounded border w-16 h-8"
                  onClick={handleJoin}
                >
                  Join
                </button>
              </>
            )}
          </div>

          {/* Small screen "Join" button */}
          <div className="md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
            <button
              className="text-neutral-50 rounded border w-16 h-8"
              onClick={handleJoin}
            >
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
};

export default Navbar;
