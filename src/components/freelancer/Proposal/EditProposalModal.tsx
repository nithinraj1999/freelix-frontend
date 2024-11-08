
// import React, { useState } from "react";
// import { editMyBid } from "../../../api/freelancer/freelancerServices";
// import { z } from "zod"; // For validation error handling

// import { editBidSchema } from "../../../utils/validation";

// interface Bid {
//   _id: string;
//   bidAmount: number;
//   deliveryDays: number;
//   proposal: string;
//   status:string;
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
//   setMyBid: (bid: Bid) => void;
//   bid: {
//     _id: string;
//     bidAmount: string;
//     deliveryDays: string;
//     proposal: string;
//   } | null;
  
// }


// const EditProposalModal: React.FC<EditProposalModalProps> = ({
//   isOpen,
//   onClose,
//   bid,
//   setMyBid
// }) => {
//   const [bidAmount, setBidAmount] = useState(bid?.bidAmount || "0");
//   const [deliveryDays, setDeliveryDays] = useState(bid?.deliveryDays || "0");
//   const [proposal, setProposal] = useState(bid?.proposal || "");
//   const [errors, setErrors] = useState({ bidAmount: "", deliveryDays: "", proposal: "" });

//   if (!isOpen || !bid) return null;
  

//   const validate = () => {
    
//     type ErrorsState = {
//       bidAmount: string;
//       deliveryDays: string;
//       proposal: string;
//     };
    
//     try {
//       // Reset errors
//       setErrors({ bidAmount: "", deliveryDays: "", proposal: "" });
  
//       // Validate data
//       editBidSchema.parse({ bidAmount, deliveryDays, proposal });
//       return true; // Validation successful
//     } catch (err) {
//       // Check if the error is a ZodError
//       if (err instanceof z.ZodError) {
//         const newErrors: ErrorsState = {
//           bidAmount: "",
//           deliveryDays: "",
//           proposal: "",
//         };
//         err.errors.forEach((error: z.ZodIssue) => {
//           newErrors[error.path[0] as keyof ErrorsState] = error.message;
//         });
//         setErrors(newErrors);
//       }
//       return false; // Validation failed
//     }
//   };


//   const handleSave = async() => {

//     if(!validate()){
//       return
//     }
//     const data: Partial<typeof bid> = {};
//         data._id =bid._id
//     if (bidAmount !== bid.bidAmount) {
//         data.bidAmount = bidAmount;
//       }
//       if (deliveryDays !== bid.deliveryDays) {
//         data.deliveryDays = deliveryDays;
//       }
//       if (proposal !== bid.proposal) {
//         data.proposal = proposal;
//       }
    
//       // Only call the API if there is changed data
//       if (Object.keys(data).length > 0) {
//         const editResponse = await editMyBid(data);
//         console.log("edited...",editResponse.editedBid);
//         window.location.reload()
//         setMyBid(editResponse.editedBid)
        
//       }
       
//       onClose();
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
//             type="number"
//             value={bidAmount}
//             onChange={(e) => setBidAmount(e.target.value)}
//             className="w-full border p-2 rounded mt-1"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Delivery Days
//           </label>
//           <input
//             type="number"
//             value={deliveryDays}
//             onChange={(e) => setDeliveryDays(e.target.value)}
//             className="w-full border p-2 rounded mt-1"
//           />
          
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Proposal
//           </label>
//           <textarea
//             value={proposal}
//             onChange={(e) => setProposal(e.target.value)}
//             className="w-full border p-2 rounded mt-1"
//           ></textarea>
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
import { z } from "zod"; // For validation error handling
import { editBidSchema } from "../../../utils/validation";

interface Bid {
  _id: string;
  bidAmount: string; // Ensure these are strings
  deliveryDays: string; // Ensure these are strings
  proposal: string;
  status: string;
  freelancerId: {
    _id: string;
    name: string;
    profilePicture: string;
    title: string;
  };
}

