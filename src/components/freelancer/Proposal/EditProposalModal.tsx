
// import React, { useState } from "react";
// import { editMyBid } from "../../../api/freelancer/freelancerServices";
// import { z } from "zod"; // For validation error handling
// import { editBidSchema } from "../../../utils/validation";

// interface Bid {
//   _id: string;
//   bidAmount: string; 
//   deliveryDays: string; 
//   proposal: string;
//   status: string;
//   freelancerId: {
//     _id: string;
//     name: string;
//     profilePicture: string;
//     title: string;
//   };
// }

// interface EditProposalModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//     bid: {
//     _id: string;
//     bidAmount: string; 
//     deliveryDays: string; 
//     proposal: string;
//   } | null;
//   setBidDetails: (data:any) => void; 
// }

// const EditProposalModal: React.FC<EditProposalModalProps> = ({
//   isOpen,
//   onClose,
//   bid,
//   setBidDetails,
// }) => {
//   const [bidAmount, setBidAmount] = useState(bid?.bidAmount || "0");
//   const [deliveryDays, setDeliveryDays] = useState(bid?.deliveryDays || "0");
//   const [proposal, setProposal] = useState(bid?.proposal || "");
//   const [errors, setErrors] = useState<{ [key: string]: string }>({
//     bidAmount: "",
//     deliveryDays: "",
//     proposal: "",
//   });
//   console.log("setBidDetails type:", typeof setBidDetails); 
//   const [isBidAmountChanged, setIsBidAmountChanged] = useState(false);
//   const [isDeliveryDaysChanged, setIsDeliveryDaysChanged] = useState(false);
//   const [isProposalChanged, setIsProposalChanged] = useState(false);

//   if (!isOpen || !bid) return null;

//   const validate = () => {
//     const newErrors = { bidAmount: "", deliveryDays: "", proposal: "" };

//     if (isBidAmountChanged) {
//       try {
//         editBidSchema.parse({ bidAmount, deliveryDays, proposal });
//       } catch (err) {
//         if (err instanceof z.ZodError) {
//           newErrors.bidAmount = err.errors.find(e => e.path[0] === 'bidAmount')?.message || "";
//         }
//       }
//     }

//     if (isDeliveryDaysChanged) {
//       try {
//         editBidSchema.parse({ bidAmount, deliveryDays, proposal });
//       } catch (err) {
//         if (err instanceof z.ZodError) {
//           newErrors.deliveryDays = err.errors.find(e => e.path[0] === 'deliveryDays')?.message || "";
//         }
//       }
//     }

//     if (isProposalChanged) {
//       try {
//         editBidSchema.parse({ bidAmount, deliveryDays, proposal });
//       } catch (err) {
//         if (err instanceof z.ZodError) {
//           newErrors.proposal = err.errors.find(e => e.path[0] === 'proposal')?.message || "";
//         }
//       }
//     }

//     setErrors(newErrors);
//     return !Object.values(newErrors).some(error => error); // Returns true if no errors
//   };

//   const handleSave = async () => {
//     if (!validate()) {
//       return;
//     }

//     const data: Partial<typeof bid> = { _id: bid._id };

//     // Ensure we send strings
//     data.bidAmount = bidAmount; 
//     data.deliveryDays = deliveryDays;
//     data.proposal = proposal;

//     // Only include if they have changed
//     if (bidAmount !== bid.bidAmount || deliveryDays !== bid.deliveryDays || proposal !== bid.proposal) {
//       const editResponse = await editMyBid(data);
//       if(editResponse){
//         console.log("edited...", editResponse.editedBid);

//         // window.location.reload();
//         setBidDetails(editResponse.editedBid);
//       }
      
      
//     }

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
//       <div className="bg-white p-6 rounded-md shadow-md w-1/3">
//         <h2 className="text-xl font-semibold mb-4">Edit Proposal</h2>
        
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Bid Amount
//           </label>
//           <input
//             type="text" // Keep as text to allow string input
//             value={bidAmount}
//             onChange={(e) => {
//               setBidAmount(e.target.value);
//               setIsBidAmountChanged(true); // Mark field as changed
//             }} 
//             className="w-full border p-2 rounded mt-1"
//           />
//           {errors.bidAmount && <p className="text-red-500 text-sm">{errors.bidAmount}</p>} {/* Display error message */}
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Delivery Days
//           </label>
//           <input
//             type="text" 
//             value={deliveryDays}
//             onChange={(e) => {
//               setDeliveryDays(e.target.value);
//               setIsDeliveryDaysChanged(true); 
//             }} 
//             className="w-full border p-2 rounded mt-1"
//           />
//           {errors.deliveryDays && <p className="text-red-500 text-sm">{errors.deliveryDays}</p>} {/* Display error message */}
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Proposal
//           </label>
//           <textarea
//             value={proposal}
//             onChange={(e) => {
//               setProposal(e.target.value);
//               setIsProposalChanged(true); // Mark field as changed
//             }} 
//             className="w-full border p-2 rounded mt-1"
//           ></textarea>
//           {errors.proposal && <p className="text-red-500 text-sm">{errors.proposal}</p>} {/* Display error message */}
//         </div>

//         <div className="flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded mr-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProposalModal;



import React, { useState } from "react";
import { editMyBid } from "../../../api/freelancer/freelancerServices";

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
        // setBidDetails((prevBids) =>
        //   prevBids.map((b) => (b._id === bid._id ? response.editedBid : b))
        // );
        setBidDetails((prevBids) => {
          // Handle case where `prevBids` is an array
          if (Array.isArray(prevBids)) {
            return prevBids.map((b) => (b._id === bid._id ? response.editedBid : b));
          }
  
          // Handle case where `prevBids` is a single object
          if (prevBids ) {
            return response.editedBid;
          }
  
          // Fallback for unexpected cases
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
        <textarea
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          className="w-full p-2 border"
          placeholder="Proposal"
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
