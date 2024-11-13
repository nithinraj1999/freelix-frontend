import React, { useEffect, useState } from "react";
import { fetchAllBids } from "../../../api/client/clientServices";
import socket from "../../../socket/socket";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../../state/store";
import { useSelector } from "react-redux";
const ProposalComponent: React.FC = () => {
  const navigate =useNavigate()
  const [isExpanded, setIsExpanded] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);

  interface Bid {
    _id: string;
    bidAmount: number;
    deliveryDays: number;
    jobId:string;
    proposal: string;
    freelancerId: {
      _id: string;
      name: string;
      profilePicture: string;
      title: string;
    };
  }
  const jobId = localStorage.getItem("clientSelectedJobId"); // Get jobId from state or local storage
  const [bids, setBids] = useState<Bid[]>([]);
  const [expandedBids, setExpandedBids] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [newBids, setNewBids] = useState<any[]>([]);
const jobIdInString =jobId?.toString()
  useEffect(() => {
    // Listen for new bids
    if(jobIdInString){

 
    socket.on(jobIdInString, (newBid) => {
        setNewBids((prevBids) => {
            const updatedBids = [...prevBids, newBid]; 
            return updatedBids; 
        });
    });
  }
  socket.on("removeBid", (newBid) => {
    setNewBids((prev) => prev.filter(item => item._id !== newBid.bidId));
});
    // Function to fetch existing bids
    async function fetchBids() {
        if (!jobId) return;
        const data = { jobId };
        try {
            const allBids = await fetchAllBids(data);
            console.log("Fetched Bids:", allBids);

            setBids(allBids.bids);
            // Logging directly after fetching
            console.log("Bids State Updated:", allBids.bids);
        } catch (error) {
            console.error("Error fetching bids:", error);
        }
    }

    // Call fetchBids
    fetchBids();

    // Cleanup on component unmount
    return () => {
        socket.off(jobIdInString); // Remove the listener to avoid memory leaks
    };
}, [jobId]); // Re-run effect if jobId changes


  const toggleExpand = (bidId: string) => {
    setExpandedBids((prev) => ({
      ...prev,
      [bidId]: !prev[bidId],
    }));
  };

  const navigateToProfile =(userID:string)=>{
    navigate("/freelancer-info",{ state: { userID }})
  }


  const makePayment = async(bidAmount:number,jobId:string,freelancerId:string,bidId:string)=>{
    const userId = user?._id
    navigate('/checkout', { state: { bidAmount: bidAmount,jobId:jobId,freelancerId:freelancerId,bidId:bidId,userId:userId } });
  }

  return (
    <>

      {/* realtime bids */}

      {newBids.map((bid) => (
        <div key={bid._id} className="mt-6 p-6 bg-white">
          <div className="flex" >
            <div className="w-28 h-22">
              <img
                src={bid.freelancerId.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
                onClick={()=>navigateToProfile(bid.freelancerId)}
              />
            </div> 

            <div className="ml-4 flex-grow">
              <p className="font-semibold text-lg">{bid.freelancerId.name}</p>
              <div className="flex space-x-1 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">{bid.freelancerId.title}</p>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex-grow">
              <p>
                {expandedBids[bid._id]
                  ? bid.proposal
                  : `${bid.proposal.split(" ").slice(0, 60).join(" ")}...`}
              </p>
              <button
                onClick={() => toggleExpand(bid._id)}
                className="text-blue-500 hover:underline mt-2"
              >
                {expandedBids[bid._id] ? "View Less" : "View More"}
              </button>
              <div>
              <p>Delivery Days : {bid.deliveryDays} Days</p>
              <p>Bid Amount : {bid.bidAmount}</p>
            </div>
            </div>
            

            <div className="flex space-x-2 h-12 ">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Chat
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={()=>makePayment(bid.bidAmount,bid.jobId._id,bid.freelancerId._id,bid._id)}>
                Hire
              </button>
            </div>
          </div>
        </div>
      ))}

        {/* ----- */}

      {bids.map((bid) => (
        <div key={bid._id} className="mt-6 p-6 bg-white " >
          <div className="flex cursor-pointer">
            <div className="w-28 h-22">
              <img
                src={bid.freelancerId.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover cursor-pointer"
                onClick={()=>navigateToProfile(bid.freelancerId._id)}
              />
            </div> 

            <div className="ml-4 flex-grow">
              <p className="font-semibold text-lg">{bid.freelancerId.name}</p>
              <div className="flex space-x-1 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">{bid.freelancerId.title}</p>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex-grow">
              <p>
                {expandedBids[bid._id]
                  ? bid.proposal
                  : `${bid.proposal.split(" ").slice(0, 60).join(" ")}...`}
              </p>
              <button
                onClick={() => toggleExpand(bid._id)}
                className="text-blue-500 hover:underline mt-2"
              >
                {expandedBids[bid._id] ? "View Less" : "View More"}
                
              </button>
              <div>
              <p>Delivery Days : {bid.deliveryDays} Days</p>
              <p>Bid Amount : {bid.bidAmount}</p>
            </div>
            </div>
            <div className="flex space-x-2 h-12 ">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Chat
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={()=>makePayment(bid.bidAmount,bid.jobId,bid.freelancerId._id,bid._id)}>
                Hire
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProposalComponent;
