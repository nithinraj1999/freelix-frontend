import React from 'react';
import { SlEnvolope } from "react-icons/sl";
import { IoIosNotificationsOutline } from "react-icons/io";
import { adminLogout } from '../../state/slices/adminSlice';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../state/store';

const AdminNavbar: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin } = useSelector((state: RootState) => state.admin); // Get user from Redux store
  const handleLogout =()=>{
    localStorage.removeItem('accessToken');
    dispatch(adminLogout()); // Dispatch logout action
    navigate("/admin/login"); // Navigate to home or login page
  }

  

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Admin Panel</h1>
        <ul className="flex space-x-6 items-center">
          
          {/* <li>
            <SlEnvolope className="text-white text-2xl cursor-pointer hover:text-gray-300" />
          </li>

          <li>
            <IoIosNotificationsOutline className="text-white text-2xl cursor-pointer hover:text-gray-300" />
          </li> */}

          {/* Logout Button */}
          <li>
            <button className="text-white bg-red-600 hover:bg-red-700 p-2 rounded" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
