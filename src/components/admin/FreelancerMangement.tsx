import React, { useState, useEffect } from "react";
import {
  getAllFreelancerData,
  blockFreelancer,
  unblockFreelancer,
  createFreelancer,
  editFreelancer,
} from "../../api/admin/adminServices"; 
import { useDispatch } from "react-redux";
import { updateFreelancerBlockStatus } from "../../state/slices/userSlice";

import Modal from "./Modal";
const Freelancer: React.FC = () => {

  console.log("Freelancer....compo");
  
  interface Freelancer {
    _id: string;
    profilePicture: string;
    name: string;
    email: string;
    description: string;
    skills: string[];
    languages: string[];
    phone: string;
    isBlock: boolean;
    isFreelancerBlock:boolean;
    status: "Active" | "Blocked";
  }

  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const dispatch = useDispatch();

  const fetchFreelancers = async () => {
    try {
      const response = await getAllFreelancerData();
      console.log(response);

      setFreelancers(response.freelancers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    description: string;
    skills: string;
    languages: string;
    profilePicture: File | null;
    profilePicturePreview: string;
  }>({
    name: "",
    email: "",
    phone: "",
    password: "",
    description: "",
    skills: "",
    languages: "",
    profilePicture: null,
    profilePicturePreview: "",
  });

  const [editFormData, setEditFormData] = useState<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    description: string;
    skills: string;
    languages: string;
    profilePicture: File | null;
    profilePicturePreview: string;
  }>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    description: "",
    skills: "",
    languages: "",
    profilePicture: null,
    profilePicturePreview: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openEditModal = (freelancerID: string) => {
    try {
      const freelancerData = freelancers.find(
        (freelancer) => freelancer._id === freelancerID
      );
      if (freelancerData) {
        setEditFormData({
          _id: freelancerID,
          name: freelancerData.name,
          email: freelancerData.email,
          phone: freelancerData.phone,
          description: freelancerData.description,
          skills: freelancerData.skills.join(", "),
          languages: freelancerData.languages.join(", "),
          profilePicture: null,
          profilePicturePreview: freelancerData.profilePicture || "",
        });
        setIsEditModalOpen(true);
      } else {
        console.error("Freelancer not found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();

    try {
      payload.append("_id", editFormData._id);
      payload.append("name", editFormData.name);
      payload.append("email", editFormData.email);
      payload.append("phone", editFormData.phone);
      payload.append("description", editFormData.description);

      const skillsArray = editFormData.skills
        .split(",")
        .map((skill) => skill.trim());
      payload.append("skills", JSON.stringify(skillsArray));

      const languagesArray = editFormData.languages
        .split(",")
        .map((language) => language.trim());
      payload.append("languages", JSON.stringify(languagesArray));

      if (editFormData.profilePicture) {
        payload.append("profilePicture", editFormData.profilePicture);
      }
      for (let pair of payload.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await editFreelancer(payload); // Update API call
      console.log(response);
      setIsEditModalOpen(false);
      fetchFreelancers();
    } catch (error) {
      console.error("Error updating freelancer:", error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("password", formData.password);
    payload.append("description", formData.description);

    // Convert skills string to an array and append to payload
    const skillsArray = formData.skills.split(",").map((skill) => skill.trim());
    payload.append("skills", JSON.stringify(skillsArray)); // Stringify the array

    // Convert languages string to an array and append to payload
    const languagesArray = formData.languages
      .split(",")
      .map((language) => language.trim());
    payload.append("languages", JSON.stringify(languagesArray)); // Stringify the array

    if (formData.profilePicture) {
      payload.append("profilePicture", formData.profilePicture);
    }

    try {
      const response = await createFreelancer(payload); // Update API call
      console.log(response);
      setIsModalOpen(false);
      fetchFreelancers();
    } catch (error) {
      console.error("Error creating freelancer:", error);
    }
  };

  const handleBlock = async (freelancerID: string) => {
    const response = await blockFreelancer(freelancerID); // Update API call
    console.log(response)
    if (response.success) {
      fetchFreelancers();
      dispatch(updateFreelancerBlockStatus({ userId: freelancerID, isFreelancerBlock: true }));
    }
  };

  const handleUnblock = async (freelancerID: string) => {
    const response = await unblockFreelancer(freelancerID); // Update API call
    console.log(response)
    if (response.success) {
      fetchFreelancers();
      dispatch(updateFreelancerBlockStatus({ userId: freelancerID, isFreelancerBlock: false }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: file,
        profilePicturePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      description: "",
      skills: "",
      languages: "",
      profilePicture: null,
      profilePicturePreview: "",
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };


  const handleFileChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Check if a file is selected
    if (file) {
      setEditFormData((prevData) => ({
        ...prevData,
        profilePicture: file,
        profilePicturePreview: URL.createObjectURL(file), // For preview purposes
      }));
    }
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Manage Freelancers</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 bg-green-500 text-white px-4 py-2 mb-2 rounded hover:bg-green-700"
      >
        Create
      </button>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Img</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Skills</th>
            <th className="border px-4 py-2">Languages</th>
            <th className="border px-4 py-2">Phone No</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {freelancers.map((freelancer, index) => (
            <tr key={freelancer._id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">
                <img
                  src={
                    freelancer.profilePicture ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt={freelancer.name}
                  className="rounded-full h-8 w-8 mx-auto"
                />
              </td>
              <td className="border px-4 py-2">{freelancer.name}</td>
              <td className="border px-4 py-2">{freelancer.email}</td>
              <td className="border px-4 py-2">
                {freelancer.description.length > 300
                  ? freelancer.description.slice(0, 300) + "..."
                  : freelancer.description}
              </td>
              <td className="border px-4 py-2">
                <ul className=" list-inside text-left">
                  {freelancer.skills.map(
                    (skill: string, skillIndex: number) => (
                      <li key={skillIndex}>{skill}</li>
                    )
                  )}
                </ul>
              </td>
              <td className="border px-4 py-2">
                <ul className=" list-inside text-left">
                  {freelancer.languages.map(
                    (language: string, langIndex: number) => (
                      <li key={langIndex}>{language}</li>
                    )
                  )}
                </ul>
              </td>
              <td className="border px-4 py-2">{freelancer.phone}</td>
              <td className="border px-4 py-2">
                {freelancer.isFreelancerBlock ? "Blocked" : "Active"}
              </td>
              <td className="border px-4 py-2">
                {freelancer.isFreelancerBlock ? (
                  <button
                    onClick={() => handleUnblock(freelancer._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlock(freelancer._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Block
                  </button>
                )}
                <button
                  onClick={() => openEditModal(freelancer._id)}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title="Create Freelancer"
          onClose={handleCloseModal}
        >
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone No"
              value={formData.phone}
              onChange={handleChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              value={formData.skills}
              onChange={handleChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="text"
              name="languages"
              placeholder="Languages (comma-separated)"
              value={formData.languages}
              onChange={handleChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="block w-full mb-2"
            />
            {formData.profilePicturePreview && (
              <img
                src={formData.profilePicturePreview}
                alt="Profile Preview"
                className="h-24 w-24 mb-2"
              />
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create
            </button>
          </form>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit Freelancer"
        >
          {/* <h2 className="text-xl mb-4">Edit Freelancer</h2> */}
          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editFormData.name}
              onChange={handleEditFieldChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={editFormData.email}
              onChange={handleEditFieldChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone No"
              value={editFormData.phone}
              onChange={handleEditFieldChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={editFormData.description}
              onChange={handleEditFieldChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              value={editFormData.skills}
              onChange={handleEditFieldChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="text"
              name="languages"
              placeholder="Languages (comma-separated)"
              value={editFormData.languages}
              onChange={handleEditFieldChange}
              required
              className="block w-full mb-2 border rounded p-2"
            />
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChangeEdit}
              className="block w-full mb-2"
            />
            {editFormData.profilePicturePreview && (
              <img
                src={editFormData.profilePicturePreview}
                alt="Profile Preview"
                className="h-24 w-24 mb-2"
              />
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Freelancer;
