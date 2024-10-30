import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobDetails from '../../components/jobDetails/JobDetails';
import ProposalComponent from '../../components/client/JobPost/ProposalComponent';
import Navbar from '../../components/Navbar';
import JobDetail from '../../components/client/JobPost/MyJobDetails';
const MyJobDetails: React.FC = () => {
  const { view = 'details' } = useParams<{ view: 'details' | 'proposals' }>();
  const navigate = useNavigate();

  const handleViewChange = (newView: 'details' | 'proposals') => {
    navigate(`/job/${newView}`,{ replace: true });
  };
  
  return (
    <>
      <Navbar />
      <div className='mt-20 px-16 flex space-x-3.5'>
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
      {view === 'details' && <JobDetail />}
      {view === 'proposals' && <div className="mt-4 px-16 w-full"><ProposalComponent /></div>}
    </>
  );
};

export default MyJobDetails;
