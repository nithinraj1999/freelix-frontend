import React, { useState } from "react";
import { editMyBid } from "../../../api/freelancer/freelancerServices";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";

interface EditProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  bid: {
    _id: string;
    bidAmount: string;
    deliveryDays: string;
    proposal: string;
  } | null;
  setBidDetails: React.Dispatch<React.SetStateAction<any[]>>;
}

const EditProposalModal: React.FC<EditProposalModalProps> = ({
  isOpen,
  onClose,
  bid,
  setBidDetails,
}) => {
  const [bidAmount, setBidAmount] = useState(bid?.bidAmount || "");
  const [deliveryDays, setDeliveryDays] = useState(bid?.deliveryDays || "");
  const [proposal, setProposal] = useState(bid?.proposal || "");

  if (!isOpen || !bid) return null;

  const handleSave = async () => {
    try {
      const response = await editMyBid({ _id: bid._id, bidAmount, deliveryDays, proposal });
      
      if (response.success && response.editedBid) {
        setBidDetails((prevBids) => {
          if (Array.isArray(prevBids)) {
            return prevBids.map((b) => (b._id === bid._id ? response.editedBid : b));
          }
  
          if (prevBids ) {
            return response.editedBid;
          }
          return prevBids;
        });
  
        onClose();
      } else {
        console.error("Error: No edited bid returned or success is false");
      }
    } catch (error) {
      console.error("Error editing bid:", error);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-1/3">
        <h2 className="text-lg font-bold mb-4">Edit Your Bid</h2>
        <input
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="w-full p-2 mb-2 border"
          placeholder="Bid Amount"
        />
        <input
          value={deliveryDays}
          onChange={(e) => setDeliveryDays(e.target.value)}
          className="w-full p-2 mb-2 border"
          placeholder="Delivery Days"
        />
        {/* <textarea
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          className="w-full p-2 border"
          placeholder="Proposal"
        /> */}
        <ReactQuill
                        theme="snow"
                        value={proposal}
                        onChange={(value) => setProposal(value)}
                        placeholder="Write something..."
                        className="mt-2"
                      />
        
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProposalModal;
