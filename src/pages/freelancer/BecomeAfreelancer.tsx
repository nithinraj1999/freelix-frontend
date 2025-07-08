import React, { useEffect, useState } from "react";
import { z } from "zod";
import { createFreelancerAccount } from "../../api/freelancer/freelancerServices";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../state/slices/userSlice";
import { fetchSkills } from "../../api/client/clientServices";
import { switchToSelling } from "../../api/freelancer/freelancerServices";
import LoadingSpinner from "../../components/LoadingSpinner";
// Zod schema for validation
const freelancerSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be blank")
    .refine((value) => !/^ /.test(value), "Name cannot start with a space"),

  description: z
    .string()
    .min(1, "Description cannot be blank")
    .refine(
      (value) => !/^ /.test(value),
      "Description cannot start with a space"
    ),

  skills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "At least one skill is required")
    .refine(
      (value) => !value.some((skill) => /^ /.test(skill)),
      "Skills cannot start with a space"
    ),

  languages: z
    .array(z.string().min(1, "Language cannot be empty"))
    .min(1, "At least one language is required")
    .refine(
      (value) => !value.some((language) => /^ /.test(language)),
      "Languages cannot start with a space"
    ),

  profilePicture: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Profile picture is required."),
});

const predefinedLanguages = [
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Arabic",
  "Armenian",
  "Bengali",
  "Bosnian",
  "Bulgarian",
  "Catalan",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Estonian",
  "Filipino",
  "Finnish",
  "French",
  "Georgian",
  "German",
  "Greek",
  "Gujarati",
  "Hebrew",
  "Hindi",
  "Hungarian",
  "Icelandic",
  "Indonesian",
  "Irish",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Korean",
  "Latvian",
  "Lithuanian",
  "Malay",
  "Malayalam",
  "Marathi",
  "Nepali",
  "Norwegian",
  "Persian",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Spanish",
  "Swedish",
];

const BecomeFreelancerForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const target = e.target as HTMLInputElement;
      setProfilePicture(target.files ? target.files[0] : null);
    } else if (name === "name") {
      setName(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  const addSkill = () => setSkills([...skills, ""]);
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };
  const removeSkill = (index: number) =>
    setSkills(skills.filter((_, i) => i !== index));

  const handleLanguageChange = (index: number, value: string) => {
    const newLanguages = [...languages];
    newLanguages[index] = value;
    setLanguages(newLanguages);

    if (value) {
      const filteredSuggestions = predefinedLanguages.filter((lang) =>
        lang.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (index: number, suggestion: string) => {
    const newLanguages = [...languages];
    newLanguages[index] = suggestion;
    setLanguages(newLanguages);
    setSuggestions([]);
  };

  const addLanguage = () => {
    setLanguages([...languages, ""]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e: React.FormEvent) => {
      if (isLoading) return;

  setIsLoading(true);

    e.preventDefault();

    setErrors({});

    try {
      const formData = freelancerSchema.parse({
        name,
        description,
        skills,
        languages,
        profilePicture,
      });

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("skills", JSON.stringify(formData.skills));
      data.append("languages", JSON.stringify(formData.languages));

      if (profilePicture) {
        data.append("profilePicture", profilePicture);
      }
      if (user?._id) {
        data.append("userID", user._id);
      }

      const response = await createFreelancerAccount(data);
      if (response.success) {
        console.log(response);
        const switchToFreelancer = await switchToSelling(response._id);
        setIsLoading(false);
        if (switchToFreelancer) {
          dispatch(userLogin(response.freelancerData));
          navigate("/freelancer");
          setIsLoading(false);

        }
      } else {
        navigate("/home");
        setIsLoading(false);

      }
    } catch (error) {
        setIsLoading(false);
      if (error instanceof z.ZodError) {
        const validationErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors); 
      }
    }
  };

  const [predefinedSkills, setPredefinedSkills] = useState<string[]>([]); 
  useEffect(() => {
    async function getSkills() {
      const response = await fetchSkills();
      console.log("skills....",response);
      const skillArray = response.skills.map(
        (item: { skill: string }) => item.skill
      );
      setPredefinedSkills(skillArray);
    }
    getSkills();
  }, []);

  const [searchInput, setSearchInput] = useState<string>("");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  useEffect(() => {
    // Filter the skills based on the input
    if (searchInput) {
      const filtered = predefinedSkills.filter((skill) =>
        skill.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSuggestedSkills(filtered);
    } else {
      setSuggestedSkills([]);
    }
  }, [searchInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const selectSkill = (skill: string) => {
    // Function to add the selected skill to the skill list
    setSkills([...skills, skill]);
    console.log(`Selected skill: ${skill}`);
    setSearchInput(""); // Clear the input after selection
    setSuggestedSkills([]); // Clear suggestions
  };

  return (
    <div className="bg-slate-100 py-1">
      <form
        className="max-w-3xl mx-auto p-8 bg-white rounded-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">
          Professional Info
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Tell us a bit about yourself. This information will appear on your
          public profile.
        </p>

        {/* Full Name Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2`}
              placeholder="Title"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
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
            {errors.profilePicture && (
              <p className="text-red-500 text-sm">{errors.profilePicture}</p>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={handleChange}
            className={`mt-1 block w-full border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2`}
            rows={6}
            placeholder="Share a bit about your work experience..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <div>
          <input
            placeholder="Search skills"
            value={searchInput}
            onChange={handleInputChange}
            className="h-10 mt-1 px-2 w-1/2"
          />
          {suggestedSkills.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-1/2 z-10">
              {suggestedSkills.map((skill, index) => (
                <li
                  key={index}
                  onClick={() => selectSkill(skill)}
                  className="cursor-pointer hover:bg-blue-100 px-2 py-1"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-slate-500 mt-6">Selected Skills</h3>
          <div className="flex flex-wrap mt-2">
            {skills.map((skill, index) => (
              <div
                key={skill}
                className="flex items-center bg-white rounded-full px-3 py-1 mr-2 mb-2"
              >
                <p className="text-sm text-blue-800">{skill}</p>
                <button
                  onClick={(event) => removeSkill(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  &times; {/* Close icon */}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Languages
          </label>
          <div className="space-y-2">
            {languages.map((language, index) => (
              <div key={index} className="flex items-center relative">
                <input
                  type="text"
                  value={language}
                  onChange={(e) => handleLanguageChange(index, e.target.value)}
                  className={`mt-1 block w-full border ${
                    errors.languages ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2`}
                  placeholder="Language"
                />
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="ml-2 text-red-600"
                >
                  Remove
                </button>

                {/* Show suggestions below the input box */}
                {suggestions.length > 0 && (
                  <ul className="absolute left-0 top-full z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                        onClick={() => selectSuggestion(index, suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {errors.languages && (
              <p className="text-red-500 text-sm">{errors.languages}</p>
            )}
          </div>
          <button
            type="button"
            onClick={addLanguage}
            className="mt-2 text-green-600"
          >
            Add
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-md flex items-center justify-center disabled:opacity-60"
            disabled={isLoading}

        >
            {isLoading ? (
<LoadingSpinner/>
  ) : (
    "Submit"
  )} 
        </button>
      </form>
    </div>
  );
};

export default BecomeFreelancerForm;
