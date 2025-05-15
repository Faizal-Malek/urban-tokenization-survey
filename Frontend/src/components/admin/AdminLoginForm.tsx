
import { useState } from "react";
import { loginAdmin, LoginCredentials } from "@/utils/auth";

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
  title: string;
  description: string;
}

export const AdminLoginForm = ({ onLoginSuccess, title, description }: AdminLoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await loginAdmin({ username, password });
    
    setIsLoading(false);
    if (success) {
      onLoginSuccess();
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-[#FFF200] flex flex-col">
      {/* Modern Fixed Navigation Bar (no icon) */}
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-5xl bg-[#fffbe6]/90 rounded-xl shadow flex items-center justify-between px-8 py-4 border border-yellow-100">
        <span className="font-bold text-xl text-gray-900">Urban Infrastructure Tokenization Survey</span>
        <a href="/" className="bg-white px-5 py-2 rounded-md shadow text-black font-semibold hover:bg-gray-100 transition">
          Back to Main
        </a>
      </nav>
      {/* Centered Login Card */}
      <main className="flex-1 flex items-center justify-center mt-28">
        <div className="bg-white/95 rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
          <form onSubmit={handleLogin}>
            <label className="block text-gray-800 font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your username"
              disabled={isLoading}
            />
            <label className="block text-gray-800 font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 rounded transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};