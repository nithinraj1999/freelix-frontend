import React, { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "../../../state/store";
import { useSelector } from "react-redux";
import { getAllHiring } from "../../../api/client/clientServices";
import { releasePaymentOfProject } from "../../../api/client/clientServices";
import Swal from "sweetalert2";
import { leaveAReview } from "../../../api/client/clientServices";
import { useNavigate } from "react-router-dom";

const MyHiring = () => {
  const [hirings, setHirings] = useState<any>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHiring, setSelectedHiring] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const[paymentReleased,setPaymentReleased] = useState(false)
  const [reviewText,setReviewText]=useState("")
  const [rating, setRating] = useState(0); 


  
  const navigate  = useNavigate()
  // Function to open modal with hiring details
  const openModal = (hiring: any) => {
    setSelectedHiring(hiring);
    setModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedHiring(null);
    setReviewText("")
    setRating(0)
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
        setPaymentReleased(true)
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

  const downloadFile = async (fileUrl: string) => {
    try {
      // Add 'fl_attachment' to force file download without changing the format
      const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");

      const response = await axios.get(downloadUrl, {
        responseType: "blob",
      });

      // Create a URL for the blob and initiate download
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Extract the file name from the URL and use the original file extension
      const fileName = fileUrl.split("/").pop() || "downloaded_file";

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the file name to the last part of the URL or a custom name
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("There was an error downloading the file. Please try again.");
    }
  };

  useEffect(() => {
    if (user?._id) {
      async function fetchAllHirings(clientId: string) {
        const data = { clientId: clientId };
        const response = await getAllHiring(data);
        console.log(response);
        setHirings(response.allHirings);
      }
      fetchAllHirings(user._id);
    }
  }, [user,paymentReleased]);



  const submitReview = async(freelancerId:string)=>{
    if(user?._id){
      const data = {
        clientId:user._id,
        freelancerId:freelancerId,
        review:reviewText,
        rating:rating

      }
      
      const response = await leaveAReview(data)
      if (response.success) {
        Swal.fire({
          title: 'Review Submitted!',
          text: 'Your review has been successfully submitted.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setReviewText("")
        setRating(0)
      }
      setModalOpen(false)
  
      
    }
  }

  const navigateToChat = (freelancerId: string,name:string) => {
   
    navigate('/chat', { state: { freelancerId,name } });
  };
  
  
  return (
    <div className="p-4 px-16">
      <h2 className="text-xl font-bold">Your Hirings</h2>

      {/* Hirings List */}
      <div className="space-y-4 bg-white">
        {hirings.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md w-full">
   
    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Hirings Available</h2>
    <p className="text-gray-600 text-center mb-4">
      It seems like there are no hirings at the moment. Check back later for new opportunities!
    </p>
    
  </div>
        ) : (
          hirings.map((hiring: any) => (
            <div
              key={hiring._id}
              className="border p-4 rounded-lg shadow-md flex justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {hiring.projectId.title}
                </h3>
                <p className="text-gray-500">
                  Freelancer: {hiring.freelancerId.name}
                </p>
                <p className="text-sm text-gray-400">Status: {hiring.status}</p>
                <p className="text-sm text-gray-400">
                  Start Date: {hiring.orderDate}
                </p>
                {/* <p className="text-sm text-gray-400">
                  End Date: {hiring.endDate}
                </p> */}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <p className="p-2 rounded text-gray-700 bg-blue-200">
                  {hiring.status}
                </p>

                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => openModal(hiring)}
                >
                  View
                </button>
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={()=>navigateToChat(hiring.freelancerId._id,hiring.freelancerId.name)}
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
            className="bg-blue-500 text-white p-2 rounded mt-2 block text-center"
            onClick={() => downloadFile(selectedHiring.delivery.fileUrl)}
          >
            Download Project  
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
              onClick={() => submitReview(selectedHiring.freelancerId._id)}
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
