import React from 'react';
import { gotoCheckout } from '../../api/client/clientServices';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
const Checkout = () => {
    const location = useLocation();
    const bidAmount = location.state.bidAmount
    const jobId = location.state.jobId
    const { user } = useSelector((state: RootState) => state.user);

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
            <span>${bidAmount -bidAmount *.30}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Service Fee</span>
            <span>${bidAmount *.30}</span>
          </div>
          <div className="flex justify-between mt-2 font-bold">
            <span>Total</span>
            <span>$ {bidAmount}</span>
          </div>
        </div>

        {/* Client Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Client Details</h3>
          <div className="mt-2">
            <label className="block text-gray-600 text-sm">Name</label>
            <p>{user?.name}</p>
          </div>
          <div className="mt-2">
            <label className="block text-gray-600 text-sm">Email</label>
            <p>{user?.email}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Payment Method</h3>
         
          <div className="flex items-center mt-2">
            <input type="radio" name="paymentMethod" className="mr-2" />
            <label className="text-gray-600">Stripe</label>
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
