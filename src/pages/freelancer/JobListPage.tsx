import React from "react";
import JobList from "../../components/freelancer/jobList/JobList";
import JobFilter from "../../components/freelancer/jobList/JobFilter";
import ProfileOverview from "../../components/freelancer/jobList/ProfileOverview";
import FreelancerNavbar from "../../components/freelancer/FreelancerNavbar";

const JobListPage: React.FC = () => {
  return (
    <>
    
      <FreelancerNavbar />
      <div className="flex px-16 justify-between h-screen ">
        {/* JobFilter - Fixed on the left side */}
        <div className="sticky top-16 h-[600px]  mt-32">
          <JobFilter />
        </div>
        {/* JobList - Scrollable in the middle */}
        <div className=" w-full mx-8 h-full scrollbar-hide ">
          <JobList />
        </div>
        {/* ProfileOverview - Fixed on the right side */}
        <div className="sticky top-16 h-[600px]  mt-32">
          <ProfileOverview />
        </div>
      </div>
    </>
  );
};

export default JobListPage;
