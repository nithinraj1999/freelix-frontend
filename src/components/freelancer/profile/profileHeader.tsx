import React, { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../state/store";
import { editFreelancerProfile } from "../../../api/freelancer/freelancerServices";
import { userLogin } from "../../../state/slices/userSlice";
import { IProfile } from "../../../pages/freelancer/interfaces/profile";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast

interface ProfileHeaderProps {
  freelancerData?: IProfile; // Mark as optional
}

// Define Zod schemas for individual fields
const nameSchema = z
  .string()
  .min(1, "Name cannot be empty")
  .refine((value) => value.trim().length > 0, { message: "Name cannot contain only whitespace" })
  .refine((value) => /^[A-Za-z\s]+$/.test(value), { message: "Name should only contain alphabets and spaces" });

const titleSchema = z
  .string()
  .min(1, "Title cannot be empty")
  .refine((value) => value.trim().length > 0, { message: "Title cannot contain only whitespace" });

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ freelancerData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState<keyof typeof currentData | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [currentData, setCurrentData] = useState({
    profilePicture:"",
    name: "",
    rating: "☆☆☆☆☆",
    title: "",
  });

  useEffect(() => {
    if (freelancerData) {
      setCurrentData({
        profilePicture:freelancerData.profilePicture,
        name: freelancerData.name || "",
        rating: "☆☆☆☆☆",
        title: freelancerData.title || "",
      });
    }
  }, [freelancerData]);

  const handleEdit = (field: keyof typeof currentData) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handleSave = async (newValue: string | File | string[]) => {
    if (currentField) {
      if (typeof newValue === "string") {
        const schema = currentField === "name" ? nameSchema : titleSchema;
        const result = schema.safeParse(newValue);

        if (!result.success) {
          // Display the error message as toast
          toast.error(result.error.format()._errors[0]);
          return;
        }

        setCurrentData((prev) => ({ ...prev, [currentField]: newValue }));
      }

      const formData = new FormData();
      if (typeof newValue === "string") {
        formData.append(currentField, newValue);
      }
      if (user?._id) {
        formData.append("userID", user._id);
      }

      const response = await editFreelancerProfile(formData);

      if (response.success) {
        dispatch(userLogin(response.data));
        setIsModalOpen(false);
      } else {
        // Optionally handle other errors here
        toast.error("Failed to update profile. Please try again."); // Add a toast for general errors
      }
    }
  };

  const getInputType = (field: keyof typeof currentData): "text" | "textarea" | "file" | "skills" => {
    switch (field) {
      case "name":
      case "title":
        return "text";
      default:
        return "text";
    }
  };

  return (
    <div className="relative bg-white">
      {/* Cover Picture */}
      <div className="h-60 bg-cover bg-black -600 w-full"></div>
      <div>
        <img
          src={currentData?.profilePicture}
          alt="Profile"
          className="absolute top-[155px] left-32 transform -translate-x-1/2 border-4 border-white rounded-full w-40 h-40 object-cover"
        />
      </div>
      {/* Body Section */}
      <div>
        <div className="flex items-center pt-24 pl-14">
          <p className="text-4xl tracking-tight font-bold">{currentData.name}</p>
          {user?.role === "freelancer" && (
            <span
              onClick={() => handleEdit("name")}
              className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
            >
              <span className="rotate-90">✎</span>
            </span>
          )}
        </div>
        <div className="text-slate-500 font-semibold text-3xl mr-2 pl-14">
          {currentData.rating}
        </div>
        <div className="flex items-center">
          <p className="text-3xl pl-14">{currentData.title}</p>
          {user?.role === "freelancer" && (
            <span
              onClick={() => handleEdit("title")}
              className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
            >
              <span className="rotate-90">✎</span>
            </span>
          )}
        </div>
      </div>

      {isModalOpen && currentField && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Edit ${currentField}`}
          currentValue={currentData[currentField]}
          onSave={handleSave}
          inputType={getInputType(currentField)}
        />
      )}

      {/* Toast Container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default ProfileHeader;
