import React, { useEffect, useState } from "react";
import JobList from "../../components/freelancer/jobList/JobList";
import JobFilter from "../../components/freelancer/jobList/JobFilter";
import FreelancerNavbar from "../../components/freelancer/FreelancerNavbar";
import { getJobList } from "../../api/freelancer/freelancerServices";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
const JobListPage: React.FC = () => {
  const [jobList, setJobList] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1); // Track current page
  const [totalPages, setTotalPages] = useState<number>(1); // Track total pages
  const [jobCount, setJobCount] = useState<number>(0); 
  const { user } = useSelector((state: RootState) => state.user);


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

  const initializeQuery = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      projectType: params.get('projectType') || 'any',
      minPrice: Number(params.get('minPrice')) || 0,
      maxPrice: Number(params.get('maxPrice')) || 10000,
      skills: params.get('skills') ? params.get('skills')!.split(',') : [],
      language: params.get('language') || 'any',
      search: params.get('search') || '',
      sort: params.get('sort') || '',
      page: Number(params.get('page')) || 1, 
      experience: params.get('experience') || 'any',
    };
  };

  const [query, setQuery] = useState(initializeQuery);

  // Build query string for API request and URL update
  const buildQueryString = () => {
    const queryParams = new URLSearchParams();
    if (query.projectType !== 'any') queryParams.set('projectType', query.projectType);
    if (query.minPrice > 0) queryParams.set('minPrice', query.minPrice.toString());
    if (query.maxPrice < 10000) queryParams.set('maxPrice', query.maxPrice.toString());
    if (query.skills.length > 0) queryParams.set('skills', query.skills.join(','));
    if (query.language !== 'any') queryParams.set('language', query.language);
    if (query.search) queryParams.set('search', query.search);
    if (query.sort) queryParams.set('sort', query.sort);
    if(query.experience)queryParams.set('experience', query.experience);
    queryParams.set('page', query.page.toString()); // Add page parameter
    return queryParams.toString();
  };

  const updateQueryParams = () => {
    const queryString = buildQueryString();
    window.history.replaceState(null, '', '?' + queryString);
  };

  useEffect(() => {
    const fetchJobList = async () => {
      const queryString = buildQueryString();
      const data = {
        freelancerSkills:user?.skills
      }
      const response = await getJobList(queryString,data); 
      console.log(response);
      setJobCount(response.jobListCount)
      setJobList(response.jobList);
      setTotalPages(response.totalPages); // Assuming the response includes totalPages
    };

    fetchJobList();
    updateQueryParams();
  }, [query]);

  const handleFilterChange = (newFilters: any) => {    
    setQuery((prevState) => ({
      ...prevState,
      ...newFilters,
      page: 1, // Reset page to 1 when filters change
    }));
  };
  

  

  const handleSearch =(query:string)=>{
    setSearchQuery(query); 
  }

  const handleSearchQueryChange = (query: string) => {
    
    setQuery((prevState) => ({ ...prevState, search: query }));
  };
  const handleSortChange = (sort: string) => {
    setQuery((prevState) => ({ ...prevState, sort }));
  };

  const handlePageChange = (page: number) => {
    setQuery((prevState) => ({ ...prevState, page })); // Update the page in the query
  };

  return (
    <>
      <FreelancerNavbar />
      <div className="flex px-16 justify-between h-screen">
        <div className="sticky top-16 h-[600px] mt-32">
          <JobFilter onFilterChange={handleFilterChange} initialFilters={query} />
        </div>
        <div className="w-full mx-8 h-full scrollbar-hide">
          <JobList 
            jobList={jobList} 
            onSearchQueryChange={handleSearchQueryChange} 
            onSortChange={handleSortChange}
            searchQuery={searchQuery}
            sortOption={sortOption}
            currentPage={query.page}
            totalPages={totalPages}
            pagination={handlePageChange}
            jobCount={jobCount}
            handleSearch={handleSearch}
          />
        </div>
      </div>
    </>
  );
};

export default JobListPage;
