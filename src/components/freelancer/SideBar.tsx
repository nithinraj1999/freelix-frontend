import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white md:pl-16">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Menu
      </div>
      <ul className="mt-4 space-y-4">
        <li>
          <Link
            to="/freelancer"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </Link>
        </li>
       
        <li>
          <Link
            to="/freelancer/your-bids"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Your Bid
          </Link>
        </li>
        <li>
          <Link
            to="/freelancer/wallet"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Wallet
          </Link>
        </li>
        <li>
          <Link
            to="/freelancer/your-orders"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Manage Orders
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
