
import React, { useState } from 'react';
import ProfileModal from './ProfileModal'; // Adjust the import path if necessary

const ProfileOverview: React.FC = () => {
  // Sample long profile overview text
  const [profileOverview, setProfileOverview] = useState(`Emma Smith is a talented graphic designer with over 5 years of experience in creating stunning visuals for various clients. 
  She has a passion for design and a keen eye for detail. Emma has worked on a variety of projects, from branding and logo design to web and mobile app design. 
  Her expertise includes Adobe Creative Suite, Sketch, and Figma. She loves collaborating with clients to understand their needs and translate their ideas into visually appealing designs. 
  Emma is always looking to expand her skill set and stay updated with the latest design trends. 
  In her free time, she enjoys exploring new design techniques and contributing to design communities.`);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle function to show/hide the full overview
  const toggleOverview = () => {
    setIsExpanded(!isExpanded);
  };

  // Toggle modal for editing overview
  const handleEditOverview = () => {
    setIsModalOpen(true);
  };

  // Save the edited overview (from the modal's textarea input)
  const handleSaveOverview = (newOverview: string | File | string[]) => {
    if (typeof newOverview === 'string') {
      setProfileOverview(newOverview);
    }
    setIsModalOpen(false);
  };

  // Display only the first part of the overview if not expanded
  const displayedOverview = isExpanded ? profileOverview : `${profileOverview.substring(0, 150)}...`;

  return (
    <div className="pt-8 pl-14 pr-14">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-slate-700">Profile Overview</h2>
        <span
          onClick={handleEditOverview}
          className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
        >
          <span className="rotate-90">✎</span>
        </span>
      </div>
      <p className="mt-4 text-slate-500">{displayedOverview}</p>
      <button
        onClick={toggleOverview}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>

      {/* Edit Modal */}
      {isModalOpen && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Profile Overview"
          currentValue={profileOverview}
          onSave={handleSaveOverview}
          inputType="textarea"  // Specifies that this modal is for editing long text
        />
      )}
    </div>
  );
};

export default ProfileOverview;
