import React, { useState } from "react";
import ProfileModal from "./ProfileModal"; // Adjust the import path as necessary
import { useSelector,useDispatch } from "react-redux";
import { RootState } from "../../../state/store";
import { editFreelancerProfile } from "../../../api/freelancer/freelancerServices";
import { userLogin } from "../../../state/slices/userSlice";

const ProfileHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState<keyof typeof currentData | null>(null);
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  const [currentData, setCurrentData] = useState({
    name: user?user.name :"",
    rating: "☆☆☆☆☆ ",
    title: user?user.title :"",
    hourlyRate: "$30 USD/hour",
  });

  const dispatch = useDispatch()
  const handleEdit = (field: keyof typeof currentData) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };


  const handleSave = async (newValue: string | File | string[]) => {
    if (currentField) {
      if (typeof newValue === 'string') {
        setCurrentData((prev) => ({ ...prev, [currentField]: newValue }));
      }
      console.log("gvvv",currentField);
      const formData = new FormData();
      if (typeof newValue === 'string') {
        formData.append(currentField, newValue);
      }
      if (user?._id) {
        formData.append("userID", user._id);
      }
      console.log(formData);
      
      const response = await editFreelancerProfile (formData)
    
      
      if(response.success){
        dispatch(userLogin(response.data))
        console.log("res...",response);
        setIsModalOpen(false); // Close the modal after saving

      }
      
    }
  };

  // This function will return the correct input type for each field
  const getInputType = (field: keyof typeof currentData): "text" | "textarea" | "file" | "skills" => {
    switch (field) {
      case "name":
      case "title":
        return "text";
      case "hourlyRate":
        return "text"; // If you want to handle hourlyRate differently, you can adjust this
      default:
        return "text"; // Default case to avoid errors
    }
  };

  return (
    <div className="relative bg-white">
      {/* Cover Picture */}
      <div className="h-60 bg-cover bg-pink-600	 w-full"></div>
      <div>
        <img
          src={user?.profilePicture}
          alt="Profile"
          className="absolute top-[155px] left-32 transform -translate-x-1/2 border-4 border-white rounded-full w-40 h-40 object-cover"
        />
      </div>
      {/* Body Section */}
      <div className="">
        {/* Name with Pencil Icon */}
        <div className="flex items-center  pt-24 pl-14">
          <p className="text-4xl tracking-tight font-bold">{currentData.name}</p>
          <span
            onClick={() => handleEdit('name')}
            className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
          >
            <span className="rotate-90">✎</span>
          </span>
        </div>

        {/* Rating */}
        <div className="text-slate-500	 font-semibold text-3xl mr-2 pl-14">
          {currentData.rating}
        </div>

        {/* Title with Pencil Icon */}
        <div className="flex items-center">
          <p className="text-3xl pl-14">{currentData.title}</p>
          <span
            onClick={() => handleEdit('title')}
            className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
          >
            <span className="rotate-90">✎</span>
          </span>
        </div>

        {/* Hourly Rate with Pencil Icon */}
        <div className="flex items-center pl-14">
          <p>{currentData.hourlyRate}</p>
          <span
            onClick={() => handleEdit('hourlyRate')}
            className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
          >
            <span className="rotate-90">✎</span>
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && currentField && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Edit ${currentField}`}
          currentValue={currentData[currentField]}
          onSave={handleSave} // Now can accept string | File | string[]
          inputType={getInputType(currentField)} // Returns valid input types
        />
      )}
    </div>
  );
};

export default ProfileHeader;
