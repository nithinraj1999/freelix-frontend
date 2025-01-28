import React, { useEffect, useState } from "react";
import { fetchAllBids } from "../../../api/freelancer/freelancerServices";
import { RootState } from "../../../state/store";
import { useSelector } from "react-redux";
import EditProposalModal from "./EditProposalModal";
import { withdrawMyBid } from "../../../api/freelancer/freelancerServices";
import { useNavigate } from "react-router-dom";
const Proposal: React.FC = () => {
  
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myBid, setMyBid] = useState<Bid | null>(null);
  
const navigate = useNavigate()
   interface Bid {
    _id: string;
    bidAmount: string;
    deliveryDays: string;
    proposal: string;
    freelancerId: {
      _id: string;
      name: string;
      profilePicture: string;
      title: string;
    };
    status:string
  }

  
  const jobId = localStorage.getItem("selectedJobId"); // Get jobId from state or local storage
  const [bids, setBids] = useState<Bid[]>([]);
  const [expandedBids, setExpandedBids] = useState<{ [key: string]: boolean }>(
    {}
  );

  const openEditModal = ()=>{
    setIsModalOpen(true)
  }
  useEffect(() => {
    async function fetchBids() {
      if (!jobId) return;
      const data = { jobId};
      try { 
        const allBids = await fetchAllBids(data);
        setBids(allBids.allBids);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    }

    fetchBids();
  }, [jobId]);

  useEffect(() => {
    if (bids.length > 0) {
      const bid = bids.find((bid) => bid.freelancerId._id === user?._id) || null;
      console.log("my bid",bid);
      
      setMyBid(bid);
    }
  }, [bids, user]);

  
  const toggleExpand = (bidId: string) => {
    setExpandedBids((prev) => ({
      ...prev,
      [bidId]: !prev[bidId],
    }));
  };


  const withdrawBid = async(bidID:string)=>{
    const data = {
      bidId:bidID
    }
    const response = await withdrawMyBid(data)
    if(response.success){
      navigate("/freelancer/job/details")
    }
    window.location.reload()

  }

  const truncatedContent = (content:any) => {
    const words = content.split(" ");
    return words.length > 60 ? `${words.slice(0, 60).join(" ")}...` : content;
  };

  return (
    <>
{bids.filter(bid => bid.freelancerId._id == user?._id && bid.status !=="Withdrawn")
      .map((bid) => (
        <div key={bid._id} className="mt-6 p-6 bg-white">
          <div className="flex">
            <div className="w-28 h-22">
              <img
                src={bid.freelancerId.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
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
            <div>
              <p className="text-3xl	font-bold	">${bid.bidAmount}</p>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex-grow">
              
      <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: expandedBids[bid._id]
            ? bid.proposal
            : truncatedContent(bid.proposal),
        }}
      />
              <button
                onClick={() => toggleExpand(bid._id)}
                className="text-blue-500 hover:underline mt-2"
              >
                {expandedBids[bid._id] ? "View Less" : "View More"}
              </button>
            </div>

            <div className="flex space-x-2 h-12 ">
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={()=>withdrawBid(bid._id)}>
                Withdraw Bid
              </button>
              <button className="bg-black text-white px-4 py-2 rounded" onClick={openEditModal}>
                Edit Bid
              </button>
            </div>
          </div>
        </div>
      ))}

      {isModalOpen &&
      (<EditProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bid={myBid}
        setBidDetails={setBids}
      />)
      }

      {bids.filter(bid => bid.freelancerId._id !== user?._id)
      .map((bid) => (
        <div key={bid._id} className="mt-6 p-6 bg-white">
          <div className="flex">
            <div className="w-28 h-22">
              <img
                src={bid.freelancerId.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
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
            <div>
              <p className="text-3xl	font-bold	">${bid.bidAmount}</p>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex-grow">
              {/* <p>
                {expandedBids[bid._id]
                  ? bid.proposal
                  : `${bid.proposal.split(" ").slice(0, 60).join(" ")}...`}
              </p> */}
              <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: expandedBids[bid._id]
            ? bid.proposal
            : truncatedContent(bid.proposal),
        }}
      />
              <button
                onClick={() => toggleExpand(bid._id)}
                className="text-blue-500 hover:underline mt-2"
              >
                {expandedBids[bid._id] ? "View Less" : "View More"}
              </button>
            </div>

           
          </div>
        </div>
      ))}
     
    </>
  );
};

export default Proposal;
