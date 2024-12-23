import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobDetails from '../../components/jobDetails/JobDetails';
import FreelancerNavbar from '../../components/freelancer/FreelancerNavbar';
import Proposal from '../../components/freelancer/Proposal/Proposals';

const JobBidPage: React.FC = () => {
  const { view = 'details' } = useParams<{ view: 'details' | 'proposals' }>();
  const navigate = useNavigate();

  const handleViewChange = (newView: 'details' | 'proposals') => {
    navigate(`/freelancer/job/${newView}`,{ replace: true });
  };
  
  return (
    <>
      <FreelancerNavbar />
      <div className='mt-32 px-16 flex space-x-3.5'>
        <h1 
          className={`cursor-pointer ${view === 'details' ? 'font-bold' : ''}`} 
          onClick={() => handleViewChange('details')}
        >
          Details
        </h1>
        <h1 
          className={`cursor-pointer ${view === 'proposals' ? 'font-bold' : ''}`} 
          onClick={() => handleViewChange('proposals')}
        >
          Proposals
        </h1>
      </div>
      {view === 'details' && <JobDetails />}
      {view === 'proposals' && <div className="mt-4 px-16 w-full"><Proposal /></div>}
    </>
  );
};

export default JobBidPage;
