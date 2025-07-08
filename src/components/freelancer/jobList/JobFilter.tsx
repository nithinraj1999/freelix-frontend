import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface JobFilterProps {
  onFilterChange: (filters: any) => void;
  initialFilters: {
    projectType: string;
    minPrice: number;
    maxPrice: number;
    skills: string[];
    language: string;
    experience:string;
  };
}

const JobFilter: React.FC<JobFilterProps> = ({
  onFilterChange,
  initialFilters,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const navigate = useNavigate();

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters,filters]);

  const handleFilterChange = (field: string, value: any) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const defaultFilters = {
    projectType: 'any',
    minPrice: 0,
    maxPrice: 10000,
    skills: [],
    language: 'any',
    search: '',
    deliveryDays: 0,
    sort: '',
    page: 1,
    experience: 'any',
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
    onFilterChange(defaultFilters); 
    navigate("/freelancer/job-list"); 
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md w-full">
      <h2 className="text-xl font-semibold mb-4">Filter Jobs</h2>

      {/* Project Type Filter */}
      {/* <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Project Type
        </label>
        <select
          value={filters.projectType}
          onChange={(e) => handleFilterChange("projectType", e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="any">Any</option>
          <option value="hourly">Hourly</option>
          <option value="fixed">Fixed Rate</option>
        </select>
      </div>
 */}
      {/* Price Range Filter - Min and Max Price in the same section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Price Range
        </label>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-xs font-medium text-gray-700">
              Min Price
            </label>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", +e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-xs font-medium text-gray-700">
              Max Price
            </label>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", +e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Skills Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Experience
        </label>
        <select
          value={filters.experience}
          onChange={(e) => handleFilterChange("experience", e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="any">Any</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Experienced">Experienced</option>
        </select>
      </div>

      {/* Delivery Days Filter */}
     

      {/* Reset Button */}
      <button
        type="button"
        onClick={resetFilters}
        className="mt-4 w-full py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default JobFilter;
