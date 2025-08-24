import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Check your email for a reset link.');
    } catch {
      setMessage('Error sending reset email.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#FFF200] flex flex-col">
      <main className="flex-1 flex items-center justify-center mt-28">
        <div className="bg-white/95 rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
          <p className="text-gray-600 mb-6">Enter the email associated with your account.</p>
          <form onSubmit={submit}>
            <label className="block text-gray-800 font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="you@example.com"
            />
            <button className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 rounded">
              Send Reset Link
            </button>
          </form>
          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </div>
      </main>
    </div>
  );
}