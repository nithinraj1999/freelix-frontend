import React, { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "../../../state/store";
import { useSelector } from "react-redux";
import { getAllHiring } from "../../../api/client/clientServices";
import { releasePaymentOfProject } from "../../../api/client/clientServices";
import Swal from "sweetalert2";
import { leaveAReview } from "../../../api/client/clientServices";
import { useNavigate } from "react-router-dom";
import { downloadDeliverable } from "../../../api/client/clientServices";
const MyHiring = () => {
  const [hirings, setHirings] = useState<any>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHiring, setSelectedHiring] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const [paymentReleased, setPaymentReleased] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const navigate = useNavigate();
  // Function to open modal with hiring details
  const openModal = (hiring: any) => {
    console.log("hiring",hiring);
    
    setSelectedHiring(hiring);
    setModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedHiring(null);
    setReviewText("");
    setRating(0);
  };

  const releasePayment = async (
    projectId: string,
    clientId: string,
    freelancerId: string,
    total: string
  ) => {
    const data = {
      projectId,
      clientId,
      freelancerId,
      total,
    };

    try {
      const response = await releasePaymentOfProject(data);

      if (response.success) {
        setPaymentReleased(true);
        Swal.fire({
          icon: "success",
          title: "Payment Released",
          text: `Payment of ${total} has been successfully released to the freelancer.`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: "There was an issue with releasing the payment.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while processing the payment.",
      });
    } finally {
      closeModal();
    }
  };


  useEffect(() => {
    if (user?._id) {
      async function fetchAllHirings(clientId: string) {
        const data = { clientId: clientId };
        const response = await getAllHiring(data);
        if(response.success){
          setHirings(response.allHirings)
        }
        
      }
      fetchAllHirings(user._id);
    }
  }, [user, paymentReleased]);

  const submitReview = async (freelancerId: string) => {
    if (user?._id) {
      const data = {
        clientId: user._id,
        freelancerId: freelancerId,
        review: reviewText,
        rating: rating,
      };

      const response = await leaveAReview(data);
      if (response.success) {
        Swal.fire({
          title: "Review Submitted!",
          text: "Your review has been successfully submitted.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setReviewText("");
        setRating(0);
      }
      setModalOpen(false);
    }
  };

  const navigateToChat = (freelancerId: string, name: string) => {
    navigate("/chat", { state: { freelancerId, name } });
  };
  const [isLoading, setIsLoading] = useState(false);

  const downloadFile = async (id: string) => {
    setIsLoading(true); 

    const data = {
      orderId: id,
    };

    try {
      const response = await downloadDeliverable(data);
      console.log(response);

      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "downloaded-file";

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to download file:", error);
      setIsLoading(false);
    }
  };


  console.log(hirings);
  
  return (
    <div className="p-4 px-16">
      <h2 className="text-xl font-bold">Your Hirings</h2>

      {/* Hirings List */}
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
  {hirings.length === 0 ? (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        No Hirings Available
      </h2>
      <p className="text-gray-600 text-center">
        It seems like there are no hirings at the moment. Check back later for
        new opportunities!
      </p>
    </div>
  ) : (
    hirings.map((hiring: any) => (
      <div
        key={hiring._id}
        className="border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4"
      >
        {/* Hiring Details */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {hiring.projectId?.title}
          </h3>
          <p className="text-gray-600">
            <span className="font-medium">Freelancer:</span>{" "}
            {hiring.freelancerId.name}
          </p>
          <p className="text-gray-500 text-sm">
            <span className="font-medium">Status:</span> {hiring.status}
          </p>
          <p className="text-gray-500 text-sm">
            <span className="font-medium">Start Date:</span> {hiring.orderDate}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <span
            className={`p-2 rounded text-white ${
              hiring.status === "Completed"
                ? "bg-green-500"
                : hiring.status === "In Progress"
                ? "bg-yellow-500"
                : "bg-gray-500"
            }`}
          >
            {hiring.status}
          </span>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            onClick={() => openModal(hiring)}
          >
            View
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition"
            onClick={() =>
              navigateToChat(
                hiring.freelancerId._id,
                hiring.freelancerId.name
              )
            }
          >
            Chat
          </button>
        </div>
      </div>
    ))
  )}
</div>


      {/* Modal */}
      {modalOpen && selectedHiring && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <h3 className="text-xl font-semibold">
              {selectedHiring.projectId.title}
            </h3>
            <p className="mt-2">
              Freelancer: {selectedHiring.freelancerId.name}
            </p>
            <p className="mt-1 text-gray-600">
              Status: {selectedHiring.status}
            </p>
            <p className="mt-1 text-gray-600">
              Start Date: {selectedHiring.orderDate}
            </p>

            {selectedHiring.status === "Completed" && (
              <div className="mt-4">
                <h4 className="font-semibold">Project Description</h4>
                <p className="mt-2 text-gray-700">
                  {selectedHiring.delivery.description}
                </p>

                {/* Download Project Button */}
                <button
                  className={`bg-blue-500 text-white p-2 rounded mt-2 block text-center relative ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => downloadFile(selectedHiring._id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-4 border-white border-solid border-t-transparent w-8 h-8 animate-spin rounded-full"></div>
                    </div>
                  ) : (
                    "Download Project"
                  )}
                </button>

                {/* Confirm and Release Payment Button */}
                {!selectedHiring.isPaymentReleased && (
                  <button
                    className="bg-green-500 text-white p-2 rounded mt-4"
                    onClick={() =>
                      releasePayment(
                        selectedHiring.projectId._id,
                        selectedHiring.clientId,
                        selectedHiring.freelancerId._id,
                        selectedHiring.total
                      )
                    }
                  >
                    Confirm and Release Payment
                  </button>
                )}

                {/* Rating and Review Section */}
                <div className="mt-4">
                  <h4 className="font-semibold">Leave a Rating and Review</h4>

                  {/* Rating Selection */}
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`cursor-pointer ${
                          rating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)} // Save rating in state
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review Text Area */}
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    rows={4}
                    value={reviewText}
                    placeholder="Write your review here..."
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>

                  <button
                    className="bg-purple-500 text-white p-2 rounded mt-2"
                    onClick={() =>
                      submitReview(selectedHiring.freelancerId._id)
                    }
                  >
                    Submit Rating and Review
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4">
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHiring;
