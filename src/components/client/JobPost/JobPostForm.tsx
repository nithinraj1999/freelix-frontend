import React, { useRef, useState, useEffect } from "react";
import { RootState } from "../../../state/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { createJobPost } from "../../../api/client/clientServices";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../state/slices/userSlice";
import { fetchSkills } from "../../../api/client/clientServices";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";

const JobPostForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [skillInput, setSkillInput] = useState<string>("");
  const [skillList, setSkillList] = useState<string[]>([]); 
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");
  const [hourlyRateFrom, setHourlyRateFrom] = useState<number | "">(""); 
  const [hourlyRateTo, setHourlyRateTo] = useState<number | "">("");
  const [totalAmount, setTotalAmount] = useState<number | "">(""); 
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useSelector((state: RootState) => state.user); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.isBlock) {
      dispatch(userLogout());
      navigate("/");
    }
  }, [user, navigate, dispatch]);

  const schema = z
    .object({
      title: z
        .string()
        .min(1, "Title cannot be blank")
        .refine(
          (value) => !/^ /.test(value),
          "Title cannot start with a space"
        ),

      description: z.string().min(1, "Description is required"),
      skills: z.array(z.string()).min(1, "At least one skill is required"),
      experience: z.string().min(1, "Experience level is required"),
      paymentType: z.enum(["hourly", "fixed"]),

      hourlyRateFrom: z
        .number()
        .positive("Hourly rate must be a positive number") 
        .optional(),

      hourlyRateTo: z
        .number()
        .positive("Hourly rate must be a positive number") 
        .optional(),

      totalAmount: z
        .number()
        .positive("Total amount must be a positive number")
        .optional(),
    })
    .refine(
      (data) => {
        if (data.paymentType === "hourly") {
          return (
            data.hourlyRateFrom !== undefined &&
            data.hourlyRateTo !== undefined &&
            data.hourlyRateFrom > 0 &&
            data.hourlyRateTo > 0
          ); 
        } else if (data.paymentType === "fixed") {
          return data.totalAmount !== undefined && data.totalAmount > 0; 
        }
        return true; 
      },
      {
        message: "",
        path: ["paymentType"], 
      }
    );

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click(); // Trigger input click on div click
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
  };

  // Handle adding skill to the list
  const addSkillToList = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (skillInput.trim() !== "") {
      setSkillList([...skillList, skillInput]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (
    skill: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setSkillList(skillList.filter((s) => s !== skill));
  };

  const handleChange = (level: string) => {
    setSelectedLevel(level);
  };

  const onPaymentTypeChange = (type: string) => {
    setSelectedPaymentType(type);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = schema.safeParse({
      title,
      description,
      skills: skillList,
      experience: selectedLevel,
      paymentType: selectedPaymentType,
      hourlyRateFrom:
        selectedPaymentType === "hourly" ? hourlyRateFrom : undefined,
      hourlyRateTo: selectedPaymentType === "hourly" ? hourlyRateTo : undefined,
      totalAmount: selectedPaymentType === "fixed" ? totalAmount : undefined,
    });

    if (!validationResult.success) {
      const validationErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((error) => {
        validationErrors[error.path[0]] = error.message;
      });
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }
    try {
      const postData = new FormData();
      if (selectedFile) {
        postData.append("file", selectedFile);
      }
      if (user) {
        postData.append("userID", user._id);
      }
      postData.append("skills", JSON.stringify(skillList));
      postData.append("title", title);

      postData.append("description", description);
      postData.append("experience", selectedLevel);
      postData.append("paymentType", selectedPaymentType);

      if (selectedPaymentType === "hourly") {
        postData.append("hourlyPrice[from]", hourlyRateFrom.toString()); 
        postData.append("hourlyPrice[to]", hourlyRateTo.toString()); 
      } else if (selectedPaymentType === "fixed") {
        postData.append("fixedPrice", totalAmount.toString());
      }
      const response = await createJobPost(postData);

      if (response.success) {
        toast.success("Job post created successfully!", {
          position: "top-right",
        });
        navigate("/my-job-post");
        console.log("Job post created successfully:", response);
      } else {
        console.error("Failed to create job post:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while creating the job post:", error);
    }
  };

  const [predefinedSkills, setPredefinedSkills] = useState<string[]>([]); 

  useEffect(() => {
    async function getSkills() {
      const response = await fetchSkills();
      console.log(response);
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
    setSkillList([...skillList, skill]);
    setSearchInput("");
    setSuggestedSkills([]);
  };

  const saveDescription = (description: any) => {
    setDescription(description);
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg w-11/12 max-w-4xl py-6">
          <form className="px-8 space-y-8" onSubmit={handleSubmit}>
            {/* Header Section */}
            <div>
              <h3 className="text-2xl font-bold text-blue-600">freelix</h3>
              <h1 className="text-4xl md:text-5xl font-extrabold mt-6 text-gray-800 leading-tight">
                Tell us what you need done.
              </h1>
              <p className="text-gray-500 mt-4">
                We'll guide you to create the brief. The more detail, the
                better.
              </p>
            </div>

            {/* Title Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Write a title for your job post
              </h2>
              <input
                placeholder="e.g., Build a responsive WordPress website"
                className="w-full h-12 mt-2 px-4 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <p className="text-red-500 mt-2">{errors.title}</p>
              )}
              <h3 className="text-gray-600 mt-4">Example titles</h3>
              <ul className="list-disc pl-6 text-gray-500 mt-2 space-y-1">
                <li>
                  Build responsive WordPress site with booking/payment
                  functionality
                </li>
                <li>AR experience needed for virtual product demos (ARCore)</li>
                <li>
                  Developer needed to update Android app UI for new OS/device
                  specs
                </li>
              </ul>
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800">Description</h3>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={saveDescription}
                placeholder="Write something..."
                className="mt-2"
              />
              {errors.description && (
                <p className="text-red-500 mt-2">{errors.description}</p>
              )}
            </div>

            {/* Skills Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                What are the main skills required for your work?
              </h3>
              <div className="relative mt-4">
                <input
                  placeholder="Search skills"
                  value={searchInput}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                />
                {suggestedSkills.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full z-10 max-h-48 overflow-y-auto shadow">
                    {suggestedSkills.map((skill, index) => (
                      <li
                        key={index}
                        onClick={() => selectSkill(skill)}
                        className="cursor-pointer hover:bg-blue-50 px-4 py-2 text-gray-700"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-gray-600">Selected Skills</h3>
                <div className="flex flex-wrap mt-2 space-x-2 space-y-2">
                  {skillList.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-2"
                    >
                      <p className="text-sm">{skill}</p>
                      <button
                        onClick={(event) => handleRemoveSkill(skill, event)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Level Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Level of Experience you want
              </h3>
              <div className="flex space-x-4 mt-4">
                {["Beginner", "Intermediate", "Experienced"].map((level) => (
                  <label
                    key={level}
                    className={`flex-1 p-4 text-center rounded-lg transition-colors duration-300 cursor-pointer ${
                      selectedLevel === level
                        ? "bg-blue-600 text-white border-2 border-blue-800"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="skill-level"
                      value={level}
                      checked={selectedLevel === level}
                      onChange={() => handleChange(level)}
                      className="hidden"
                    />
                    {level}
                  </label>
                ))}
              </div>
              {errors.experience && (
                <p className="text-red-500 mt-2">{errors.experience}</p>
              )}
            </div>

            {/* Budget Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Tell us about your budget.
              </h3>
              <p className="text-gray-500 mt-2">
                This will help us match you to talent within your range.
              </p>
              <div className="flex space-x-4 mt-4">
                {["hourly", "fixed"].map((type) => (
                  <label
                    key={type}
                    className={`flex-1 cursor-pointer h-10 text-center flex items-center justify-center rounded-lg transition-colors duration-300 ${
                      selectedPaymentType === type
                        ? "bg-blue-600 text-white border-2 border-blue-800"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-type"
                      value={type}
                      checked={selectedPaymentType === type}
                      onChange={() => onPaymentTypeChange(type)}
                      className="hidden"
                    />
                    {type === "hourly" ? "Hourly Pay" : "Fixed Price"}
                  </label>
                ))}
              </div>
                           {errors.paymentType && (
                    <p className="text-red-500">{errors.paymentType}</p>
                  )}
            </div>
            {/* Payment Details Section */}
            {selectedPaymentType === "hourly" && (
              <div className="mt-6">
                <h4 className="text-gray-700 font-bold mb-2">
                  Hourly Rate Range
                </h4>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    placeholder="From"
                    className="w-1/2 h-12 px-4 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                    value={hourlyRateFrom}
                    onChange={(e) =>
                      setHourlyRateFrom(
                        e.target.value ? parseFloat(e.target.value) : ""
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="To"
                    className="w-1/2 h-12 px-4 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                    value={hourlyRateTo}
                    onChange={(e) =>
                      setHourlyRateTo(
                        e.target.value ? parseFloat(e.target.value) : ""
                      )
                    }
                  />
                </div>
                {errors.hourlyRateFrom && (
                  <p className="text-red-500 mt-2">{errors.hourlyRateFrom}</p>
                )}
              </div>
            )}

            {selectedPaymentType === "fixed" && (
              <div className="mt-6">
                <h4 className="text-gray-700 font-bold mb-2">Fixed Price</h4>
                <input
                  type="number"
                  placeholder="Enter total amount"
                  className="w-full h-12 px-4 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                  value={totalAmount}
                  onChange={(e) =>
                    setTotalAmount(
                      e.target.value ? parseFloat(e.target.value) : ""
                    )
                  }
                />
                {errors.totalAmount && (
                  <p className="text-red-500 mt-2">{errors.totalAmount}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default JobPostForm;
