import React, { useEffect, useState, useRef } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { getJobDetails } from "../../api/freelancer/freelancerServices";
import { IJobDetailsType } from "../../../../backend/src/domain/entities/jobPost";
import { bidSchema } from "../../utils/validation";
import { z } from "zod"; // For validation error handling
import { submitBid } from "../../api/freelancer/freelancerServices";
import { RootState } from "../../state/store";
import { useSelector } from "react-redux";
import { isBidAlreadyBid } from "../../api/freelancer/freelancerServices";
import Swal from 'sweetalert2';

const JobDetails: React.FC = () => {
  const location = useLocation();
  const jobId = location.state?.jobId || localStorage.getItem("selectedJobId"); // Get jobId from state or local storage

  const [jobDetails, setJobDetails] = useState<IJobDetailsType | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [isExistingBidder, setIsExistingBidder] = useState(false);
  const [loadingBidStatus, setLoadingBidStatus] = useState(true); // New loading state for bid status
  const [loading, setLoading] = useState(false); // New loading state for the button

  const [formData, setFormData] = useState({
    bidAmount: "",
    deliveryDays: "",
    proposal: "",
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const bidFormRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  const navigate = useNavigate()

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        const data = {
          jobID: jobId,
        };
        try {
          const isExistingBidder = await isBidAlreadyBid(
            jobId,
            user ? user._id : ""
          );

          const job = await getJobDetails(data);
          console.log(isExistingBidder);
          if (isExistingBidder.isExist) {
            setIsExistingBidder(true);
           
          }
          setJobDetails(job.jobDetails);
        } catch (error) {
          console.error("Error fetching job details:", error);
        } finally {
          setLoadingBidStatus(false); // Loading complete
        }
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleBidClick = () => {
    setShowBidForm(true);
    setTimeout(() => {
      bidFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
    }
  };

  const validateForm = () => {
    try {
      bidSchema.parse(formData); // Validate using Zod
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleBidSubmit = async () => {
    if (validateForm()) {
      try {
        const payload = {
          jobId,
          freelancerId: user?._id,
          bidAmount: formData.bidAmount,
          deliveryDays: formData.deliveryDays,
          proposal: formData.proposal,
        };

        const response = await submitBid(payload);
        if(response.success){
         navigate('/freelancer/job/proposals')
        }else if(!response.success){
          Swal.fire({
            title: 'Something went wrong',
            text: 'Please try again or contact support if the problem persists.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error("Error submitting bid:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  const handleCancelClick = () => {
    setShowBidForm(false); // Close the bid form
    setFormData({
      bidAmount: "",
      deliveryDays: "",
      proposal: "",
    }); // Reset form data
  };

  return (
    <>
      <div className="mt-4 px-16 w-full">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{jobDetails?.title}</h1>
          {!loadingBidStatus && !isExistingBidder && (
            <button
              className="bg-black text-white w-32 h-12 rounded"
              onClick={handleBidClick}
            >
              Bid on This Job
            </button>
          )}
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
      </div>

      {showBidForm && (
        <div ref={bidFormRef} className="px-16 mt-6 w-full">
          <div className="bg-white w-full p-6">
            <div className="bg-white w-full">
              <p className="font-bold">Place a bid on this project</p>
            </div>
            <div className="w-full">
              <p className="mt-2">
                You will be able to edit your bid until the project is awarded
                to someone.
              </p>
            </div>

            <div className="w-full flex space-x-4 mt-6">
              {/* Bid Amount Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Bid Amount
                </label>
                <input
                  type="number"
                  name="bidAmount"
                  value={formData.bidAmount}
                  onChange={handleInput}
                  className="border-2 border-gray-300 h-10 rounded-lg px-3 mt-1 w-full"
                  placeholder="Enter bid amount"
                />
                {errors.bidAmount && (
                  <p className="text-red-500">{errors.bidAmount}</p>
                )}
              </div>

              {/* Delivery Days Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Days
                </label>
                <input
                  type="number"
                  name="deliveryDays"
                  value={formData.deliveryDays}
                  onChange={handleInput}
                  className="border-2 border-gray-300 h-10 rounded-lg px-3 mt-1 w-full"
                  placeholder="Enter delivery days"
                />
                {errors.deliveryDays && (
                  <p className="text-red-500">{errors.deliveryDays}</p>
                )}
              </div>
            </div>

            {/* Proposal Input */}
            <div className="w-full mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Describe your proposal
              </label>
              <textarea
                ref={textareaRef}
                name="proposal"
                value={formData.proposal}
                onChange={handleInput}
                className="border-2 border-gray-300 rounded-lg p-3 mt-1 w-full resize-none"
                placeholder="Write your proposal here..."
                rows={8}
                onInput={handleInputResize}
              />
              {errors.proposal && (
                <p className="text-red-500">{errors.proposal}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
            <button
                onClick={handleBidSubmit}
                className="h-10 w-32 bg-black text-white flex justify-center items-center"
                disabled={loading} // Disable button during loading
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  "Submit Bid"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobDetails;
