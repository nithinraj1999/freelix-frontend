import React, { useEffect, useState } from "react";
import { RootState } from "../../../state/store";
import { useSelector } from "react-redux";
import { myBids } from "../../../api/freelancer/freelancerServices";
import { useNavigate } from "react-router-dom";
// Dummy data for bids
const bids = [
  {
    jobTitle: "Website Redesign",
    bidAmount: "$500",
    submittedDate: "Oct 25, 2024",
    status: "Pending",
  },
  {
    jobTitle: "Mobile App Development",
    bidAmount: "$1200",
    submittedDate: "Oct 20, 2024",
    status: "Accepted",
  },
  {
    jobTitle: "E-commerce Platform Setup",
    bidAmount: "$750",
    submittedDate: "Oct 15, 2024",
    status: "Rejected",
  },
];

const YourBid: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  interface Job {
    _id: string;
    title: string;
  }
  interface Bid {
    _id: string;
    jobId: Job;
    createdAt: string;
    bidAmount: string;
    status: string;
  }

  const [allBids, setAllBids] = useState<Bid[]>([]);

  useEffect(() => {
    const data = {
      userId: user?._id,
    };
    async function fetchMyBids(data: object) {
      try {
        const response = await myBids(data);
        setAllBids(response.myBids);
        console.log(response);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    }

    if (data.userId) {
      fetchMyBids(data);
    }
  }, [user?._id]);

  const navigateToDetails = (bidId: string) => {
    navigate("/freelancer/your-bids/details", { state: { bidId } });
  };

  return (
    <div className="flex flex-col items-center mt-24 py-10 px-4 bg-gray-100 min-h-screen w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Bids</h2>
      <div className="space-y-4 w-full">
        {allBids.map((bid, index) => (
          <div
            key={index}
            className="w-full p-4 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigateToDetails(bid._id)}
          >
            <div className="flex justify-between items-center mb-2 w-full">
              <h3 className="text-lg font-semibold text-gray-700">
                {bid.jobId.title}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(bid.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Bid Amount: {bid.bidAmount}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  bid.status === "Accepted"
                    ? "bg-green-100 text-green-700"
                    : bid.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : bid.status === "Withdrawn"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {bid.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourBid;
