import React, { useState } from 'react';
import axios from 'axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/reset-password', { token, password });
      setMessage('Password reset successful. You can now log in.');
    } catch {
      setMessage('Reset failed. Token may be invalid or expired.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#FFF200] flex flex-col">
      <main className="flex-1 flex items-center justify-center mt-28">
        <div className="bg-white/95 rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <form onSubmit={submit}>
            <label className="block text-gray-800 font-medium mb-1">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter new password"
            />
            <button className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 rounded">
              Reset Password
            </button>
          </form>
          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </div>
      </main>
    </div>
  );
}