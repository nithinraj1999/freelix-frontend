import React, { useRef, useState } from "react";

const JobPostForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to the hidden input

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

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "graphic",
    "graphic design",
    "web development",
    "UI/UX design",
  ]);

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleChange = (level: string) => {
    setSelectedLevel(level);
  };

  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null);

  const onPaymentTypeChange = (type: string) => {
    setSelectedPaymentType(type);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-slate-100 h-full w-3/4 py-3">
        <form className="px-16">
          <div>
            <h3 className="text-3xl font-bold">freelix</h3>
            <h1 className="text-6xl whitespace-nowrap font-extrabold mt-10">
              Tell us what you
              <br />
              need done.
            </h1>
            <br />
            <p className="text-slate-400">
              we'll guide you to create the brief. The more detail the better
            </p>
            <br />
          </div>
          <div>
            <h2 className="text-lg font-bold">Write a title for your job post</h2>
            <input
              placeholder="ex. Build a responsive WordPress website "
              className="w-full h-10 mt-1 px-2"
            ></input>
            <h3 className="text-slate-500 mt-1">Example titles</h3>
            <ul className="list-disc pl-8 text-slate-400 mt-1">
              <li>Build responsive WordPress site with booking/payment functionality</li>
              <li>AR experience needed for virtual product demos (ARCore)</li>
              <li>Developer needed to update Android app UI for new OS/device specs</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mt-6">Select Category & subcategory</h3>
            <input placeholder="Category" className="h-10 mt-1 px-2 mr-2"></input>
            <input placeholder="subcategory" className="h-10 mt-1 px-2"></input>
          </div>
          <div>
            <h3 className="text-lg font-bold mt-6">Description</h3>
            <textarea rows={6} className="mt-1 px-2 py-0.5 w-full"></textarea>
          </div>
          <div
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 text-gray-500 hover:bg-gray-100 mt-6"
          >
            {!selectedFile && !isDragging ? (
              <>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-gray-500">
                    Drag & drop any images or documents that might be helpful in
                    explaining your brief here.
                  </p>
                  <p className="text-xs text-gray-400">(Max 25 MB)</p>
                </div>
              </>
            ) : isDragging ? (
              <p className="text-sm text-gray-700">Drop to attach file</p>
            ) : (
              <p className="text-sm text-gray-600">
                Selected File: {selectedFile?.name}
              </p>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold mt-6">
              What are the main skills required for your work?
            </h3>
            <div>
              <input
                placeholder="search skills"
                className="h-10 mt-1 px-2 w-1/2"
              ></input>
              <p className="text-slate-400 mt-1">for the best results.add 3-5 skills</p>
            </div>
            <div>
              <h3 className="text-slate-500 mt-6">Selected Skills</h3>
              <div className="flex flex-wrap mt-2">
                {selectedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center bg-blue-200 rounded-full px-3 py-1 mr-2 mb-2"
                  >
                    <p className="text-sm text-blue-800">{skill}</p>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      &times; {/* Close icon */}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mt-6">Level of Experience you want</h3>
              <div className="flex space-x-4 h-40 mt-6">
                {["Beginner", "Intermediate", "Experienced"].map((level) => (
                  <label
                    key={level}
                    className={`flex-1 p-3 rounded-lg transition-colors duration-300 cursor-pointer ${
                      selectedLevel === level
                        ? "bg-blue-600 text-white border-2 border-blue-800" // Style for selected
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="skill-level"
                      value={level}
                      checked={selectedLevel === level}
                      onChange={() => handleChange(level)}
                      className="hidden" // Hide the default radio button
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-32">
              <h3 className="text-lg font-bold mt-6">Tell us about your budget.</h3>
              <p className="text-slate-500 mt-1">
                This will help us match you to talent within your range.
              </p>
              <div>
                <div className="flex space-x-4 mb-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="payment-type"
                      value="hourly"
                      checked={selectedPaymentType === "hourly"}
                      onChange={() => onPaymentTypeChange("hourly")}
                      className="hidden" // Hide the default radio button
                    />
                    <div
                      className={`p-3 rounded-lg transition-colors duration-300 ${
                        selectedPaymentType === "hourly"
                          ? "bg-blue-600 text-white border-2 border-blue-800"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      Hourly Pay
                    </div>
                  </label>

                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="payment-type"
                      value="fixed"
                      checked={selectedPaymentType === "fixed"}
                      onChange={() => onPaymentTypeChange("fixed")}
                      className="hidden" // Hide the default radio button
                    />
                    <div
                      className={`p-3 rounded-lg transition-colors duration-300 ${
                        selectedPaymentType === "fixed"
                          ? "bg-blue-600 text-white border-2 border-blue-800"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      Fixed Price
                    </div>
                  </label>
                </div>

                {/* Conditional Input Fields */}
                {selectedPaymentType === "hourly" && (
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      placeholder="From"
                      className="p-3 border rounded-lg w-1/2"
                    />
                    <input
                      type="number"
                      placeholder="To"
                      className="p-3 border rounded-lg w-1/2"
                    />
                  </div>
                )}
                {selectedPaymentType === "fixed" && (
                  <div className="flex space-x-4 mt-4">
                    <input
                      type="number"
                      placeholder="Total Amount"
                      className="p-3 border rounded-lg w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;
