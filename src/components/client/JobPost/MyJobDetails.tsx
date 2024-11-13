import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IJobDetailsType } from "../../../../../backend/src/domain/entities/jobPost";
import { RootState } from "../../../state/store";
import { useSelector } from "react-redux";
import { selectedJobDetails } from "../../../api/client/clientServices";
import EditJobPostModal from "./EditJobPostModal";
import { deletepost } from "../../../api/client/clientServices";
import Swal from 'sweetalert2';

const JobDetail: React.FC = () => {
  interface Job {
    _id: string;
    userID: string;
    title: string;
    category: string;
    subCategory: string;
    paymentType: string;
    experience: string;
    fixedPrice?: number;
    description: string;
    skills: string[];
    hourlyPrice?: { from: number; to: number };
  }
  const location = useLocation();
  const jobId =
    location.state?.jobId || localStorage.getItem("clientSelectedJobId"); // Get jobId from state or local storage

  const [jobDetails, setJobDetails] = useState<IJobDetailsType | null>(null);
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        const data = {
          jobID: jobId,
        };
        try {
          const response = await selectedJobDetails(data);
          if (response) {
            setJobDetails(response.jobDetails);
          }
          console.log(response);
        } catch (error) {
          console.error("Error fetching job details:", error);
        }
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleEditClick = () => {
    console.log("handleEditClick...", jobDetails);

    setSelectedJob(jobDetails);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };


const deletePost = async (jobId: string) => {
  // Show a confirmation dialog using SweetAlert
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  });

  // If the user confirms, proceed with the deletion
  if (isConfirmed) {
    try {
      const data = { jobId: jobId };
      const response = await deletepost(data);
      if (response) {
        setJobDetails(null); // Clear job details after deletion
        navigate("/my-job-post")
        // Show a success message
        Swal.fire('Deleted!', 'Your job has been deleted.', 'success');
      }
    } catch (error) {
      console.error(`Error deleting job:`, error);
      // Optionally, show an error message
      Swal.fire('Error!', 'There was an error deleting the job.', 'error');
    }
  }
};


  return (
    <>
      <div className="mt-4 px-16 w-full">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{jobDetails?.title}</h1>
          <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleEditClick()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Post
          </button>
          <button
            className="bg-gray-200 text-black px-4 py-2 rounded"
            onClick={() => jobDetails?._id && deletePost(jobDetails._id)}
          >
            Delete Post
          </button>
        </div>
        </div>
        <div className="mt-6 p-6 bg-white">
          <h1>{jobDetails?.description}</h1>
          <div className="pt-6">
            <p>Experience level : {jobDetails?.experience}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-6 rounded-lg">
            {jobDetails?.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-6">
            <h1 className="font-bold">
              {jobDetails?.fixedPrice
                ? `$${jobDetails.fixedPrice}`
                : jobDetails?.paymentType === "hourly"
                ? `$${jobDetails.hourlyPrice?.from} - $${jobDetails.hourlyPrice?.to}/hour`
                : "Price not available"}
            </h1>
          </div>
        </div>
        {jobDetails && (
          <EditJobPostModal
            isOpen={isModalOpen}
            onClose={closeModal}
            jobData={jobDetails}
          />
        )}
        
      </div>
    
    </>
  );
};

export default JobDetail;
