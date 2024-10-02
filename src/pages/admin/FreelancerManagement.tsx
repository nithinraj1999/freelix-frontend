import React from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Client from '../../components/admin/ClientManagement';
import { RootState } from '../../state/store';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Freelancer from '../../components/admin/FreelancerMangement';

function FreelancerManagement() {

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
      <Freelancer/>
      
    </div>
  </div>
  )
}

export default FreelancerManagement
