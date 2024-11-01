import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../state/store';
import { useEffect } from 'react';
import Sidebar from '../../components/freelancer/SideBar';
import FreelancerNavbar from '../../components/freelancer/FreelancerNavbar';
function FreelancerLandingPage() {
  
  const { user } = useSelector((state: RootState) => state.user); 
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isFreelancerBlock || user?.role !=="freelancer") {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <>
    <FreelancerNavbar/>
    <div className='flex'>
    <Sidebar/>
    </div>
    
    </>
  )
}

export default FreelancerLandingPage
