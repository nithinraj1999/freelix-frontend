import React, { useState, useEffect } from "react";
import {
  getAllClientData,
  blockClient,
  unblockClient,
  createUser,
  editUser,
} from "../../api/admin/adminServices";
import { useDispatch } from "react-redux";
import { updateUserBlockStatus } from "../../state/slices/userSlice";
import Modal from "./Modal";
import { useSearchParams } from "react-router-dom";
import socket from "../../socket/socket";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [clients, setClients] = useState<Client[]>([]);
  const dispatch = useDispatch();
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const clientsPerPage = 5;

  const fetchClients = async (page: number) => {
    try {
      const response = await getAllClientData(page, clientsPerPage);
      console.log(response);

      setClients(response.clients);
      const totalClients = response.totalClients;
      // Set total pages by calculating based on the number of clients per page
      setTotalPages(Math.ceil(totalClients / clientsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClients(currentPage);
  }, [currentPage]);

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
    _id: string;
    name: string;
    email: string;
    phone: string;
    profilePicture: File | null;
    profilePicturePreview: string;
  }>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    profilePicture: null,
    profilePicturePreview: "",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination state

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
      const clientData = clients.find((client) => client._id === clientID);
      if (clientData) {
        setEditFormData({
          _id: clientID,
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          profilePicture: null,
          profilePicturePreview: clientData.profilePicture || "",
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

      if (editFormData.profilePicture) {
        payload.append("profilePicture", editFormData.profilePicture);
      }

      const response = await editUser(payload);
      console.log(response);
      setIsEditModalOpen(false);
      fetchClients(currentPage); // Reload the client list
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
      const response = await createUser(payload);
      console.log(response);
      setIsModalOpen(false);
      fetchClients(currentPage);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleBlock = async (clientID: string) => {
    const response = await blockClient(clientID);
    console.log(response);
    
    if (response.success) {
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === clientID ? { ...client, isBlock: true } : client
        )
      );
      socket.emit("blockClient", clientID);

    }
  };

  const handleUnblock = async (clientID: string) => {
    const response = await unblockClient(clientID);
    if (response.success) {
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === clientID ? { ...client, isBlock: false } : client
        )
      );
      socket.emit("unblockClient", clientID);

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

  // Search function
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients;

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setSearchParams({ page: pageNumber.toString() }); // Update URL parameter for the page number
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Manage Clients</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>

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
          {currentClients.map((client, index) => (
            <tr key={client._id} className="text-center">
              <td className="border px-4 py-2">
                {index + 1 + indexOfFirstClient}
              </td>
              <td className="border px-4 py-2">
                <img
                  src={client.profilePicture}
                  alt={client.name}
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="border px-4 py-2">{client.name}</td>
              <td className="border px-4 py-2">{client.email}</td>
              <td className="border px-4 py-2">{client.phone}</td>
              <td className="border px-4 py-2">
                {client.isBlock ? (
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleUnblock(client._id)}
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleBlock(client._id)}
                  >
                    Block
                  </button>
                )}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => openEditModal(client._id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-controls flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-white ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Previous
        </button>

        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg text-white ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>

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
