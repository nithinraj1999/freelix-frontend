import React from "react";
import ProfileHeader from "../../components/freelancer/profile/profileHeader";
import ProfileOverview from "../../components/freelancer/profile/ProfileOverview";
import Portfolio from "../../components/freelancer/profile/Portfolio";
import ProfileReview from "../../components/freelancer/profile/ProfileReview";
import ProfileSkills from "../../components/freelancer/profile/ProfileSkills";
import FreelancerNavbar from "../../components/freelancer/FreelancerNavbar";
const FreelancerProfile: React.FC = () => {
  return (
    <>
      <FreelancerNavbar />
      <div className="px-16 	">
        <div className="border-2 border-inherit	bg-white">
          <ProfileHeader />
          <ProfileOverview />
          <Portfolio />
          <ProfileReview />
          <ProfileSkills />
        </div>
      </div>
    </>
  );
};

export default FreelancerProfile;
