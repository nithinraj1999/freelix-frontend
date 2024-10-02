import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Menu
      </div>
      <ul className="mt-4 space-y-4">
        <li>
          <Link
            to="/dashboard"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/manage-gig"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Manage Gig
          </Link>
        </li>
        <li>
          <Link
            to="/your-bid"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Your Bid
          </Link>
        </li>
        <li>
          <Link
            to="/earnings"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Earnings
          </Link>
        </li>
        <li>
          <Link
            to="/manage-orders"
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
