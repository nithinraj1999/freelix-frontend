import React, { useEffect, useState } from "react";
import { fetchAllBids } from "../../../api/freelancer/freelancerServices";
import { RootState } from "../../../state/store";
import { useSelector } from "react-redux";
const Proposal: React.FC = () => {
  
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  interface Bid {
    _id: string;
    bidAmount: number;
    deliveryDays: number;
    proposal: string;
    freelancerId: {
      _id: string;
      name: string;
      profilePicture: string;
      title: string;
    };
  }

  const proposalText = `Thank you for considering me for your logo design project. I am
    excited about the opportunity to bring your vision to life and
    create a memorable, impactful logo that will represent [Company/Brand Name].
    My goal is to craft a design that aligns with your brand’s identity and resonates
    with your target audience. Based on the job description, I understand that the logo
    should: Reflect the values and essence of [Company/Brand Name]. Appeal to [target
    audience, e.g., young professionals, tech-savvy customers]. Be versatile for various
    applications (e.g., digital platforms, print, merchandise). Incorporate specific style
    preferences or colors (as discussed or based on brand guidelines).`;

  // Limit to the first 100 words
  const displayText = isExpanded
    ? proposalText
    : proposalText.split(" ").slice(0, 100).join(" ") + "...";
  const jobId = localStorage.getItem("selectedJobId"); // Get jobId from state or local storage
  const [bids, setBids] = useState<Bid[]>([]);
  const [expandedBids, setExpandedBids] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    async function fetchBids() {
      if (!jobId) return;
      const data = { jobId};
      try {
        const allBids = await fetchAllBids(data);
        console.log(allBids);
        setBids(allBids.allBids);
       
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    }

    fetchBids();
  }, [jobId]);

  const toggleExpand = (bidId: string) => {
    setExpandedBids((prev) => ({
      ...prev,
      [bidId]: !prev[bidId],
    }));
  };

  return (
    <>
      <div className="mt-6 p-6 bg-white">
        <div className="flex">
          <div className="w-28 h-28">
            <img
              src="https://cdn.dribbble.com/userupload/17289615/file/original-a9daf23ee2cefd1ef724feff16ea1b30.jpg?resize=1200x900"
              alt="Profile"
            />
          </div>
          <div className="ml-4">
            <p className="font-semibold text-lg">Nithin Raj</p>
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
            <p className="text-gray-600">Graphic Design | Logo | Illustrator</p>
          </div>
        </div>
        <div className="">
          <p>{displayText}</p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:underline mt-2"
          >
            {isExpanded ? "View Less" : "View More"}
          </button>
        </div>
      </div>

{bids.filter(bid => bid.freelancerId._id == user?._id)
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
            </div>

            <div className="flex space-x-2 h-12 ">
              <button className="bg-black text-white px-4 py-2 rounded">
                Edit Bid
              </button>
             
            </div>
          </div>
        </div>
      ))}
     

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
            </div>

            <div className="flex space-x-2 h-12 ">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Chat
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Hire
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Proposal;
