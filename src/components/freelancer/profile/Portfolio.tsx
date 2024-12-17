import React, { useState, useEffect } from "react";
import ProfileModal from "./ProfileModal"; // Adjust the import path as necessary
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../state/store";
import { editFreelancerProfile } from "../../../api/freelancer/freelancerServices";
import { userLogin } from "../../../state/slices/userSlice";
import { IProfile } from '../../../pages/freelancer/interfaces/profile';
import { IPortfolioItem } from "./interface/interface";

interface PortfolioItem {
     _id?:string,
    image: string;
    title: string;
    description: string;
}

interface ProfilePortfolioProps {
    freelancerData?: IProfile; // Mark as optional
}

const Portfolio: React.FC<ProfilePortfolioProps> = ({ freelancerData }) => {
    const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
    const [portfolioItems, setPortfolioItems] = useState<IPortfolioItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newPortfolio, setNewPortfolio] = useState<string | File | string[]>(); 
    const dispatch = useDispatch();

    useEffect(() => {
        if (freelancerData?.portfolio) {
            setPortfolioItems(freelancerData.portfolio.map(item => ({
                _id:item._id,
                image: item.image,
                title: item.title,
                description: item.description,
            })));
        }
    }, [freelancerData]);
    

const handleAddImage = async (newValue: any) => {
    
  const formData = new FormData();
      formData.append("userID", user?._id || "");
      formData.append("portfolio", newValue);
    
      try {
          const response = await editFreelancerProfile(formData);
          if (response.success) {
            setPortfolioItems(prevItems => [...prevItems, newValue]);
              dispatch(userLogin(response.data));
              setIsModalOpen(false); 
          }
      } catch (error) {
          console.error("Error updating profile:", error);
      }
  
};
 
  

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-700 pl-14 pr-14 pb-8 bg-white">Portfolio</h2>
            <div className="flex flex-wrap justify-start pl-14 pr-14">
                {portfolioItems.length > 0 ? (
                    portfolioItems.map((item, index) => (
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
                    <div>
                        <p className="text-gray-500 pl-14 pr-14">No Portfolio Images Available</p>
                    </div>
                )}
            </div>
            {user?.role==="freelancer" && (
                <div className="pl-14 pr-14 mt-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add or delete Image
                </button>
            </div>
)}
            
            {/* Modal for adding new images */}
            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Portfolio Image"
                currentValue={""}
                onSave={handleAddImage} 
                inputType="file"
                portfolioImages={portfolioItems}
                setPortfolioImages={setPortfolioItems}
            />
        </div>
    );
};

export default Portfolio;
