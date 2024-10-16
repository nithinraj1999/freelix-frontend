import React, { useState } from "react";
import ProfileModal from "./ProfileModal"; // Assuming the reusable modal is in the same folder

const Portfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState([
    { id: 1, image: "https://res.cloudinary.com/dhir9n7dj/image/upload/v1720798873/cld-sample.jpg", title: "Project 1" },
    { id: 2, image: "https://via.placeholder.com/300", title: "Project 2" },
    { id: 3, image: "https://via.placeholder.com/300", title: "Project 3" },
    { id: 4, image: "https://via.placeholder.com/300", title: "Project 4" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string[]>(portfolioItems.map(item => item.image));

  const handleAddImage = (newImage: string | File) => {
    if (typeof newImage === "string") {
      setPortfolioItems((prevItems) => [
        ...prevItems,
        { id: prevItems.length + 1, image: newImage, title: `Project ${prevItems.length + 1}` },
      ]);
    } else if (newImage instanceof File) {
      const newImageUrl = URL.createObjectURL(newImage);
      setPortfolioItems((prevItems) => [
        ...prevItems,
        { id: prevItems.length + 1, image: newImageUrl, title: `Project ${prevItems.length + 1}` },
      ]);
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setPortfolioItems((prevItems) =>
      prevItems.filter((item) => item.image !== imageToRemove)
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-700 pl-14 pr-14 pb-8 bg-white">Portfolio</h2>
      <div className="flex flex-wrap justify-start pl-14 pr-14">
        {portfolioItems.map((item) => (
          <div key={item.id} className="w-full sm:w-1/2 md:w-1/3 p-2">
            <div className="bg-white rounded shadow-md overflow-hidden relative group">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-cover transition-transform duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                <button
                  onClick={() => handleRemoveImage(item.image)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  &times; {/* Remove image button */}
                </button>
              </div>
            </div>
          </div>
        ))}
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
        portfolioImages={currentImage}
      />
    </div>
  );
};

export default Portfolio;
