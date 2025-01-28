
import React, { useEffect, useState } from "react";
import { fetchAllBids } from "../../../api/client/clientServices";
import socket from "../../../socket/socket";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../state/store";
import { useSelector } from "react-redux";

const ProposalComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  interface Bid {
    _id: string;
    bidAmount: number;
    deliveryDays: number;
    jobId: string;
    proposal: string;
    freelancerId: {
      _id: string;
      name: string;
      profilePicture: string;
      title: string;
    };
  }

  const jobId = localStorage.getItem("clientSelectedJobId");
  const [bids, setBids] = useState<Bid[]>([]);
  const [expandedBids, setExpandedBids] = useState<{ [key: string]: boolean }>({});

  const [deliveryFilter, setDeliveryFilter] = useState<[number, number] | null>(null);
  const [amountFilter, setAmountFilter] = useState<string>("any"); 
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const jobIdInString = jobId?.toString();

  useEffect(() => {
    if (jobIdInString) {
      socket.on(jobIdInString, (newBid) => {
        setBids((prevBids) => [...prevBids, newBid]);
      });

      socket.on("removeBid", (removedBid) => {
        setBids((prevBids) => prevBids.filter((bid) => bid._id !== removedBid.bidId));
      });

      async function fetchBids() {
        if (!jobId) return;
        const data = { jobId };
        try {
          const allBids = await fetchAllBids(data);
          setBids(allBids.bids);
        } catch (error) {
          console.error("Error fetching bids:", error);
        }
      }
      fetchBids();

      return () => {
        socket.off(jobIdInString);
      };
    }
  }, [jobId]);

  const toggleExpand = (bidId: string) => {
    setExpandedBids((prev) => ({
      ...prev,
      [bidId]: !prev[bidId],
    }));
  };

  const navigateToProfile = (userID: string) => {
    navigate("/freelancer-info", { state: { userID } });
  };

  const makePayment = async (bidAmount: number, jobId: string, freelancerId: string, bidId: string) => {
    const userId = user?._id;
    navigate("/checkout", {
      state: { bidAmount: bidAmount, jobId: jobId, freelancerId: freelancerId, bidId: bidId, userId: userId },
    });
  };

  // Apply filters and sorting
  const filteredAndSortedBids = bids
    .filter((bid) => {
      if (deliveryFilter !== null) {
        const [min, max] = deliveryFilter;
        if (bid.deliveryDays < min || bid.deliveryDays > max) return false;
      }

      // Filter by bid amount range (based on predefined ranges or "any")
      if (amountFilter !== "any") {
        const amountRange = amountFilter.split(",").map((val) => parseInt(val, 10));
        if (bid.bidAmount < amountRange[0] || bid.bidAmount > amountRange[1]) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.bidAmount - b.bidAmount || a.deliveryDays - b.deliveryDays;
      } else {
        return b.bidAmount - a.bidAmount || b.deliveryDays - a.deliveryDays;
      }
    });

  const handleAmountFilterChange = (value: string) => {
    setAmountFilter(value);
  };
  
  const navigateToChat = (freelancerId: string,name:string) => {
    navigate('/chat', { state: { freelancerId,name } });
  };
  
  const truncatedContent = (content:any) => {
    const words = content.split(" ");
    return words.length > 60 ? `${words.slice(0, 60).join(" ")}...` : content;
  };


  return (
    <>
      {/* Filters */}
      <div className="filters">
        {/* Delivery Days Filter */}
        <label>
          Filter by Delivery Days:
          <select
            onChange={(e) => {
              const value = e.target.value;
              setDeliveryFilter(value === "" ? null : JSON.parse(value)); 
            }}
            value={deliveryFilter ? JSON.stringify(deliveryFilter) : ""}
          >
            <option value="">All</option>
            <option value="[1,2]">1-2 days</option>
            <option value="[3,5]">3-5 days</option>
            <option value="[6,10]">6-10 days</option>
            <option value="[11,20]">11-20 days</option>
          </select>
        </label>

        {/* Bid Amount Range Filter */}
        <label>
          Filter by Bid Amount: 
          <select onChange={(e) => handleAmountFilterChange(e.target.value)} value={amountFilter}>
            <option value="any">Any</option>
            <option value="10000,20000">10,000 - 20,000</option>
            <option value="20000,30000">20,000 - 30,000</option>
            <option value="30000,40000">30,000 - 40,000</option>
            <option value="40000,50000">40,000 - 50,000</option>
            <option value="50000,50000">50,000+</option>
          </select>
        </label>

        {/* Sort Order */}
        <label>
          Sort By:
          <select onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")} value={sortOrder}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {/* Display Selected Filter */}
      <div>
        <p>Selected Bid Amount Filter: {amountFilter === "any" ? "Any" : amountFilter}</p>
      </div>

      {/* Display Bids */}
      {filteredAndSortedBids.map((bid) => (
        <div key={bid._id} className="mt-6 p-6 bg-white">
          <div className="flex">
            <div className="w-28 h-22">
              <img
                src={bid.freelancerId.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
                onClick={() => navigateToProfile(bid.freelancerId._id)}
              />
            </div>
            <div className="ml-4 flex-grow">
              <p className="font-semibold text-lg">{bid.freelancerId.name}</p>
              <div className="flex space-x-1 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">{bid.freelancerId.title}</p>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex-grow">
              {/* <p>{expandedBids[bid._id] ? bid.proposal : `${bid.proposal.split(" ").slice(0, 60).join(" ")}...`}</p> */}
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
              <div>
                <p>Delivery Days: {bid.deliveryDays} Days</p>
                <p>Bid Amount: ${bid.bidAmount}</p>
              </div>
            </div>

            <div className="flex space-x-2 h-12">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={()=>navigateToChat(bid.freelancerId._id,bid.freelancerId.name)}>Chat</button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => makePayment(bid.bidAmount, bid.jobId, bid.freelancerId._id, bid._id)}
              >
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
