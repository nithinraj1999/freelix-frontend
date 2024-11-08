import React, { useEffect } from "react";
import ProfileHeader from "../../components/freelancer/profile/profileHeader";
import ProfileOverview from "../../components/freelancer/profile/ProfileOverview";
import Portfolio from "../../components/freelancer/profile/Portfolio";
import ProfileReview from "../../components/freelancer/profile/ProfileReview";
import ProfileSkills from "../../components/freelancer/profile/ProfileSkills";
import FreelancerNavbar from "../../components/freelancer/FreelancerNavbar";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { RootState } from '../../state/store';
import { fetchfreelancerDetails } from "../../api/freelancer/freelancerServices";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { IProfile } from "./interfaces/profile";
const FreelancerProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user); 
  const navigate = useNavigate();
  const location = useLocation();
  const freelancerId = location.state?.userID 

  
  
 const [freelancerData,setFreelancerData] =useState<IProfile>()

  useEffect(() => {
    async function fetchFreelancerDetails(freelancerId: string) {
      const data = {
        freelancerId: freelancerId
      };
      const response = await fetchfreelancerDetails(data);
      console.log("response",response);
      setFreelancerData(response.freelancerDetails)
    }
    if (freelancerId) {   
      fetchFreelancerDetails(freelancerId);
    }
  }, [user,freelancerId]);
     
  
  return (
    <>
      <FreelancerNavbar />
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
  );
};

export default FreelancerProfile;
