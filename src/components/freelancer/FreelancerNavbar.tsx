import React, { useState, useRef, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { userLogout, userLogin } from "../../state/slices/userSlice";
import { switchToBuying } from "../../api/freelancer/freelancerServices";
import { IoIosNotificationsOutline } from "react-icons/io";
import { RxEnvelopeClosed } from "react-icons/rx";
import { HiOutlineFolderOpen } from "react-icons/hi2";
import JobNotification from "./jobNotification/JobNotification";

const FreelancerNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [jobNotificationVisible, setJobNotificationVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const toggleJobNotification = () => {
    setJobNotificationVisible((prev) => !prev);
  };
  const handleLogout = () => {
    const ACCESS_TOKEN_KEY = 'userAccessToken';
    localStorage.removeItem(ACCESS_TOKEN_KEY);

    dispatch(userLogout());
    navigate("/");
  };

  const handleDropdownToggle = () => {
    setDropdownVisible((prev) => !prev);
  };

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const switchToBuyingMode = async (userID: string) => {
    const response = await switchToBuying(userID);
    if (response) {
      dispatch(userLogin(response.freelancerData));
      navigate("/home");
    }
  };

  const becomeFreelancer = () => {
    navigate("/become-a-freelancer");
  };

  const profile = (userID: string) => {
    navigate("/freelancer/profile", { state: { userID } });
  };

  const getJobList = () => {
    navigate("/freelancer/job-list");
  };

  const goHome =()=>{
    navigate("/freelancer")
  }

  const openChat=()=>{
    navigate("/chat")
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
  {/* Freelancer Navbar */}
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
    <div className="flex flex-grow items-center justify-between px-4 md:px-0">
      {/* Left-aligned text for freelancer */}
      <div className="flex items-center">
        <h1 className="text-neutral-50 text-3xl font-bold">freelix</h1>
        <button className="text-neutral-50 ml-8 mr-4" onClick={goHome}>
         Home
        </button>
        <button className="text-neutral-50 ml-8 mr-4" onClick={getJobList}>
          Find Work
        </button>
      </div>

      {/* Right-aligned content for freelancer */}
      <div className="flex items-center space-x-4 justify-end">
        {user && (
          <>
            {/* <div className="relative">
              <HiOutlineFolderOpen
                color="white"
                size={24}
                onClick={toggleJobNotification}
                className="cursor-pointer"
              />

              {jobNotificationVisible && (
                <div className="absolute max-h-[300px] overflow-y-auto top-12 right-[-100px] w-[400px] bg-slate-800 h-[400px] z-50">
                  <JobNotification />
                </div>
              )}
            </div> */}
            {/* <IoIosNotificationsOutline
              color="white"
              size={24}
              className="cursor-pointer"
            /> */}
            <RxEnvelopeClosed
              color="white"
              size={24}
              className="cursor-pointer"
              onClick={openChat}
            />

            <div className="relative" ref={dropdownRef}>
              <img
                src={
                  user.profilePicture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt={user.name}
                className="w-8 h-8 rounded-full cursor-pointer object-cover"
                onClick={handleDropdownToggle}
              />
              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-40 bg-neutral-800 rounded shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-neutral-50 hover:bg-neutral-700"
                    onClick={() => profile(user._id)}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-neutral-50 hover:bg-neutral-700"
                    onClick={() => switchToBuyingMode(user._id)}
                  >
                    Switch To Buying
                  </button>
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
        )}
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
      <button onClick={getJobList} className="text-neutral-50">
        Find Work
      </button>
      
    </nav>
  </div>

  {/* Overlay to close sidebar when clicked outside */}
  {sidebarVisible && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-30"
      onClick={toggleSidebar}
    ></div>
  )}
</div>

  );
};

export default FreelancerNavbar;
