import React from 'react';

const SelectLanguage = ({ nextStep, handleChange, formData }: any) => {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange('language', e.target.value);
  };

  return (
    <div>
      <h2>Select your preferred language</h2>
      <select value={formData.language} onChange={handleLanguageChange}>
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="French">French</option>
        {/* Add other options */}
      </select>
      <button onClick={nextStep}>Next</button>
    </div>
  );
};

export default SelectLanguage;
