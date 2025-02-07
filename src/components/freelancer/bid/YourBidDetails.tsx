
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import { IJobDetailsType } from "../../../../../backend/src/domain/entities/jobPost";
import { getBidDetails } from "../../../api/freelancer/freelancerServices";
import EditProposalModal from "../Proposal/EditProposalModal";

const YourBidDetails: React.FC = () => {
   interface IJobDetailsType {
    category: string;
    createdAt: string;
    description: string;
    experience: string;
    file?: string | null;
    fixedPrice?: number;
    hourlyPrice?: {
      from: number;
      to: number;
    };
    paymentType: string;
    skills: string[];
    subCategory: string;
    title: string;
    userID: string;
    _id: string;
  }
  
  const location = useLocation();
  const bidID = location.state?.bidId;

  const [isModalOpen, setIsModalOpen] = useState(false);

  interface IBidDetails {
    _id?: string;
    jobId: IJobDetailsType;
    bidAmount: number;
    freelancerId: string;
    status?: string;
    proposal: string;
    deliveryDays: number;
  }

  const [bidDetails, setBidDetails] = useState<any>([]);

  useEffect(() => {
    const fetchBidDetails = async () => {
      if (bidID) {
        try {
          const response = await getBidDetails({ bidID });
          setBidDetails(response.myBidDetails);
        } catch (error) {
          console.error("Error fetching bid details:", error);
        }
      }
    };
    fetchBidDetails();
  }, [bidID]);

  const openEditModal = () => {
    setIsModalOpen(true);
  };  

  return (
    <div className="mt-4 px-8 w-full mt-[100px]">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{bidDetails?.jobId?.title || "Loading..."}</h1>
      </div>

      <div className="mt-2 p-6 bg-white">
        <label className="font-bold">Job Description</label>
        <div className="line-clamp-3 text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: bidDetails?.jobId?.description }} />

        {/* <h1 className="mt-2">{bidDetails?.jobId?.description || "No description available"}</h1> */}
        <div className="pt-6">
          <p>Experience level: {bidDetails?.jobId?.experience || "Not specified"}</p>

        </div>
        <div className="flex flex-wrap gap-2 pt-6 rounded-lg">
          {bidDetails?.jobId?.skills?.map((skill:any, index:any) => (
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
            {bidDetails?.jobId?.fixedPrice
              ? `$${bidDetails.jobId.fixedPrice}`
              : bidDetails?.jobId?.paymentType === "hourly"
              ? `$${bidDetails?.jobId?.hourlyPrice?.from} - $${bidDetails?.jobId?.hourlyPrice?.to}/hour`
              : "Price not available"}
          </h1>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <h1 className="text-2xl font-bold">Bid Details</h1>
        <div className="flex">
          {bidDetails?.status !== "Withdrawn" && (
            <>
              <button className="bg-gray-100 w-32 h-12">Withdraw Bid</button>
              <button
                className="bg-black text-white w-32 h-12"
                onClick={openEditModal}
              >
                Edit Bid
              </button>
            </>
          )}
        </div>
        {isModalOpen && (
          <EditProposalModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            bid={bidDetails}
            setBidDetails={setBidDetails}
          />
        )}
      </div>

      <div className="mt-2 p-6 bg-white">
        <label className="font-bold">Your Proposal</label>
        <div className="line-clamp-3 text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: bidDetails?.proposal }} />

        {/* <h1 className="mt-2">{bidDetails?.proposal || "No proposal available"}</h1> */}
        <div className="pt-6">
          <p>Delivery days: {bidDetails?.deliveryDays || "Not specified"}</p>
        </div>
        <div className="pt-6">
          <h1 className="font-bold">Bid Amount: {bidDetails?.bidAmount || "Not specified"}</h1>
        </div>
      </div>
    </div>
  );
};

export default YourBidDetails;
