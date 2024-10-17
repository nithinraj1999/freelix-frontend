import React, { useState,useEffect } from "react";
import ProfileModal from "./ProfileModal"; // Assuming the reusable modal is in the same folder
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../state/store";
import { editFreelancerProfile } from "../../../api/freelancer/freelancerServices";
import { userLogin } from "../../../state/slices/userSlice";

interface PortfolioItems {
  image: string;
  title: string;
  description:string;
}

const Portfolio: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store

  const [portfolioItems, setPortfolioItems] =useState<Array<{ image: string; title: string; description: string }>>([]);

  console.log("portfoliooo",portfolioItems);

  useEffect(()=>{
    setPortfolioItems(user?.portfolio || [])
  },[])
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleAddImage = async (newImage: string | File | string[]) => {
    if (typeof newImage === "string") {
      setPortfolioItems((prevItems) => [
        ...prevItems,
        { image: newImage, title: `Project ${prevItems?.length + 1}`,description:"sample desription" },
      ]);
    } else if (newImage instanceof File) {
      const newImageUrl = URL.createObjectURL(newImage);
      setPortfolioItems((prevItems) => [
        ...prevItems,
        { image: newImageUrl, title: `Project ${prevItems.length + 1}`,description:"sample desription" },
      ]);
    }
    const updatedData = { portfolio: newImage,userID:user?._id };

      const response = await editFreelancerProfile(updatedData);
      if (response.success) {
        dispatch(userLogin(response.data));
        console.log("res...", response.data);
        setIsModalOpen(false); // Close the modal after saving
      }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-700 pl-14 pr-14 pb-8 bg-white">Portfolio</h2>
      <div className="flex flex-wrap justify-start pl-14 pr-14">
        {portfolioItems.length > 0 ? (
          portfolioItems.map((item,index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 p-2">
              <div className="bg-white rounded shadow-md overflow-hidden relative group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-cover transition-transform duration-300 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="">
          <p className="text-gray-500 pl-14 pr-14">No Portfolio Images Available</p>

          </div>
        )}
      </div>

      <div className="pl-14 pr-14 mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Image
        </button>
      </div>

      {/* Modal for adding new images */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Portfolio Image"
        currentValue={""}
        onSave={handleAddImage}
        inputType="file"
        portfolioImages={portfolioItems} // Pass portfolio items correctly
        setPortfolioImages={setPortfolioItems} // Pass the updater function
      />
    </div>
  );
};

export default Portfolio;
