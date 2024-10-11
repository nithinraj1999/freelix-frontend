// import React, { useState } from "react";
// import ProfileModal from "./ProfileModal"; // Adjust the import path as necessary

// const ProfileHeader: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentField, setCurrentField] = useState<keyof typeof currentData | null>(null);
//   const [currentData, setCurrentData] = useState({
//     name: "Emma Smith",
//     rating: "☆☆☆☆☆ 5.0",
//     title: "I Am A Graphic Designer",
//     hourlyRate: "$30 USD/hour",
//   });

//   const handleEdit = (field: keyof typeof currentData) => {
//     setCurrentField(field);
//     setIsModalOpen(true);
//   };

//   const handleSave = (newValue: string) => {
//     if (currentField) {
//       setCurrentData((prev) => ({ ...prev, [currentField]: newValue }));
//       setIsModalOpen(false); // Close the modal after saving
//     }
//   };

//   return (
//     <div className="relative">
//       {/* Cover Picture */}
//       <div className="h-60 bg-cover bg-indigo-200 w-full"></div>
//       <div>
//         <img
//           src="https://res.cloudinary.com/dhir9n7dj/image/upload/v1720798873/cld-sample.jpg"
//           alt="Profile"
//           className="absolute top-[155px] left-32 transform -translate-x-1/2 border-4 border-white rounded-full w-40 h-40 object-cover"
//         />
//       </div>
//       {/* Body Section */}
//       <div className="pl-14">
//         {/* Name with Pencil Icon */}
//         <div className="flex items-center pt-24">
//           <p className="text-4xl tracking-tight font-bold">{currentData.name}</p>
//           <span
//             onClick={() => handleEdit('name')}
//             className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
//           >
//             <span className="rotate-90">✎</span>
//           </span>
//         </div>

//         {/* Rating */}
//         <div className="text-pink-600 font-semibold text-3xl mr-2">
//           {currentData.rating}
//         </div>

//         {/* Title with Pencil Icon */}
//         <div className="flex items-center">
//           <p className="text-3xl">{currentData.title}</p>
//           <span
//             onClick={() => handleEdit('title')}
//             className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
//           >
//             <span className="rotate-90">✎</span>
//           </span>
//         </div>

//         {/* Hourly Rate with Pencil Icon */}
//         <div className="flex items-center">
//           <p>{currentData.hourlyRate}</p>
//           <span
//             onClick={() => handleEdit('hourlyRate')}
//             className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
//           >
//             <span className="rotate-90">✎</span>
//           </span>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {isModalOpen && (
//         <ProfileModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           title={`Edit ${currentField}`}
//           currentValue={currentField ? currentData[currentField] : ""}
//           onSave={handleSave}
//         />
//       )}
//     </div>
//   );
// };

// export default ProfileHeader;
import React, { useState } from "react";
import ProfileModal from "./ProfileModal"; // Adjust the import path as necessary

const ProfileHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState<keyof typeof currentData | null>(null);

  const [currentData, setCurrentData] = useState({
    name: "Emma Smith",
    rating: "☆☆☆☆☆ 5.0",
    title: "I Am A Graphic Designer",
    hourlyRate: "$30 USD/hour",
  });

  const handleEdit = (field: keyof typeof currentData) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const handleSave = (newValue: string | File | string[]) => {
    if (currentField) {
      if (typeof newValue === 'string') {
        setCurrentData((prev) => ({ ...prev, [currentField]: newValue }));
      }
      setIsModalOpen(false); // Close the modal after saving
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
    <div className="relative">
      {/* Cover Picture */}
      <div className="h-60 bg-cover bg-indigo-200 w-full"></div>
      <div>
        <img
          src="https://res.cloudinary.com/dhir9n7dj/image/upload/v1720798873/cld-sample.jpg"
          alt="Profile"
          className="absolute top-[155px] left-32 transform -translate-x-1/2 border-4 border-white rounded-full w-40 h-40 object-cover"
        />
      </div>
      {/* Body Section */}
      <div className="pl-14">
        {/* Name with Pencil Icon */}
        <div className="flex items-center pt-24">
          <p className="text-4xl tracking-tight font-bold">{currentData.name}</p>
          <span
            onClick={() => handleEdit('name')}
            className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
          >
            <span className="rotate-90">✎</span>
          </span>
        </div>

        {/* Rating */}
        <div className="text-pink-600 font-semibold text-3xl mr-2">
          {currentData.rating}
        </div>

        {/* Title with Pencil Icon */}
        <div className="flex items-center">
          <p className="text-3xl">{currentData.title}</p>
          <span
            onClick={() => handleEdit('title')}
            className="cursor-pointer ml-2 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
          >
            <span className="rotate-90">✎</span>
          </span>
        </div>

        {/* Hourly Rate with Pencil Icon */}
        <div className="flex items-center">
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
