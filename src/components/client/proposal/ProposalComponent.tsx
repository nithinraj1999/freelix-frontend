import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getJobDetails } from "../../../api/freelancer/freelancerServices";
import { IJobDetailsType } from "../../../../../backend/src/domain/entities/jobPost"
import { bidSchema } from "../../../utils/validation";
import { z } from "zod"; 

const ProposalComponent: React.FC = () => {
  const location = useLocation();
  const jobId = location.state?.jobId;

  const [jobDetails, setJobDetails] = useState<IJobDetailsType | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [formData, setFormData] = useState({
    bidAmount: "",
    deliveryDays: "",
    proposal: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const bidFormRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        const data = {
          jobID: jobId,
        };
        try {
          const response = await getJobDetails(data);
          setJobDetails(response.jobDetails);
        } catch (error) {
          console.error("Error fetching job details:", error);
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleBidSubmit = () => {
    if (validateForm()) {
      // Form is valid, perform submission
      console.log("Form submitted:", formData);
    }
  };

  return (
    <>
      <div className="mt-4 px-16 w-full">
        <div className="">
          <h1 className="text-2xl font-bold">{jobDetails?.title}</h1>
         
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
                You will be able to edit your bid until the project is awarded to someone.
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
                {errors.bidAmount && <p className="text-red-500">{errors.bidAmount}</p>}
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
                {errors.deliveryDays && <p className="text-red-500">{errors.deliveryDays}</p>}
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
              {errors.proposal && <p className="text-red-500">{errors.proposal}</p>}
            </div>

            <div className="mt-6 flex justify-between">
              <div className="flex-grow"></div>
              <button onClick={handleBidSubmit} className="h-10 w-32 bg-black text-white">
                Place Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProposalComponent;
