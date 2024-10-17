import React, { useState } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentValue: string | File | string[];
  onSave: (newValue: string | File | string[]) => void;
  inputType: "text" | "textarea" | "file" | "skills";
  portfolioImages?: string[];
  availableSkills?: string[];
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  title,
  currentValue,
  onSave,
  inputType,
  portfolioImages = [],
  availableSkills = [],
}) => {
  const [newValue, setNewValue] = useState<string | File | string[]>(currentValue);
  const [currentPortfolioImages, setCurrentPortfolioImages] = useState<string[]>(portfolioImages);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State for image preview
  const [newSkills, setNewSkills] = useState<string[]>(Array.isArray(currentValue) ? currentValue : []); // Handle skills array
  const [searchQuery, setSearchQuery] = useState(""); // State for search bar

  // Handle input changes based on type
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;

    if (inputType === "file" && target instanceof HTMLInputElement && target.files) {
      const file = target.files[0];
      setNewValue(file); // Accept only one file at a time
      setPreviewImage(URL.createObjectURL(file)); // Generate preview URL for the selected image
    } else if (inputType !== "file") {
      setNewValue(target.value);
    }
  };

  const handleAddSkill = (skill: string) => {
    if (!newSkills.includes(skill)) {
      setNewSkills([...newSkills, skill]);
    }
    setSearchQuery(""); // Clear the search after adding the skill
  };

  const handleRemoveSkill = (skill: string) => {
    setNewSkills(newSkills.filter((s) => s !== skill));
  };

  const handleRemoveImage = (index: number) => {
    setCurrentPortfolioImages(currentPortfolioImages.filter((_, i) => i !== index));
  };

  // Filter available skills based on search query and exclude already selected skills
  const filteredSkills = availableSkills.filter(
    (skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()) && !newSkills.includes(skill)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>

        {/* Render input based on the inputType prop */}
        {inputType === "text" && (
          <input
            type="text"
            value={newValue as string}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 w-full rounded"
          />
        )}

        {inputType === "textarea" && (
          <textarea
            value={newValue as string}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 w-full rounded"
            rows={4}
          />
        )}

        {inputType === "file" && (
          <div>
            {/* Display available portfolio images */}
            <h3 className="text-slate-500 mt-6">Portfolio Images</h3>
            <div className="flex flex-wrap mt-2">
              {currentPortfolioImages.length > 0 ? (
                currentPortfolioImages.map((image, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <img
                      src={image}
                      alt={`Portfolio ${index}`}
                      className="w-20 h-20 mr-2 rounded"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      &times; {/* Remove image */}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No images available</p>
              )}
            </div>

            {/* File input for new image */}
            <input
              type="file"
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded mt-4"
            />

            {/* Image preview */}
            {previewImage && (
              <div className="mt-4">
                <h3 className="text-slate-500">Image Preview</h3>
                <img src={previewImage} alt="Selected" className="w-20 h-20 rounded mt-2" />
              </div>
            )}
          </div>
        )}

        {inputType === "skills" && (
          <div>
            <h3 className="text-slate-500 mt-6">Your Skills</h3>
            <div className="flex flex-wrap mt-2">
              {newSkills.length > 0 ? (
                newSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-full px-4 py-2 mr-2 mb-2 flex items-center"
                  >
                    {skill}
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      &times;
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet.</p>
              )}
            </div>

            <h3 className="text-slate-500 mt-6">Add Skills</h3>
            {/* Search bar for skill selection */}
            <input
              type="text"
              placeholder="Search skills"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded mb-2"
            />
            <div className="flex flex-wrap mt-2">
              {/* Only show suggestions when the user is typing */}
              {searchQuery && filteredSkills.length > 0 ? (
                filteredSkills.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddSkill(skill)}
                    className={`px-4 py-2 mr-2 mb-2 rounded ${
                      newSkills.includes(skill)
                        ? "bg-green-400 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    disabled={newSkills.includes(skill)}
                  >
                    {skill}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">{searchQuery ? "No matching skills found." : ""}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="mr-2 text-gray-600 hover:underline">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(inputType === "skills" ? newSkills : newValue);
              onClose();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
