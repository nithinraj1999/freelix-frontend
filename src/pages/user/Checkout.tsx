import React from 'react';
import { gotoCheckout } from '../../api/client/clientServices';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
    const location = useLocation();
    const bidAmount = location.state.bidAmount
    const jobId = location.state.jobId

    const freelancerId = location.state.freelancerId

    const bidId = location.state.bidId
    const userId = location.state.userId
      
    const makePayment = async()=>{
        const data = {
          bidAmount:bidAmount,
          jobId,
          freelancerId,
          bidId,
          userId
        }
        const response =await gotoCheckout(data)
      }
      
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Checkout</h2>

        {/* Order Summary */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="flex justify-between mt-2">
            <span>Freelancer Service</span>
            <span>${bidAmount}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Service Fee</span>
            <span>$20</span>
          </div>
          <div className="flex justify-between mt-2 font-bold">
            <span>Total</span>
            <span>$220</span>
          </div>
        </div>

        {/* Client Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Client Details</h3>
          <div className="mt-2">
            <label className="block text-gray-600 text-sm">Name</label>
            <input
              type="text"
              className="w-full border-gray-300 border rounded px-3 py-2 mt-1 focus:outline-none focus:border-indigo-500"
              placeholder="John Doe"
            />
          </div>
          <div className="mt-2">
            <label className="block text-gray-600 text-sm">Email</label>
            <input
              type="email"
              className="w-full border-gray-300 border rounded px-3 py-2 mt-1 focus:outline-none focus:border-indigo-500"
              placeholder="johndoe@example.com"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Payment Method</h3>
          <div className="flex items-center mt-2">
            <input
              type="radio"
              name="paymentMethod"
              className="mr-2"
              defaultChecked
            />
            <label className="text-gray-600">Credit Card</label>
          </div>
          <div className="flex items-center mt-2">
            <input type="radio" name="paymentMethod" className="mr-2" />
            <label className="text-gray-600">PayPal</label>
          </div>
        </div>

        {/* Confirm Payment Button */}
        <button className="w-full bg-black text-white py-2 rounded-lg  focus:outline-none" onClick={makePayment}>
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
