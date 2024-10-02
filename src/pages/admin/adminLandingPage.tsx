import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { RootState } from '../../state/store';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const AdminLandingPage: React.FC = () => {

  const navigate = useNavigate();
  const { admin } = useSelector((state: RootState) => state.admin); 
  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    }
  }, [admin, navigate]); 
  
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminNavbar />
        {/* You can add the main admin content here */}
        
      </div>
    </div>
  );
}

export default AdminLandingPage;
