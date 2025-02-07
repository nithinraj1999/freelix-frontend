import React, { useState } from 'react';
import { completeOrder } from '../../../api/freelancer/freelancerServices';
import Swal from 'sweetalert2';
import { completeOrderSchema } from '../../../utils/validation';
import { z } from "zod";

interface OrderDetailsProps {
  onClose: () => void;
  order: any;
}
interface OrderDetailsProps {
  onClose: () => void;
  order: any;
  updateOrderStatus: (orderId: string, newStatus: string) => void; // Added this prop
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ onClose, order, updateOrderStatus }) => {
  const [isCompleteOrderModalOpen, setIsCompleteOrderModalOpen] = useState(false);
  const [deliveryDescription, setDeliveryDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const openCompleteOrderModal = () => {
    setErrors({})
    setIsCompleteOrderModalOpen(true);
  };

  const closeCompleteOrderModal = () => {
    setIsCompleteOrderModalOpen(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteOrder = async () => {
    try {

      completeOrderSchema.parse({
        description: deliveryDescription,
        file: selectedFile,
      });
      setIsLoading(true);

      const formData = new FormData();
      formData.append('orderId', order._id);
      formData.append('description', deliveryDescription);
      formData.append('file', selectedFile);

      const response = await completeOrder(formData);

      if (response.success) {
        setIsLoading(false);

        Swal.fire({
          icon: 'success',
          title: 'Order Completed!',
          text: 'Your order has been successfully completed.',
          confirmButtonText: 'OK',
        });

        updateOrderStatus(order._id, 'Completed');

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong. Please try again.',
          confirmButtonText: 'OK',
        });
      }

      closeCompleteOrderModal();
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Capture Zod validation errors
        const formattedErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors); // Display errors
      } else {
        // Handle other errors (like network errors)
        console.error('Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please try again later.',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg relative">
          <button className="absolute top-2 right-2 text-gray-700 hover:text-gray-900" onClick={onClose}>
            X
          </button>
          <h2 className="text-2xl font-semibold mb-4">Order Details</h2>

          <div className="flex items-center mb-4">
            <p className="text-xl font-semibold">{order.projectId.title}</p>
          </div>

          <p className="font-medium text-gray-800">Project Description:</p>
         
          <div className="line-clamp-3 text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: order.projectId.description }} />

          <p className="font-medium text-gray-800">Status:</p>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
            }`}
          >
            {order.status}
          </span>

          <p className="font-medium text-gray-800 mt-4">Order Date:</p>
          <p className="text-gray-600">{formatDate(order.orderDate)}</p>

          <p className="font-medium text-gray-800 mt-4">Total Price:</p>
          <p className="text-gray-600">$ {order.total}</p>

          <div className="mt-4 flex justify-between">
            <button onClick={openCompleteOrderModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Complete Order
            </button>
            <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg">
              Close
            </button>
          </div>
        </div>
      </div>

      {isCompleteOrderModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4">Complete Order</h3>

      {/* Delivery Description Textarea */}
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Enter delivery description"
        value={deliveryDescription}
        onChange={(e) => setDeliveryDescription(e.target.value)}
      />
      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

      {/* File Input */}
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
        className="mb-4"
      />
      {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}

      {/* Buttons */}
      <div className="flex justify-between">
        <button
      onClick={handleCompleteOrder}
      disabled={isLoading}
      className="bg-green-600 text-white px-4 py-2 rounded-lg"
    >
      {isLoading ? (
        <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-white rounded-full"></span>
      ) : (
        'Complete'
      )}
    </button>
        <button onClick={closeCompleteOrderModal} className="bg-gray-400 text-white px-4 py-2 rounded-lg">
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default OrderDetails;
