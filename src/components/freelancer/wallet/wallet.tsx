import React, { useState, useEffect } from 'react';
import { fetchWalletInfo } from '../../../api/freelancer/freelancerServices';
import { RootState } from '../../../state/store';
import { useSelector } from 'react-redux';

const Wallet = () => {
  const [balance, setBalance] = useState<any>(0); // Balance state with any type
  const [transactions, setTransactions] = useState<any[]>([]); // Transactions state
  const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store
  // const transactions = [
  //   { id: 1, date: '2024-11-01', amount: 100, type: 'Credit', description: 'Credit Payment' },
  //   { id: 2, date: '2024-11-05', amount: -50, type: 'Debit', description: 'Debit Payment' },
  //   { id: 3, date: '2024-11-10', amount: 200, type: 'Credit', description: 'Credit Payment' },
  //   { id: 4, date: '2024-11-15', amount: -75, type: 'Debit', description: 'Debit Payment' },
  // ];
  
  useEffect(() => {
    async function getWallet() {
      if (user?._id) {
        const data = {
          freelancerId: user?._id,
        };
        try {
          const response = await fetchWalletInfo(data);
          if (response.wallet) {
            console.log(response); // Log wallet info for debugging
            setBalance(response.wallet.balance);
            setTransactions(response.wallet.walletHistory)
            // Add dummy transaction data
           
          }
        } catch (error) {
          console.error('Error fetching wallet info:', error);
        }
      }
    }
    getWallet();
  }, [user]);

  return (
    <div className="mx-auto p-6 bg-white w-full shadow-lg rounded-lg mt-28">
      <h2 className="text-2xl font-semibold text-gray-800">Wallet</h2>
      
      {/* Wallet Balance Section */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700">Balance:</h3>
        <p className="text-2xl font-bold text-green-600">
          ${balance !== null ? balance : 'Loading...'}
        </p>
      </div>

      {/* Transaction History Section */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700">Transaction History:</h3>
        <div className="mt-4">
          {transactions.length === 0 ? (
            <p className="text-gray-600">No transactions available.</p>
          ) : (
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.id} className="flex justify-between py-2 border-b">
                  <div className="flex flex-col">
                    <span className="text-gray-700 font-semibold">{transaction.description}</span>
                    <span className="text-sm text-gray-500">{transaction.date}</span>
                  </div>
                  <div className={`text-sm font-semibold ${transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'Credit' ? '+' : '-'}${Math.abs(transaction.amount)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
