import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { getAllJobPosts } from "../../../api/client/clientServices";

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
  const [jobList, setJobList] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 3;
  const [totalpage, setTotalPage] = useState(1);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobList = async () => {
      if (user?._id) {
        const data = { userID: user._id, searchQuery, page: currentPage };
        const response = await getAllJobPosts(data);
        setTotalPage(response.jobPosts.totalDocs);
        setJobList(response.jobPosts.MyPost);
        setIsLoading(false);
      }
    };
    fetchJobList();
  }, [user, searchQuery, currentPage]);



  const navigateToDetails = (jobId: string) => {
    localStorage.setItem("clientSelectedJobId", jobId);
    navigate("/job/details", { state: { jobId } });
  };

  const totalPages = Math.ceil(totalpage / postsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  }; 

 

  return (
    <>
      {isLoading ? (
        <div className="w-full px-8 lg:px-16 bg-gray-50 min-h-screen p-10 space-y-6">
          <div className="flex items-center space-x-4"></div>
          <div className="w-full">
            <div className="w-full h-12 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="w-full bg-white shadow-md rounded-lg p-6"
              >
                <div className="flex justify-between items-start">
                  <h1 className="w-32 h-6 bg-gray-300 rounded animate-pulse"></h1>
                  <span className="w-20 h-6 bg-gray-300 rounded animate-pulse"></span>
                </div>
                <p className="mt-2">
                  <span className="w-1/3 h-4 bg-gray-300 rounded animate-pulse"></span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[...Array(3)].map((_, index) => (
                    <span
                      key={index}
                      className="w-24 h-6 bg-gray-300 rounded animate-pulse"
                    ></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full px-8 lg:px-16 bg-gray-50 min-h-screen p-10">
          <h1 className="text-3xl font-bold  text-gray-800 mb-6">
            Your Job Posts
          </h1>
          {/* Search Field */}
          <div className="mb-6">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by job title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* {jobList.length > 0 ? (
            <div className="space-y-4">
              {jobList.map((job) => (
                <div
                  key={job._id}
                  className="w-full bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigateToDetails(job._id)}
                >
                  <div className="flex justify-between items-start">
                    <h1 className="text-lg font-semibold text-gray-800">
                      {job.title}
                    </h1>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        job.paymentType === "hourly"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-teal-100 text-teal-800"
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
                    Est. Budget:{" "}
                    {job.paymentType === "hourly" && job.hourlyPrice
                      ? `$${job.hourlyPrice.from} - $${job.hourlyPrice.to}/hr`
                      : `$${job.fixedPrice}`}
                  </p>

                  
                    <div
                      className="line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                 <div className="mt-4 flex flex-wrap gap-2">
  {job.skills.map((skill, index) => (
    <span
      key={index}
      className="bg-purple-200 text-purple-800 rounded-full px-3 py-1 text-xs font-medium"
    >
      {skill}
    </span>
  ))}
</div>

                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6">No jobs available</p>
          )} */}
          {jobList.length > 0 ? (
  <div className="space-y-4">
    {jobList.map((job) => (
      <div
        key={job._id}
        className="w-full bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer"
        onClick={() => navigateToDetails(job._id)}
      >
        <div className="flex justify-between items-start">
          <h1 className="text-lg font-semibold text-gray-800">
            {job.title}
          </h1>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              job.paymentType === "hourly"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-teal-100 text-teal-800"
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
          Est. Budget:{" "}
          {job.paymentType === "hourly" && job.hourlyPrice
            ? `$${job.hourlyPrice.from} - $${job.hourlyPrice.to}/hr`
            : `$${job.fixedPrice}`}
        </p>

        <div
          className="line-clamp-3 text-gray-700 mt-2"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
        
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium"
            >
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
          <div className="flex justify-center items-center mt-10 space-x-2">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                currentPage <= 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-gray-800 border-gray-400 hover:bg-gray-100"
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
                    currentPage === pageNum
                      ? "bg-blue-500 text-white"
                      : "text-gray-800 border-gray-400 hover:bg-gray-100"
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                currentPage >= totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-gray-800 border-gray-400 hover:bg-gray-100"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AllJobPosts;
