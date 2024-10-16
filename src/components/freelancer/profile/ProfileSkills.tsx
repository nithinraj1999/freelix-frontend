import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import ProfileModal from './ProfileModal'; // Make sure the import path is correct

const ProfileSkills: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle modal opening
  const handleEditSkills = () => {
    setIsModalOpen(true);
  };

  // Save new skills from the modal
  const handleSaveSkills = (newSkills: string | File | string[]) => {
    if (Array.isArray(newSkills)) {
      setSkills(newSkills); // Only update if the new value is an array of skills
    }
    setIsModalOpen(false);
  };

  return (
    <div className="px-14">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <span
          onClick={handleEditSkills}
          className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
        >
          <span className="rotate-90">✎</span>
        </span>
      </div>
      
      <div className="flex flex-wrap">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-slate-100 rounded-full px-4 py-2 mr-2 mb-2"
          >
            {skill}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Skills"
          currentValue={skills}
          onSave={handleSaveSkills}
          inputType="skills"
          availableSkills={['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'TypeScript']} // Example skills
        />
      )}
    </div>
  );
};

export default ProfileSkills;