interface EditProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  // setMyBid: (bid: Bid) => void;
  bid: {
    _id: string;
    bidAmount: string; // Ensure these are strings
    deliveryDays: string; // Ensure these are strings
    proposal: string;
  } | null;
}

const EditProposalModal: React.FC<EditProposalModalProps> = ({
  isOpen,
  onClose,
  bid,
  // setMyBid,
}) => {
  const [bidAmount, setBidAmount] = useState(bid?.bidAmount || "0");
  const [deliveryDays, setDeliveryDays] = useState(bid?.deliveryDays || "0");
  const [proposal, setProposal] = useState(bid?.proposal || "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    bidAmount: "",
    deliveryDays: "",
    proposal: "",
  });

  const [isBidAmountChanged, setIsBidAmountChanged] = useState(false);
  const [isDeliveryDaysChanged, setIsDeliveryDaysChanged] = useState(false);
  const [isProposalChanged, setIsProposalChanged] = useState(false);

  if (!isOpen || !bid) return null;

  const validate = () => {
    const newErrors = { bidAmount: "", deliveryDays: "", proposal: "" };

    // Validate only if the field was changed
    if (isBidAmountChanged) {
      try {
        editBidSchema.parse({ bidAmount, deliveryDays, proposal });
      } catch (err) {
        if (err instanceof z.ZodError) {
          newErrors.bidAmount = err.errors.find(e => e.path[0] === 'bidAmount')?.message || "";
        }
      }
    }

    if (isDeliveryDaysChanged) {
      try {
        editBidSchema.parse({ bidAmount, deliveryDays, proposal });
      } catch (err) {
        if (err instanceof z.ZodError) {
          newErrors.deliveryDays = err.errors.find(e => e.path[0] === 'deliveryDays')?.message || "";
        }
      }
    }

    if (isProposalChanged) {
      try {
        editBidSchema.parse({ bidAmount, deliveryDays, proposal });
      } catch (err) {
        if (err instanceof z.ZodError) {
          newErrors.proposal = err.errors.find(e => e.path[0] === 'proposal')?.message || "";
        }
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error); // Returns true if no errors
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const data: Partial<typeof bid> = { _id: bid._id };

    // Ensure we send strings
    data.bidAmount = bidAmount; 
    data.deliveryDays = deliveryDays;
    data.proposal = proposal;

    // Only include if they have changed
    if (bidAmount !== bid.bidAmount || deliveryDays !== bid.deliveryDays || proposal !== bid.proposal) {
      const editResponse = await editMyBid(data);
      if(editResponse){
        console.log("edited...", editResponse.editedBid);

        window.location.reload();
        // setMyBid(editResponse.editedBid);
      }
      
      
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
            type="text" // Keep as text to allow string input
            value={bidAmount}
            onChange={(e) => {
              setBidAmount(e.target.value);
              setIsBidAmountChanged(true); // Mark field as changed
            }} 
            className="w-full border p-2 rounded mt-1"
          />
          {errors.bidAmount && <p className="text-red-500 text-sm">{errors.bidAmount}</p>} {/* Display error message */}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Delivery Days
          </label>
          <input
            type="text" // Keep as text to allow string input
            value={deliveryDays}
            onChange={(e) => {
              setDeliveryDays(e.target.value);
              setIsDeliveryDaysChanged(true); // Mark field as changed
            }} 
            className="w-full border p-2 rounded mt-1"
          />
          {errors.deliveryDays && <p className="text-red-500 text-sm">{errors.deliveryDays}</p>} {/* Display error message */}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Proposal
          </label>
          <textarea
            value={proposal}
            onChange={(e) => {
              setProposal(e.target.value);
              setIsProposalChanged(true); // Mark field as changed
            }} 
            className="w-full border p-2 rounded mt-1"
          ></textarea>
          {errors.proposal && <p className="text-red-500 text-sm">{errors.proposal}</p>} {/* Display error message */}
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
