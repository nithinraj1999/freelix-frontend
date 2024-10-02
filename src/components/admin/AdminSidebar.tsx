import React from 'react';
import { useNavigate } from 'react-router-dom';
const AdminSidebar: React.FC = () => {

    const navigate = useNavigate()
    const handleClickOnClient = ()=>{
        navigate('/admin/clients')
    }

    const handleClickOnFreelancer =()=>{
        navigate('/admin/freelancer')
    }

    return (
        <div className="w-64 h-screen px-2 bg-gray-800 text-white">
        <div className="p-4">
            <h1 className="text-lg font-bold">Admin Panel</h1>
        </div>
        <ul className="mt-4">
            <li className="hover:bg-gray-700">
                <span className="block px-4 py-2 cursor-pointer">Dashboard</span>
            </li>
            <li className="hover:bg-gray-700">
                <span className="block px-4 py-2">Manage Users</span>
                <ul className="ml-4">
                    <li className="hover:bg-gray-600">
                        <span className="block px-4 py-2 cursor-pointer" onClick={handleClickOnClient}>Client</span>
                    </li>
                    <li className="hover:bg-gray-600">
                        <span className="block px-4 py-2 cursor-pointer"  onClick={handleClickOnFreelancer}>Freelancer</span>
                    </li>
                </ul>
            </li>
            <li className="hover:bg-gray-700">
                <span className="block px-4 py-2">Manage Categories</span>
                <ul className="ml-4">
                    <li className="hover:bg-gray-600">
                        <span className="block px-4 py-2 cursor-pointer">Main Category</span>
                    </li>
                    <li className="hover:bg-gray-600">
                        <span className="block px-4 py-2 cursor-pointer">Subcategory</span>
                    </li>
                </ul>
            </li>
            <li className="hover:bg-gray-700">
                <span className="block px-4 py-2 cursor-pointer">Manage Skills</span>
            </li>
        </ul>
    </div>
    );
};

export default AdminSidebar;
