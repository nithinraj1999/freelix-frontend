import React, { useEffect, useState, useRef } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { IJobDetailsType } from "../../../../../backend/src/domain/entities/jobPost";
import { getBidDetails } from "../../../api/freelancer/freelancerServices";
import EditProposalModal from "../Proposal/EditProposalModal";
const YourBidDetails: React.FC = () => {
    const location = useLocation();
    const bidID = location.state?.bidId
   
    const [isModalOpen, setIsModalOpen] = useState(false);


    interface IBidDetails {
        _id?: string;
        jobId:IJobDetailsType;
        bidAmount:number;
        freelancerId:string;
        proposal:string;
        deliveryDays:number
      }

      interface IBid{
        _id: string;
        bidAmount: number;
        deliveryDays: number;
        proposal: string;
    
      }
      
      const [bidDetails, setBidDetails] = useState<IBidDetails | null>(null);
      const [bid,setBid] = useState<IBid | null>(null)
  
    useEffect(() => {
        const fetchBidDetails = async () => {
          if (bidID) {
            const data = {
                bidID: bidID,
            };
            try {
  
              const bidDetails = await getBidDetails(data);
              console.log(bidDetails);
              setBid(bidDetails.myBidDetails)
              setBidDetails(bidDetails.myBidDetails)
            } catch (error) {
              console.error("Error fetching job details:", error);
            } 
          }
        };
    
        fetchBidDetails();
      }, [bidID]);
    

      
  const openEditModal = ()=>{    
    setIsModalOpen(true)
  }
    return (
      <>
        <div className="mt-4 px-8 w-full mt-[100px]">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">{bidDetails?.jobId?.title}</h1>
          </div>
         
          <div className="mt-2 p-6 bg-white">
            <label className="font-bold ">job description</label>
            <h1 className="mt-2">{bidDetails?.jobId?.description}</h1>
            <div className="pt-6 ">
              <p>Experience level : {bidDetails?.jobId?.experience}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-6 rounded-lg">
              {bidDetails?.jobId?.skills.map((skill, index) => (
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
                  ? `$${bidDetails?.jobId?.fixedPrice}`
                  : bidDetails?.jobId?.paymentType === "hourly"
                  ? `$${bidDetails?.jobId?.hourlyPrice?.from} - $${bidDetails?.jobId?.hourlyPrice?.to}/hour`
                  : "Price not available"}
              </h1>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <h1 className="text-2xl font-bold">Bid Details</h1>
            <div className="flex ">
            <button className="bg-black bg-gray-100 w-32 h-12">WithDraw Bid</button>
            <button className="bg-black text-white w-32 h-12" onClick={openEditModal}>Edit Bid</button>
            </div>
            {isModalOpen &&
      (<EditProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bid={bid}
      />)
      }
          </div>
         
          <div className="mt-2 p-6 bg-white">
            <label className="font-bold ">Your proposal</label>
            <h1 className="mt-2">{bidDetails?.proposal}</h1>
            <div className="pt-6 ">
              <p>Delivery days : {bidDetails?.deliveryDays}</p>
            </div>
            
  
            <div className="pt-6">
              <h1 className="font-bold">
                Bid Amount :{bidDetails?.bidAmount}
              </h1>
            </div>
          </div>
          
        </div>
  
      
      </>
    );
};

export default YourBidDetails;
