import React, { useState } from "react";
import { IoBookmarkOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
  hourlyPrice: any;
}

interface JobListProps {
  jobList: Job[];
  onSearchQueryChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  pagination: (page: number) => void;
  searchQuery: string;
  sortOption: string;
  currentPage: number;
  totalPages: number;
  jobCount: number;
  handleSearch:((query: string) => void)
}

const JobList: React.FC<JobListProps> = ({
  jobList,
  onSearchQueryChange,
  onSortChange,
  pagination,
  searchQuery,
  sortOption,
  currentPage,
  totalPages,
  jobCount,
  handleSearch
}) => {
  const [isExpanded, setIsExpanded] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    console.log(newPage);
    if (newPage > 0) pagination(newPage);
  };

  const toggleExpand = (id: string) => {
    setIsExpanded(isExpanded === id ? null : id);
  };

  const navigateToDetails = (jobId: string) => {
    localStorage.setItem("selectedJobId", jobId);
    navigate("/freelancer/job/details", { state: { jobId } });
  };
  const jobPostCount = jobCount; // Example count; replace with dynamic count from your API
  const postsPerPage = 3;
  const totalPage = Math.ceil(jobPostCount / postsPerPage);

  return (
    <div className="w-full mt-32">
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
            value={searchQuery}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
          <button className="bg-black h-10 text-white px-4 rounded ml-2" onClick={()=>onSearchQueryChange(searchQuery)}  >
            Search
          </button>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex mt-4 space-x-4">
          <span className="text-white">Sort By:</span>
          <select
            className="h-10 px-4 border border-gray-300 rounded focus:outline-none"
            value={sortOption}
            onChange={(e) => {
              onSortChange(e.target.value);
            }}
          >
            <option value="" disabled>
              Sort By (Optional)
            </option>
            <option value="lowToHigh">Price -- Low to High</option>
            <option value="highToLow">Price -- High to Low</option>
          </select>
        </div>
      </div>

      {/* Job Listings */}
      {jobList.length > 0 ? (
        jobList.map((job) => (
          <div
            key={job._id}
            className="w-full mt-4 bg-white cd backendrounded px-8 py-8 min-h-[250px] cursor-pointer"
            onClick={() => navigateToDetails(job._id)}
          >
            <div className="flex justify-between items-start">
              <h1 className="text-black text-xl font-bold">{job.title}</h1>
              <IoBookmarkOutline color="black" size={25} />
            </div>

            <p className="text-slate-400 text-sm mt-1">
              {job.paymentType} - {job.experience} - Est. Budget:{" "}
              {job.paymentType === "hourly"
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
              <p className="text-slate-500 mt-2">
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

            <div className="mt-4 flex flex-wrap gap-2">
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button
          className="px-4 py-2 border rounded"
          onClick={() => handlePageChange(currentPage - 1)}
          // disabled={currentPage <= 1}
        >
          Prev
        </button>

        {[...Array(totalPage)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              className={`px-4 py-2 border rounded mx-1 ${
                currentPage === pageNum ? "bg-gray-300" : ""
              }`}
              onClick={() => handlePageChange(pageNum)}
            >
             {pageNum}
            </button>
          );
        })}

        <button
          className="px-4 py-2 border rounded"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobList;
