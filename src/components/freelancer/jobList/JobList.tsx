import React, { useState, useEffect } from "react";
import { IoBookmarkOutline } from "react-icons/io5";
import { getJobList } from "../../../api/freelancer/freelancerServices";

const JobList: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<string | null>(null);
  const [jobList, setJobList] = useState<Job[]>([]);

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
  }

  useEffect(() => {
    const fetchJobList = async () => {
      const response = await getJobList();
        setJobList(response.jobList);
        console.log(response.jobList);
        console.log(response.jobList.skills);
    };

    fetchJobList();
  }, []);

  const toggleExpand = (id: string) => {
    setIsExpanded(isExpanded === id ? null : id);
  };



  return (
    <div className=" w-full mt-32 ">
      <div className="h-[230px] bg-customGreen px-8 py-8 rounded">
        <h1 className="text-2xl text-white font-bold">
          Are you looking for freelance jobs?
        </h1>
        <p className="text-slate-100 mt-2">
          Find freelance opportunities that match your skills. Browse listings
          and kickstart your next project today!
        </p>

        {/* Search Bar */}
        <div className="flex mt-4">
          <input
            type="text"
            placeholder="Find a job"
            className="h-10 w-full px-4 border border-gray-300 rounded focus:outline-none"
          />
          <button className="bg-black h-10 text-white px-4 rounded ml-2">
            Search
          </button>
        </div>
      </div>

      {/* Job Listings */}
      {jobList.length > 0 ? (
        jobList.map((job) => (
          <div
            key={job._id}
            className="w-full mt-4 bg-white	 rounded px-8 py-8 min-h-[250px] cursor-pointer "
          >
            <div className="flex justify-between items-start">
              <h1 className="text-black text-xl font-bold">
                {job.title}
              </h1>
              <IoBookmarkOutline color="black" size={25} />
            </div>

            {/* Job details below the title */}
            <p className="text-slate-400 text-sm mt-1">
              {job.paymentType} - {job.experience} - Est. Budget: ${job?.fixedPrice}
            </p>

            <div
              className={`transition-all duration-300  ${
                isExpanded === job._id ? "max-h-full" : "max-h-[150px] overflow-hidden"
              }`}
            >
              <p className="text-slate-300 mt-2 text-slate-500	">
                {isExpanded === job._id ? job.description : `${job.description.split(" ").slice(0, 30).join(" ")}...`}
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

            {/* Skills Section */}
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span key={index} className="bg-slate-300	 text-black rounded-full px-3 py-1 text-sm">
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

export default JobList;
