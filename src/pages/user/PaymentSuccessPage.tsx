import React, { useEffect } from 'react';

const PaymentSuccessPage = () => {

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-semibold text-green-600 text-center mb-6">Payment Successful</h1>
        <p className="text-lg text-gray-700 text-center mb-4">
          Thank you for your purchase! Your payment has been processed successfully.
        </p>
        <div className="bg-green-100 p-4 rounded-md text-center">
          <p className="text-gray-800">
            <strong>Session ID:</strong> {new URLSearchParams(window.location.search).get('session_id')}
          </p>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
