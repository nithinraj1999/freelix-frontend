// import React, { useState } from 'react';
// import { RootState } from "../../../state/store";
// import { useSelector, useDispatch } from "react-redux";
// import { useEffect } from 'react';
// import ProfileModal from './ProfileModal'; // Make sure the import path is correct
// import { editFreelancerProfile } from "../../../api/freelancer/freelancerServices";
// import { userLogin } from "../../../state/slices/userSlice";
// import { IProfile } from '../../../pages/freelancer/interfaces/profile';
// interface ProfileSkillProps {
//   freelancerData?: IProfile; // Mark as optional
// }
// const ProfileSkills:React.FC<ProfileSkillProps> = ({ freelancerData }) => {
//   const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
//   const [skills, setSkills] = useState<string[]>( []);
//   const [isModalOpen, setIsModalOpen] = useState(false);
// console.log("freelancer skill",freelancerData);

//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (freelancerData) {
//       setSkills(freelancerData.skills);
//     }
//   }, [freelancerData]);
//   const handleEditSkills = () => {
//     setIsModalOpen(true);
//   };

//   // Save new skills from the modal
//   const handleSaveSkills = async (newSkills: string | File | string[]) => {
//     if (Array.isArray(newSkills)) {
//       setSkills(newSkills); // Only update if the new value is an array of skills
//       const updatedData = { skills: newSkills,userID:user?._id };

//       const response = await editFreelancerProfile(updatedData);
//       if (response.success) {
//         dispatch(userLogin(response.data));
//         console.log("res...", response);
//         setIsModalOpen(false); // Close the modal after saving
//       }
//     }
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="px-14 ">
//       <div className="flex items-center">
//         <h2 className="text-2xl font-semibold mb-4">Skills</h2>
//         {user?.role==="freelancer" && (
//           <span
//           onClick={handleEditSkills}
//           className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
//         >
//           <span className="rotate-90">✎</span>
//         </span>
// )}
        
//       </div>
      
//       <div className="flex flex-wrap">
//         {skills.map((skill, index) => (
//           <div
//             key={index}
//             className="bg-slate-100 rounded-full px-4 py-2 mr-2 mb-2"
//           >
//             {skill}
//           </div>
//         ))}
//       </div>

//       {/* Edit Modal */}
//       {isModalOpen && (
//         <ProfileModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           title="Edit Skills"
//           currentValue={skills}
//           onSave={handleSaveSkills}
//           inputType="skills"
//           availableSkills={['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'TypeScript']} // Example skills
//         />
//       )}
//     </div>
//   );
// };

// export default ProfileSkills;



import React, { useState, useEffect } from 'react';
import { RootState } from "../../../state/store";
import { useSelector, useDispatch } from "react-redux";
import ProfileModal from './ProfileModal'; // Make sure the import path is correct
import { editFreelancerProfile } from "../../../api/freelancer/freelancerServices";
import { userLogin } from "../../../state/slices/userSlice";
import { IProfile } from '../../../pages/freelancer/interfaces/profile';
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast

interface ProfileSkillProps {
  freelancerData?: IProfile; // Mark as optional
}

const ProfileSkills: React.FC<ProfileSkillProps> = ({ freelancerData }) => {
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  const [skills, setSkills] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (freelancerData) {
      setSkills(freelancerData.skills);
    }
  }, [freelancerData]);

  const handleEditSkills = () => {
    setIsModalOpen(true);
  };

  // Save new skills from the modal
  const handleSaveSkills = async (newSkills: string | File | string[]) => {
    if (Array.isArray(newSkills)) {
      if (newSkills.length === 0) {
        // Display an error message as toast
        toast.error("Skills cannot be empty. Please add at least one skill.");
        return; // Stop execution if skills array is empty
      }

      setSkills(newSkills); // Only update if the new value is an array of skills
      const updatedData = { skills: newSkills, userID: user?._id };

      try {
        const response = await editFreelancerProfile(updatedData);
        if (response.success) {
          dispatch(userLogin(response.data));
          console.log("res...", response);
          setIsModalOpen(false); // Close the modal after saving
        } else {
          // Optionally handle server response errors
          toast.error("Failed to update skills. Please try again.");
        }
      } catch (error) {
        console.error("Failed to update skills:", error);
        toast.error("An error occurred while updating your skills."); // Show a toast for general errors
      }
    }
    // Close the modal if it's not an array
    setIsModalOpen(false);
  };

  return (
    <div className="px-14 ">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        {user?.role === "freelancer" && (
          <span
            onClick={handleEditSkills}
            className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
          >
            <span className="rotate-90">✎</span>
          </span>
        )}
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

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProfileSkills;
