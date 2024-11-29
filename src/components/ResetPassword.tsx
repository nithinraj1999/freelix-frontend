import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { resetPassword } from '../api/client/clientServices';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const location = useLocation();

  // Function to get query parameters from the URL
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const res = params.get('userId');
    return res;
  };

  // Password validation function
  const validatePassword = (password: string) => {
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    return passwordPattern.test(password);
  };

  // Password empty or space validation function
  const validateEmptyOrSpace = (password: string) => {
    return password.trim().length > 0 && !password.includes(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(''); // Clear previous error

    // Check if password is empty or contains spaces
    if (!validateEmptyOrSpace(password)) {
      setPasswordError('Password cannot be empty or contain spaces');
      return;
    }

    // Validate password format
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long, contain one letter, one number, and one special character');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    const params = getQueryParams();
    const data = {
      params,
      password,
      confirmPassword,
    };

    const response = await resetPassword(data);

    // Handle the response accordingly
    console.log(response);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit} noValidate> {/* Add noValidate here */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded-md"
            placeholder="Enter new password"
          />
          {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border rounded-md"
            placeholder="Confirm new password"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
