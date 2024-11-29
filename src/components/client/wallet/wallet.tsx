import React, { useState } from 'react';

const Wallet = () => {
  const [balance, setBalance] = useState<number>(100); // Assuming initial balance is 100

  const handleAddMoney = () => {
    
    const amountToAdd = prompt('Enter the amount to add to your wallet:');
    if (amountToAdd) {
      const amount = parseFloat(amountToAdd);
      if (!isNaN(amount) && amount > 0) {
        setBalance((prevBalance) => prevBalance + amount);
      } else {
        alert('Please enter a valid amount');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-lg mt-20">
      <h2 className="text-3xl font-semibold text-gray-800">Your Wallet</h2>

      {/* Wallet Balance Section */}
      <div className="mt-8 p-6 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700">Balance</h3>
        <p className="text-2xl font-bold text-green-600">${balance}</p>
      </div>

      {/* Add Money Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleAddMoney}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Money
        </button>
      </div>
    </div>
  );
};

export default Wallet;
