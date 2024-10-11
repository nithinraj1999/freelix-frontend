import React from 'react'
import Navbar from '../../components/Navbar'
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../state/store';
import { useEffect } from 'react';
import Sidebar from '../../components/freelancer/SideBar';
import FreelancerNavbar from '../../components/freelancer/FreelancerNavbar';
function FreelancerLandingPage() {


  const { user } = useSelector((state: RootState) => state.user); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isFreelancerBlock) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <>
    <FreelancerNavbar/>
    <Sidebar/>
    </>
  )
}

export default FreelancerLandingPage
