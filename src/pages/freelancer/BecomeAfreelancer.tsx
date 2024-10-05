import React, { useState } from 'react';
import { createFreelancerAccount } from '../../api/admin/freelancerServices';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../state/store';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../../state/slices/userSlice';

interface Education {
  id: number;
  degree: string;
}

const BecomeFreelancerForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]); // Array of strings for skills
  const [educations, setEducations] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<string[]>([]); // Array of strings for languages
  console.log("skills.....",skills);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const target = e.target as HTMLInputElement; // Type assertion
      setProfilePicture(target.files ? target.files[0] : null);
    } else if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'description') {
      setDescription(value);
    }
  };

  // Skills management
  const addSkill = () => setSkills([...skills, '']);
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };
  const removeSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));

  // Languages management
  const addLanguage = () => setLanguages([...languages, '']);
  const handleLanguageChange = (index: number, value: string) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = value;
    setLanguages(updatedLanguages);
  };
  const removeLanguage = (index: number) => setLanguages(languages.filter((_, i) => i !== index));

  const addEducation = () => {
    const newEducation = { id: educations.length + 1, degree: '' };
    setEducations([...educations, newEducation]);
  };

  const handleEducationChange = (id: number, value: string) => {
    setEducations(educations.map(edu => (edu.id === id ? { ...edu, degree: value } : edu)));
  };

  const removeEducation = (id: number) => setEducations(educations.filter(edu => edu.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('description', description);
    if (user?._id) {
      formData.append('userID', user._id); // TypeScript ensures user._id is not undefined here
    }

    // Only append the profilePicture if it exists
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    // Append JSON-encoded arrays
    formData.append('skills', JSON.stringify(skills)); // Array of strings
    formData.append('educations', JSON.stringify(educations));
    formData.append('languages', JSON.stringify(languages)); // Array of strings

    try {
      const response = await createFreelancerAccount(formData);
      if(response.success){
        console.log(response);
        dispatch(userLogin(response.freelancerData)); 
        navigate('/freelancer')
      }else{
        navigate('/home')
      }
      console.log('Freelancer account created successfully:', response);
    } catch (error) {
      console.error('Error creating freelancer account:', error);
    }
  };

  return (
    <div className='bg-slate-100 py-1	'>

  
    <form className="max-w-3xl mx-auto p-8 bg-white  rounded-lg" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Professional Info</h2>
      <p className="text-sm text-gray-500 mb-8">Tell us a bit about yourself. This information will appear on your public profile.</p>

      {/* Full Name Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
            placeholder="Allen"
          />
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <div className="mt-2">
          <div className="flex items-center">
            {profilePicture ? (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Profile"
                className="inline-block h-16 w-16 rounded-full"
              />
            ) : (
              <div className="inline-block h-16 w-16 rounded-full bg-gray-300" />
            )}
            <input
              type="file"
              onChange={handleChange}
              className="ml-4 p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
          rows={6}
          placeholder="Share a bit about your work experience..."
        />
      </div>

      {/* Languages */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Languages</label>
        <div className="space-y-2">
          {languages.map((lang, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={lang}
                onChange={(e) => handleLanguageChange(index, e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                placeholder="Select Language"
              />
              <button type="button" onClick={() => removeLanguage(index)} className="ml-2 text-red-600">
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addLanguage} className="mt-2 text-green-600">
          Add
        </button>
      </div>

      {/* Education */}
      {/* <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Education</label>
        <div className="space-y-2">
          {educations.map(edu => (
            <div key={edu.id} className="flex items-center">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleEducationChange(edu.id, e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                placeholder="Select Education"
              />
              <button type="button" onClick={() => removeEducation(edu.id)} className="ml-2 text-red-600">
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addEducation} className="mt-2 text-green-600">
          Add
        </button>
      </div> */}

      {/* Skills */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Skills</label>
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                placeholder="Select Skill"
              />
              <button type="button" onClick={() => removeSkill(index)} className="ml-2 text-red-600">
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addSkill} className="mt-2 text-green-600">
          Add
        </button>
      </div>

      <button
        type="submit"
        className="block w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700"
      >
        Submit
      </button>
    </form>
    </div>
  );
};

export default BecomeFreelancerForm;
