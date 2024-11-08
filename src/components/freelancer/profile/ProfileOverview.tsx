// import React, { useState } from "react";
// import ProfileModal from "./ProfileModal"; // Adjust the import path if necessary
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../../state/store";
// import { editFreelancerProfile } from "../../../api/freelancer/freelancerServices";
// import { userLogin } from "../../../state/slices/userSlice";
// import { IProfile } from "../../../pages/freelancer/interfaces/profile";
// import { useEffect } from "react";
// interface ProfileOverviewProps {
//   freelancerData?: IProfile; // Mark as optional
// }
// const ProfileOverview: React.FC<ProfileOverviewProps> = ({
//   freelancerData,
// }) => {
//   // Sample long profile overview text
//   const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
//   const [profileOverview, setProfileOverview] = useState("");

//   useEffect(() => {
//     if (freelancerData) {
//       setProfileOverview(freelancerData.description);
//     }
//   }, [freelancerData]);

//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const dispatch = useDispatch();
//   // Toggle function to show/hide the full overview
//   const toggleOverview = () => {
//     setIsExpanded(!isExpanded);
//   };

//   // Toggle modal for editing overview
//   const handleEditOverview = () => {
//     setIsModalOpen(true);
//   };

//   const handleSaveOverview = async (newOverview: string | File | string[]) => {
//     if (typeof newOverview === "string") {
//       setProfileOverview(newOverview);
//       try {
//         const updatedData = { description: newOverview, userID: user?._id };

//         const response = await editFreelancerProfile(updatedData);
//         if (response.success) {
//           dispatch(userLogin(response.data));
//           console.log("res...", response);
//           setIsModalOpen(false); // Close the modal after saving
//         }
//       } catch (error) {
//         console.error("Failed to update profile overview:", error);
//       }
//     }
//     // Close the modal after saving
//     setIsModalOpen(false);
//   };

//   // Display only the first part of the overview if not expanded
//   const displayedOverview = isExpanded
//     ? profileOverview
//     : `${profileOverview.substring(0, 150)}...`;

//   return (
//     <div className="pt-8 pl-14 pr-14 ">
//       <div className="flex items-center">
//         <h2 className="text-2xl font-bold text-slate-700">Profile Overview</h2>
//         {user?.role === "freelancer" && (
//           <span
//             onClick={handleEditOverview}
//             className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
//           >
//             <span className="rotate-90">✎</span>
//           </span>
//         )}
//       </div>
//       <p className="mt-4 text-slate-500">{displayedOverview}</p>
//       <button
//         onClick={toggleOverview}
//         className="mt-4 text-blue-500 hover:underline"
//       >
//         {isExpanded ? "Show Less" : "Show More"}
//       </button>

//       {/* Edit Modal */}
//       {isModalOpen && (
//         <ProfileModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           title="Edit Profile Overview"
//           currentValue={profileOverview}
//           onSave={handleSaveOverview}
//           inputType="textarea" // Specifies that this modal is for editing long text
//         />
//       )}
//     </div>
//   );
// };

// export default ProfileOverview;



import React, { useState, useEffect } from "react";
import ProfileModal from "./ProfileModal"; // Adjust the import path if necessary
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../state/store";
import { editFreelancerProfile } from "../../../api/freelancer/freelancerServices";
import { userLogin } from "../../../state/slices/userSlice";
import { IProfile } from "../../../pages/freelancer/interfaces/profile";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast

interface ProfileOverviewProps {
  freelancerData?: IProfile; // Mark as optional
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  freelancerData,
}) => {
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  const [profileOverview, setProfileOverview] = useState("");

  useEffect(() => {
    if (freelancerData) {
      setProfileOverview(freelancerData.description);
    }
  }, [freelancerData]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Validation schema for the profile overview
  const overviewSchema = z
    .string()
    .min(1, "Overview cannot be empty")
    .refine((value) => value.trim().length > 0, { message: "Overview cannot contain only whitespace" });

  // Toggle function to show/hide the full overview
  const toggleOverview = () => {
    setIsExpanded(!isExpanded);
  };

  // Toggle modal for editing overview
  const handleEditOverview = () => {
    setIsModalOpen(true);
  };

  const handleSaveOverview = async (newOverview: string | File | string[]) => {
    if (typeof newOverview === "string") {
      const validationResult = overviewSchema.safeParse(newOverview);

      if (!validationResult.success) {
        // Display the error message as toast
        toast.error(validationResult.error.format()._errors[0]);
        return; // Stop execution if validation fails
      }

      setProfileOverview(newOverview);
      try {
        const updatedData = { description: newOverview, userID: user?._id };

        const response = await editFreelancerProfile(updatedData);
        if (response.success) {
          dispatch(userLogin(response.data));
          console.log("res...", response);
          setIsModalOpen(false); // Close the modal after saving
        } else {
          // Optionally handle server response errors
          toast.error("Failed to update profile overview. Please try again.");
        }
      } catch (error) {
        console.error("Failed to update profile overview:", error);
        toast.error("An error occurred while updating your overview."); // Show a toast for general errors
      }
    }

    // Close the modal after saving
    setIsModalOpen(false);
  };

  // Display only the first part of the overview if not expanded
  const displayedOverview = isExpanded
    ? profileOverview
    : `${profileOverview.substring(0, 150)}...`;

  return (
    <div className="pt-8 pl-14 pr-14 ">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-slate-700">Profile Overview</h2>
        {user?.role === "freelancer" && (
          <span
            onClick={handleEditOverview}
            className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
          >
            <span className="rotate-90">✎</span>
          </span>
        )}
      </div>
      <p className="mt-4 text-slate-500">{displayedOverview}</p>
      <button
        onClick={toggleOverview}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isExpanded ? "Show Less" : "Show More"}
      </button>

      {/* Edit Modal */}
      {isModalOpen && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Profile Overview"
          currentValue={profileOverview}
          onSave={handleSaveOverview}
          inputType="textarea" // Specifies that this modal is for editing long text
        />
      )}

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProfileOverview;
