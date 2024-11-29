import React, { useState } from 'react'
import { forgetPassword } from '../api/client/clientServices'

const ForgetPassword = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
        email:email
    }
    console.log(email);
    
    const response = await forgetPassword(data)
    console.log(response);
    
    setIsSubmitted(true)
  }

  return ( 
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">A password reset link has been sent to your email address.</p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-blue-500 hover:underline"
            >
              Go back to login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgetPassword
