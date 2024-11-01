
import React, { useState } from "react";
import { editMyBid } from "../../../api/freelancer/freelancerServices";
interface EditProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  bid: {
    _id: string;
    bidAmount: number;
    deliveryDays: number;
    proposal: string;
  } | null;
  
}

const EditProposalModal: React.FC<EditProposalModalProps> = ({
  isOpen,
  onClose,
  bid,
}) => {
  const [bidAmount, setBidAmount] = useState(bid?.bidAmount || 0);
  const [deliveryDays, setDeliveryDays] = useState(bid?.deliveryDays || 0);
  const [proposal, setProposal] = useState(bid?.proposal || "");

  if (!isOpen || !bid) return null;

  const handleSave = async() => {
    const data: Partial<typeof bid> = {};
        data._id =bid._id
    if (bidAmount !== bid.bidAmount) {
        data.bidAmount = bidAmount;
      }
      if (deliveryDays !== bid.deliveryDays) {
        data.deliveryDays = deliveryDays;
      }
      if (proposal !== bid.proposal) {
        data.proposal = proposal;
      }
    
      // Only call the API if there is changed data
      if (Object.keys(data).length > 0) {
        const editResponse = await editMyBid(data);
      }
       
      onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-1/3">
        <h2 className="text-xl font-semibold mb-4">Edit Proposal</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Bid Amount
          </label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Delivery Days
          </label>
          <input
            type="number"
            value={deliveryDays}
            onChange={(e) => setDeliveryDays(Number(e.target.value))}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Proposal
          </label>
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProposalModal;
