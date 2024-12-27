import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { getAllJobPosts } from "../../../api/client/clientServices";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 3;
  const [totalpage, setTotalPage] = useState(1);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobList = async () => {
      if (user?._id) {
        const data = { userID: user._id, searchQuery, page: currentPage };
        const response = await getAllJobPosts(data);
        setTotalPage(response.jobPosts.totalDocs);
        setJobList(response.jobPosts.MyPost);
      }
    };
    fetchJobList();
  }, [user, searchQuery, currentPage]);

  const toggleExpand = (id: string) => {
    setIsExpanded(isExpanded === id ? null : id);
  };

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

  const cleanContent = (content: string) => {
    return content.replace(/<p>\s*<\/p>/g, "").replace(/<br\s*\/?>/g, "");
  };

  return (
    <div className="mt-20 w-full px-16">
      <h1>Your Job Posts</h1>

      {/* Search Field */}
      {jobList.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Search by job title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {jobList.length > 0 ? (
        jobList.map((job) => (
          <div
            key={job._id}
            className="w-full mt-4 bg-white rounded px-8 py-8 min-h-[200px] cursor-pointer"
            onClick={() => navigateToDetails(job._id)}
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
              <div
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
              
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button
          className="px-4 py-2 border rounded"
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
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllJobPosts;
