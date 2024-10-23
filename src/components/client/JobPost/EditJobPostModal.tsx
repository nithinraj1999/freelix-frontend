import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { editPost } from "../../../api/client/clientServices";

interface EditJobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: {
    _id: string;
    title: string;
    category: string;
    subCategory: string;
    description: string;
    skills: string[];
    experience: string;
    paymentType: string;
    hourlyPrice?: { from: number; to: number };
    fixedPrice?: number;
  };
}

const EditJobPostModal: React.FC<EditJobPostModalProps> = ({
  isOpen,
  onClose,
  jobData,
}) => {
  const [title, setTitle] = useState(jobData.title);
  const [description, setDescription] = useState(jobData.description);
  const [skillInput, setSkillInput] = useState("");
  const [skillList, setSkillList] = useState<string[]>(jobData.skills);
  const [selectedPaymentType, setSelectedPaymentType] = useState(jobData.paymentType);
  const [hourlyRateFrom, setHourlyRateFrom] = useState<number | undefined>(jobData.hourlyPrice?.from);
  const [hourlyRateTo, setHourlyRateTo] = useState<number | undefined>(jobData.hourlyPrice?.to);
  const [totalAmount, setTotalAmount] = useState<number | undefined>(jobData.fixedPrice);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useDispatch();

  const schema = z.object({
    title: z.string().min(1, "Title cannot be blank"),
    description: z.string().min(1, "Description is required"),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    experience: z.string().min(1, "Experience level is required"),
    paymentType: z.enum(["hourly", "fixed"]),
    hourlyRateFrom: z.number().positive("Hourly rate must be a positive number").optional(),
    hourlyRateTo: z.number().positive("Hourly rate must be a positive number").optional(),
    totalAmount: z.number().positive("Total amount must be a positive number").optional(),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = schema.safeParse({
      title,
      description,
      skills: skillList,
      experience: jobData.experience,
      paymentType: selectedPaymentType,
      hourlyRateFrom: selectedPaymentType === "hourly" ? hourlyRateFrom : undefined,
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
    }

    try {
      const updatedData: Partial<typeof jobData> = {};
      updatedData._id = jobData._id;
      updatedData.paymentType = selectedPaymentType;
      if (title !== jobData.title) updatedData.title = title;
      if (description !== jobData.description) updatedData.description = description;
      if (skillList.join(",") !== jobData.skills.join(",")) updatedData.skills = skillList;

      if (selectedPaymentType === "hourly") {
        if (hourlyRateFrom && hourlyRateTo) {
          updatedData.hourlyPrice = { from: hourlyRateFrom, to: hourlyRateTo };
        }
      } else if (selectedPaymentType === "fixed" && totalAmount !== jobData.fixedPrice) {
        updatedData.fixedPrice = totalAmount;
      }

      const response = await editPost(updatedData);
      if (response.success) {
        toast.success("Job post updated successfully!");
        onClose();
      } else {
        toast.error("Failed to update job post.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred while updating the job post.");
    }
  };

  const addSkillToList = () => {
    if (skillInput.trim() === "") {
      setErrors({ skills: "Skill cannot be empty" });
      return;
    }

    if (skillList.includes(skillInput)) {
      setErrors({ skills: "Skill already added" });
      return;
    }

    setSkillList([...skillList, skillInput]);
    setSkillInput("");
    setErrors({});
  };

  const handleRemoveSkill = (skillToRemove: string, event: React.MouseEvent) => {
    event.preventDefault();
    setSkillList(skillList.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-5 rounded-3xl shadow-md w-[900px] h-[600px] overflow-hidden px-8">
        <div className="h-full overflow-y-auto">
          <h2 className="text-lg font-bold">Edit Job Post</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-1 w-full"
              />
              {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-1 w-full"
                rows={10}
              />
              {errors.description && <p className="text-red-500">{errors.description}</p>}
            </div>

            <div>
              <label>Skills</label>
              <div>
                <input
                  placeholder="search skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="h-10 mt-1 px-2 w-1/2"
                />
                <button
                  type="button"
                  className="bg-black h-10 w-20 text-white"
                  onClick={addSkillToList}
                >
                  Add
                </button>
                <p className="text-slate-400 mt-1">
                  For the best results, add 3-5 skills
                </p>
                {errors.skills && <p className="text-red-500">{errors.skills}</p>}
              </div>
              <div>
                <h3 className="text-slate-500 mt-6">Selected Skills</h3>
                <div className="flex flex-wrap mt-2">
                  {skillList.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center bg-white rounded-full px-3 py-1 mr-2 mb-2"
                    >
                      <p className="text-sm text-blue-800">{skill}</p>
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

            <div>
              <label>Payment Type</label>
              <select
                value={selectedPaymentType}
                onChange={(e) => setSelectedPaymentType(e.target.value)}
                className="border p-1 w-full"
              >
                <option value="hourly">Hourly</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            {selectedPaymentType === "hourly" && (
              <div>
                <label>Hourly Rate From</label>
                <input
                  type="number"
                  value={hourlyRateFrom}
                  onChange={(e) => setHourlyRateFrom(Number(e.target.value))}
                  className="border p-1 w-full"
                />
                <label>Hourly Rate To</label>
                <input
                  type="number"
                  value={hourlyRateTo}
                  onChange={(e) => setHourlyRateTo(Number(e.target.value))}
                  className="border p-1 w-full"
                />
              </div>
            )}

            {selectedPaymentType === "fixed" && (
              <div>
                <label>Total Amount</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  className="border p-1 w-full"
                />
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Update Post
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-red-600"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditJobPostModal;
