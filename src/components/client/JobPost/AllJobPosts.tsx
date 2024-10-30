import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import EditJobPostModal from "./EditJobPostModal";
import { getAllJobPosts } from "../../../api/client/clientServices";
import { deletepost } from "../../../api/client/clientServices";

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

const AllJobPosts: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<string | null>(null);
  const [jobList, setJobList] = useState<Job[]>([]);


  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobList = async () => {
      if (user?._id) {
        const data = { userID: user._id };
        const response = await getAllJobPosts(data);
        setJobList(response.jobPosts);
      }
    };
    fetchJobList();
  }, [user]);

  const toggleExpand = (id: string) => {
    setIsExpanded(isExpanded === id ? null : id);
  };

  

 
  const navigateToDetails = (jobId:string)=>{
    localStorage.setItem("clientSelectedJobId", jobId);
    navigate('/job/details',{ state: { jobId }})
  }

  return (
    <div className="mt-20 w-full px-16">
      <h1>Your Job Posts</h1>

      {jobList.length > 0 ? (
        jobList.map((job) => (
          <div
            key={job._id}
            className="w-full mt-4 bg-white rounded px-8 py-8 min-h-[200px] cursor-pointer"
            onClick={()=>navigateToDetails(job._id)}
          >
            <div className="flex justify-between items-start">
              <h1 className="text-black text-xl font-bold">{job.title}</h1>
            </div>

            <p className="text-slate-400 text-sm mt-1">
              {job.paymentType} - {job.experience} - Est. Budget:{" "}
              {job.paymentType === "hourly" && job.hourlyPrice
                ? `${job.hourlyPrice.from} - ${job.hourlyPrice.to}`
                : `$${job.fixedPrice}`}
            </p>

            <div
              className={`transition-all duration-300 ${
                isExpanded === job._id
                  ? "max-h-full"
                  : "max-h-[150px] overflow-hidden"
              }`}
            >
              <p
                className="text-slate-300 mt-2 text-slate-500"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {isExpanded === job._id
                  ? job.description
                  : `${job.description.split(" ").slice(0, 30).join(" ")}...`}
                {job.description.length > 100 && (
                  <span
                    className="text-blue-400 cursor-pointer ml-1"
                    onClick={() => toggleExpand(job._id)}
                  >
                    {isExpanded === job._id ? "See Less" : "See More"}
                  </span>
                )}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 w-full">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-slate-300 text-black rounded-full px-3 py-1 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600 mt-6">No jobs available</p>
      )}
    </div>
  );
};

export default AllJobPosts;
