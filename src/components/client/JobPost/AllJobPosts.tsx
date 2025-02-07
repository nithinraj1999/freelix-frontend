import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../../../state/store";
import { getAllJobPosts } from "../../../api/client/clientServices";

// Define Job Interface
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

// Define API Response Type
interface JobResponse {
  jobPosts: {
    totalDocs: number;
    MyPost: Job[];
  };
}

// Pagination limit
const POSTS_PER_PAGE = 3;

const AllJobPosts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery<JobResponse>({
    queryKey: ["jobPosts", user?._id, debouncedSearch, currentPage],
    queryFn: async () => {
      if (!user?._id) return { jobPosts: { totalDocs: 0, MyPost: [] } };
      return await getAllJobPosts({
        userID: user._id,
        searchQuery: debouncedSearch,
        page: currentPage,
      });
    },
    enabled: !!user?._id,
  });
  useEffect(() => {
    if (!isLoading && searchInputRef.current) {
    
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    console.log("second effect");

  }, [isLoading, debouncedSearch])
  // Extract jobs & pagination data
  const jobList = data?.jobPosts.MyPost || [];
  const totalPages = Math.ceil((data?.jobPosts.totalDocs || 0) / POSTS_PER_PAGE);

  const navigateToDetails = (jobId: string) => {
    localStorage.setItem("clientSelectedJobId", jobId);
    navigate(`/job/details`, { state: { jobId } });
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  console.log("jobpost component");
  
  if (isLoading) {
    return (
      <div className="w-full px-8 lg:px-16 bg-gray-50 min-h-screen p-10 space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="w-full bg-white shadow-md rounded-lg p-6 animate-pulse">
            <div className="w-32 h-6 bg-gray-300 rounded"></div>
            <p className="mt-2 w-1/3 h-4 bg-gray-300 rounded"></p>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load jobs. Please try again.</p>;
  }

  return (
    <div className="w-full px-8 lg:px-16 bg-gray-50 min-h-screen p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Job Posts</h1>
      
      {/* Search Field */}
      <div className="mb-6">
        <input
          type="text"
          ref={searchInputRef}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by job title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {jobList.length > 0 ? (
        <div className="space-y-4">
          {jobList.map((job) => (
            <div
              key={job._id}
              className="w-full bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => navigateToDetails(job._id)}
            >
              <div className="flex justify-between items-start">
                <h1 className="text-lg font-semibold text-gray-800">{job.title}</h1>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    job.paymentType === "hourly" ? "bg-indigo-100 text-indigo-800" : "bg-teal-100 text-teal-800"
                  }`}
                >
                  {job.paymentType}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                {job.experience && (
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium mr-2">
                    {job.experience}
                  </span>
                )}
                Est. Budget: {job.paymentType === "hourly" && job.hourlyPrice
                  ? `$${job.hourlyPrice.from} - $${job.hourlyPrice.to}/hr`
                  : `$${job.fixedPrice}`}
              </p>
              <div className="line-clamp-3 text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: job.description }} />
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No jobs available</p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              currentPage <= 1 ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-gray-800 border-gray-400 hover:bg-gray-100"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                className={`px-4 py-2 rounded-md text-sm font-medium border ${
                  currentPage === pageNum ? "bg-blue-500 text-white" : "text-gray-800 border-gray-400 hover:bg-gray-100"
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              currentPage >= totalPages ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-gray-800 border-gray-400 hover:bg-gray-100"
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllJobPosts;
