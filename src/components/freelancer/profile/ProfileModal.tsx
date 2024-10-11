import React, { useState } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentValue: string | File | string[];  // Handle text, file, and array of skills
  onSave: (newValue: string | File | string[]) => void;
  inputType: 'text' | 'textarea' | 'file' | 'skills'; // Define the type of input expected
  availableSkills?: string[]; // Optional: list of available skills for selection
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  title,
  currentValue,
  onSave,
  inputType,
  availableSkills = []
}) => {
  const [newValue, setNewValue] = useState<string | File | string[]>(currentValue);

  // Handle input changes based on type
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (inputType === 'file' && e.target instanceof HTMLInputElement && e.target.files) {
      setNewValue(e.target.files[0]);
    } else if (inputType === 'skills' && e.target instanceof HTMLSelectElement) {
      setNewValue(Array.from(e.target.selectedOptions, (option) => option.value));
    } else {
      setNewValue(e.target.value);
    }
  };

  // Handle skill selection for checkboxes
  const handleSkillToggle = (skill: string) => {
    if (Array.isArray(newValue)) {
      if (newValue.includes(skill)) {
        setNewValue(newValue.filter((s) => s !== skill));
      } else {
        setNewValue([...newValue, skill]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        
        {/* Render input based on the inputType prop */}
        {inputType === 'text' && (
          <input
            type="text"
            value={newValue as string}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 w-full rounded"
          />
        )}

        {inputType === 'textarea' && (
          <textarea
            value={newValue as string}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 w-full rounded"
            rows={4}
          />
        )}

        {inputType === 'file' && (
          <input
            type="file"
            onChange={handleInputChange}
            className="border border-gray-300 p-2 w-full rounded"
          />
        )}

        {inputType === 'skills' && (
          <div className="flex flex-wrap">
            {availableSkills.map((skill) => (
              <label key={skill} className="mr-4 mb-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(newValue) && newValue.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  className="mr-2"
                />
                {skill}
              </label>
            ))}
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
