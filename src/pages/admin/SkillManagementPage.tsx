
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Client from '../../components/admin/ClientManagement';
import { RootState } from '../../state/store';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SkillManagement from '../../components/admin/SkillManagement';

function SkillManagementPage() {

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
      <SkillManagement/>
      
    </div>
  </div>
  )
}

export default SkillManagementPage
