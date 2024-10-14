

import React, { useState } from 'react';
import { z } from 'zod';
import { createFreelancerAccount } from '../../api/freelancer/freelancerServices';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../../state/slices/userSlice';

// Zod schema for validation
const freelancerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be blank')
    .refine((value) => !/^ /.test(value), 'Name cannot start with a space'),

  description: z
    .string()
    .min(1, 'Description cannot be blank')
    .refine((value) => !/^ /.test(value), 'Description cannot start with a space'),

  skills: z
    .array(z.string().min(1, 'Skill cannot be empty'))
    .min(1, 'At least one skill is required')
    .refine((value) => !value.some(skill => /^ /.test(skill)), 'Skills cannot start with a space'),

  languages: z
    .array(z.string().min(1, 'Language cannot be empty'))
    .min(1, 'At least one language is required')
    .refine((value) => !value.some(language => /^ /.test(language)), 'Languages cannot start with a space'),

  profilePicture: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Profile picture is required.'),
});

const BecomeFreelancerForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const target = e.target as HTMLInputElement;
      setProfilePicture(target.files ? target.files[0] : null);
    } else if (name === 'name') {
      setName(value);
    } else if (name === 'description') {
      setDescription(value);
    }
  };

  const addSkill = () => setSkills([...skills, '']);
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };
  const removeSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));

  const addLanguage = () => setLanguages([...languages, '']);
  const handleLanguageChange = (index: number, value: string) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = value;
    setLanguages(updatedLanguages);
  };
  const removeLanguage = (index: number) => setLanguages(languages.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate the form with Zod schema
    try {
      const formData = freelancerSchema.parse({
        name,
        description,
        skills,
        languages,
        profilePicture,
      });

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('skills', JSON.stringify(formData.skills));
      data.append('languages', JSON.stringify(formData.languages));

      if (profilePicture) {
        data.append('profilePicture', profilePicture);
      }
      if (user?._id) {
        data.append('userID', user._id);
      }

      const response = await createFreelancerAccount(data);
      if (response.success) {
        dispatch(userLogin(response.freelancerData));
        navigate('/freelancer');
      } else {
        navigate('/home');
      }
    } catch (error) {
      // Catch validation errors
      if (error instanceof z.ZodError) {
        const validationErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors); // Set validation errors in state
      }
    }
  };

  return (
    <div className='bg-slate-100 py-1'>
      <form className="max-w-3xl mx-auto p-8 bg-white rounded-lg" onSubmit={handleSubmit}>
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
              className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2`}
              placeholder="Allen"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
            {errors.profilePicture && <p className="text-red-500 text-sm">{errors.profilePicture}</p>}
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={handleChange}
            className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2`}
            rows={6}
            placeholder="Share a bit about your work experience..."
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className={`mt-1 block w-full border ${errors.skills ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2`}
                  placeholder="Select Skill"
                />
                <button type="button" onClick={() => removeSkill(index)} className="ml-2 text-red-600">
                  Remove
                </button>
              </div>
            ))}
            {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
          </div>
          <button type="button" onClick={addSkill} className="mt-2 text-green-600">
            Add
          </button>
        </div>

        {/* Languages Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Languages</label>
          <div className="space-y-2">
            {languages.map((language, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={language}
                  onChange={(e) => handleLanguageChange(index, e.target.value)}
                  className={`mt-1 block w-full border ${errors.languages ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2`}
                  placeholder="Language"
                />
                <button type="button" onClick={() => removeLanguage(index)} className="ml-2 text-red-600">
                  Remove
                </button>
              </div>
            ))}
            {errors.languages && <p className="text-red-500 text-sm">{errors.languages}</p>}
          </div>
          <button type="button" onClick={addLanguage} className="mt-2 text-green-600">
            Add
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md">
          Submit
        </button>
      </form>
    </div>
  );
};

export default BecomeFreelancerForm;
