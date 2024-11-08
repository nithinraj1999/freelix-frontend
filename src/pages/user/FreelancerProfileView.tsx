import React from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../state/store'
import Navbar from '../../components/Navbar'
import ProfileHeader from '../../components/freelancer/profile/profileHeader'
import ProfileOverview from '../../components/freelancer/profile/ProfileOverview'
import Portfolio from '../../components/freelancer/profile/Portfolio'
import ProfileReview from '../../components/freelancer/profile/ProfileReview'
import ProfileSkills from '../../components/freelancer/profile/ProfileSkills'
import { IProfile } from '../freelancer/interfaces/profile'
import { fetchfreelancerDetails } from '../../api/client/clientServices'
const FreelancerProfileView = () => {

    const { user } = useSelector((state: RootState) => state.user); 
  const navigate = useNavigate();
  const location = useLocation();
  const freelancerId = location.state?.userID 

    console.log("freelancerId",freelancerId);
    
  
 const [freelancerData,setFreelancerData] =useState<IProfile>()

  useEffect(() => {
    async function fetchFreelancerDetails(userID: string) {
      const data = {
        freelancerId: userID
      };
      console.log("data...",data);
      
      const response = await fetchfreelancerDetails(data);
      console.log("response...",response);
      setFreelancerData(response.freelancerDetails)
    }
    if (freelancerId) {   
      fetchFreelancerDetails(freelancerId);
    }
  }, [user,freelancerId]);
  return (
    <>
    <Navbar/>
    <div className="px-16">
        <div className="border-2 border-inherit	bg-white">
          <ProfileHeader freelancerData={freelancerData}/>
          <ProfileOverview freelancerData={freelancerData}/>
          <Portfolio freelancerData={freelancerData}/>
          <ProfileReview />
          <ProfileSkills freelancerData={freelancerData}/>
        </div>
      </div>
   
    </>
  )
}

export default FreelancerProfileView
