import React, { useState } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentValue: string | File; // Handle text or file inputs
  onSave: (newValue: string | File) => void;
  inputType: "text" | "textarea" | "file";
  portfolioImages?: string[]; // Optional: existing portfolio images
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  title,
  currentValue,
  onSave,
  inputType,
  portfolioImages = [],
}) => {
  const [newValue, setNewValue] = useState<string | File>(currentValue);
  const [currentPortfolioImages, setCurrentPortfolioImages] = useState<string[]>(portfolioImages);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State for image preview

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

  const handleRemoveImage = (index: number) => {
    setCurrentPortfolioImages(currentPortfolioImages.filter((_, i) => i !== index));
  };

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

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(newValue);
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
