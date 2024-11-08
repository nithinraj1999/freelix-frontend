import React, { useState } from 'react';
import { z } from 'zod';
import { addSkills } from '../../api/admin/adminServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const skillSchema = z.object({
  skill: z.string().min(1, { message: "Skill is required" }).refine(value => value.trim() !== '', {
    message: "Skill cannot be blank"
  }),
  description: z.string().min(1, { message: "Description is required" }).refine(value => value.trim() !== '', {
    message: "Description cannot be blank"
  }),
});

const SkillManagement: React.FC = () => {
  const [skill, setSkill] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{ skill?: string; description?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = skillSchema.safeParse({ skill, description });

    if (!result.success) {
      const fieldErrors: { skill?: string; description?: string } = {};
      result.error.errors.forEach((error) => {
        if (error.path.includes("skill")) fieldErrors.skill = error.message;
        if (error.path.includes("description")) fieldErrors.description = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const skillData = {
      skill,
      description,
    };
    
    try {
      const response = await addSkills(skillData);
      console.log(response);
      if (response.success) {
        toast.success("Skill added successfully!");
        // Reset the input fields after successful submission
        setSkill('');
        setDescription('');
        setErrors({});
      }
    } catch (error) {
      toast.error("An error occurred while adding the skill.");
      console.error("Error adding skill:", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full mt-28 bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg mx-4 sm:mx-0">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Add a Skill</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="skill" className="block text-gray-700 font-medium mb-2">Skill</label>
            <input
              type="text"
              id="skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Enter a skill"
              className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none ${errors.skill ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
            />
            {errors.skill && <p className="text-red-500 text-sm mt-1">{errors.skill}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the skill"
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-2 rounded-lg transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default SkillManagement;
