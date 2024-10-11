import React, { useState, useEffect } from "react";
import {
  getAllClientData,
  blockClient,
  unblockClient,
  createUser,
  editUser
} from "../../api/admin/adminServices";
import { useDispatch } from "react-redux";
import { updateUserBlockStatus } from "../../state/slices/userSlice";
import Modal from "./Modal";

const Client: React.FC = () => {
  interface Client {
    _id: string;
    profilePicture: string;
    name: string;
    email: string;
    phone: string;
    isBlock: boolean;
    status: "Active" | "Blocked";
  }

  const [clients, setClients] = useState<Client[]>([]);
  const dispatch = useDispatch();

  const fetchClients = async () => {
    try {
      const response = await getAllClientData();
      setClients(response.clients);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    profilePicture: File | null;
    profilePicturePreview: string;
  }>({
    name: "",
    email: "",
    phone: "",
    password: "",
    profilePicture: null,
    profilePicturePreview: "",
  });

  const [editFormData, setEditFormData] = useState<{
    _id:string;
    name: string;
    email: string;
    phone: string;
    profilePicture: File | null;
    profilePicturePreview: string;
  }>({
    _id:"",
    name: "",
    email: "",
    phone: "",
    profilePicture: null,
    profilePicturePreview: "",
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openEditModal = (clientID: string) => {
    try {
      const clientData = clients.find((client) => client._id === clientID); // Use '===' for comparison
      if (clientData) {
        setEditFormData({
          _id:clientID,
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          profilePicture: null, // Profile picture logic goes here
          profilePicturePreview: clientData.profilePicture || "", // Set the preview
        });
        setIsEditModalOpen(true);
      } else {
        console.error("Client not found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value, // Dynamically update the field based on the input name
    }));
  };



  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    try {
      payload.append("_id",editFormData._id)
      payload.append("name",editFormData.name)
      payload.append("email",editFormData.email)
      payload.append("phone", editFormData.phone);

      if (editFormData.profilePicture) {
        payload.append("profilePicture", editFormData.profilePicture);
      }

      const response = await editUser(payload);
      console.log(response);
      setIsEditModalOpen(false);
      fetchClients(); // Reload the client list
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("password", formData.password);
    if (formData.profilePicture) {
      payload.append("profilePicture", formData.profilePicture);
    }

    try {
      console.log(payload);
      
      const response = await createUser(payload);
      console.log(response);
      setIsModalOpen(false);
      fetchClients();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  

  const handleBlock = async (clientID: string) => {
    const response = await blockClient(clientID);
    if (response.success) {
      fetchClients();
      dispatch(updateUserBlockStatus({ userId: clientID, isBlock: true }));
    }
  };

  const handleUnblock = async (clientID: string) => {
    const response = await unblockClient(clientID);
    if (response.success) {
      fetchClients();
      dispatch(updateUserBlockStatus({ userId: clientID, isBlock: false }));
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
      profilePicture: null,
      profilePicturePreview: "",
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };


  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFormData((prevData) => ({
        ...prevData,
        profilePicture: file,
        profilePicturePreview: URL.createObjectURL(file),
      }));
    }
  };
  

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Manage Clients</h1>
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
            <th className="border px-4 py-2">Phone No</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={client._id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">
                <img
                  src={
                    client.profilePicture ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt={client.name}
                  className="rounded-full h-8 w-8 mx-auto"
                />
              </td>
              <td className="border px-4 py-2">{client.name}</td>
              <td className="border px-4 py-2">{client.email}</td>
              <td className="border px-4 py-2">{client.phone}</td>
              <td
                className={`border px-4 py-2 ${
                  client.isBlock ? "text-red-500" : "text-green-500"
                }`}
              >
                {client.isBlock ? "Blocked" : "Active"}
              </td>
              <td className="border px-4 py-2">
                <div className="flex justify-center space-x-2">
                  {client.isBlock ? (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => handleUnblock(client._id)}
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                      onClick={() => handleBlock(client._id)}
                    >
                      Block
                    </button>
                  )}
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => openEditModal(client._id)}
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create user Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Client"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Profile Picture
            </label>
            <label className="relative cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*" // This limits the file selection to images
              />
              {formData.profilePicturePreview ? (
                <img
                  src={formData.profilePicturePreview}
                  alt="Preview"
                  className="mt-2 h-20 w-20 object-cover rounded border border-gray-300"
                />
              ) : (
                <div className="mt-2 h-20 w-20 border border-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">Select Image</span>
                </div>
              )}
            </label>
          </div>

          <div className="flex justify-end mb-4">
            <button
              type="submit"
              className="bg-green-400 text-white px-4 py-2 rounded "
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit user Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Client"
      >
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditFieldChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={editFormData.email}
              onChange={handleEditFieldChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={editFormData.phone}
              onChange={handleEditFieldChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Profile Picture
            </label>
            <label className="relative cursor-pointer">
              <input
                type="file"
                onChange={handleEditFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
              />
              {editFormData.profilePicturePreview ? (
                <img
                  src={editFormData.profilePicturePreview}
                  alt="Preview"
                  className="mt-2 h-20 w-20 object-cover rounded border border-gray-300"
                />
              ) : (
                <div className="mt-2 h-20 w-20 border border-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">Select Image</span>
                </div>
              )}
            </label>
          </div>

          <div className="flex justify-end mb-4">
            <button
              type="submit"
              className="bg-blue-400 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Client;
