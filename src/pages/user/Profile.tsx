import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { RootState } from "../../state/store";
import { useSelector } from "react-redux";
import { fetchUserData } from "../../api/client/clientServices";
import { editprofile } from "../../api/client/clientServices";
import { z } from "zod";
import MyHiring from "../../components/client/hirings/MyHiring";
import AllJobPosts from "../../components/client/JobPost/AllJobPosts";
import { useDispatch } from "react-redux";
import { userLogin } from "../../state/slices/userSlice";
const Profile = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [userData, setUserData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>({
    userId: "",
    profilePicture: "",
    name: "",
    email: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const dispatch = useDispatch()
  const profileSchema = z.object({
    name: z
      .string()
      .min(1, "Name cannot be empty") 
      .trim()
      .refine((value) => value.length > 0, {
        message: "Name cannot be only spaces",
      }),

    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email cannot be empty")
      .trim()
      .refine((value) => value.length > 0, {
        message: "Email cannot be only spaces",
      }),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
        setEditData((prev: any) => ({
          ...prev,
          profilePicture: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    async function fetchUserDetails(userId: string) {
      const data = { userId };
      const response = await fetchUserData(data);
      setUserData(response.userDetails);
    }
    if (user?._id) {
      fetchUserDetails(user._id);
    }
  }, [user]);

  const handleEditProfile = () => {
    setEditData({
      userId: user?._id,
      profilePicture: userData.profilePicture,
      name: userData.name,
      email: userData.email,
    });
    setPreviewImage(userData.profilePicture || null);
    setIsModalOpen(true);
  };

  const handleSaveChanges = async () => {
    const result = profileSchema.safeParse(editData);
    console.log(editData);

    if (!result.success) {
      const validationErrors = result.error.formErrors.fieldErrors;
      setErrors({
        name: validationErrors.name?.[0] || "",
        email: validationErrors.email?.[0] || "",
      });
      return;
    }

    const response = await editprofile(editData);
    if (response.success) {
      setUserData((prev: any) => ({
        ...prev,
        name: editData.name,
        email: editData.email,
        profilePicture: previewImage || prev.profilePicture,
      }));
      dispatch(userLogin(response.data))
    }

    setIsModalOpen(false);
    
  };

  return (
    <>
      <Navbar />
      <div className="w-full p-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src={userData.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full mr-6 object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
          <button
            onClick={handleEditProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">
                Profile Picture
              </label>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-4 w-32 h-32 rounded-full object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}{" "}
              {/* Error message */}
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}{" "}
              {/* Error message */}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <MyHiring />
      <AllJobPosts />
    </>
  );
};

export default Profile;
