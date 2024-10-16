import React, { useState } from 'react';

const JobFilter: React.FC = () => {
  const [projectType, setProjectType] = useState<'fixed' | 'hourly' | ''>('');
  const [fixedMinPrice, setFixedMinPrice] = useState('');
  const [fixedMaxPrice, setFixedMaxPrice] = useState('');
  const [hourlyMinPrice, setHourlyMinPrice] = useState('');
  const [hourlyMaxPrice, setHourlyMaxPrice] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const skills = ['React', 'Node.js', 'Python', 'UI/UX']; // Example skills
  const languages = ['English', 'Spanish', 'French']; // Example languages

  const handleSkillChange = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleFilterSubmit = () => {
    const filters = {
      projectType,
      fixedPriceRange: { min: fixedMinPrice, max: fixedMaxPrice },
      hourlyPriceRange: { min: hourlyMinPrice, max: hourlyMaxPrice },
      selectedSkills,
      selectedLanguage,
    };
    console.log(filters);
    // Call filter logic here (e.g., API call with these filters)
  };

  return (
    <div className="h-[600px] w-[250px] bg-white rounded p-4">
      <h3 className="text-lg font-semibold mb-4">Filter Jobs</h3>

      {/* Project Type Filter */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Project Type</label>
        <div>
          <label>
            <input
              type="radio"
              name="projectType"
              value="fixed"
              checked={projectType === 'fixed'}
              onChange={() => setProjectType('fixed')}
            />
            Fixed Rate
          </label>
          <label className="ml-4">
            <input
              type="radio"
              name="projectType"
              value="hourly"
              checked={projectType === 'hourly'}
              onChange={() => setProjectType('hourly')}
            />
            Hourly Rate
          </label>
        </div>
      </div>

      {/* Fixed Price Filter */}
      {projectType === 'fixed' && (
        <div className="mb-4">
          <label className="block font-medium mb-2">Fixed Price Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="border p-2 rounded w-full"
              value={fixedMinPrice}
              onChange={(e) => setFixedMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="border p-2 rounded w-full"
              value={fixedMaxPrice}
              onChange={(e) => setFixedMaxPrice(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Hourly Price Filter */}
      {projectType === 'hourly' && (
        <div className="mb-4">
          <label className="block font-medium mb-2">Hourly Rate Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="border p-2 rounded w-full"
              value={hourlyMinPrice}
              onChange={(e) => setHourlyMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="border p-2 rounded w-full"
              value={hourlyMaxPrice}
              onChange={(e) => setHourlyMaxPrice(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Skills Filter */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Skills</label>
        <div className="flex flex-wrap">
          {skills.map((skill) => (
            <label key={skill} className="mr-4 mb-2">
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
              />
              {skill}
            </label>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Language</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">Select Language</option>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
      <button
        className="bg-blue-500 text-white p-2 rounded w-full"
        onClick={handleFilterSubmit}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default JobFilter;
