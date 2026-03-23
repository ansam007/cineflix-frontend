import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // This hook grabs the actual ticket string out of the browser URL!
  const { token } = useParams(); 
  const navigate = useNavigate();

  const handleNewPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 1000); // Send them to login after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Link expired or invalid.");
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[url('/netflix-bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center px-4">
        <h1 className="absolute top-6 left-6 text-netflix-red text-4xl font-black cursor-pointer" onClick={() => navigate('/')}>NETFLIX</h1>
        
        <div className="bg-black/80 p-12 rounded-md w-full max-w-[450px]">
          <h2 className="text-white text-3xl font-bold mb-8">Create New Password</h2>
          
          {message && <div className="bg-green-600/20 border border-green-500 p-3 rounded mb-4 text-green-400 text-sm">{message}</div>}
          {error && <div className="bg-netflix-red p-3 rounded mb-4 text-white text-sm">{error}</div>}

          <form onSubmit={handleNewPassword} className="flex flex-col gap-4">
            <input 
              type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded bg-[#333] text-white outline-none focus:bg-[#444]" required
            />
            <button type="submit" className="bg-netflix-red text-white p-3 rounded font-bold mt-4 hover:bg-red-700 transition">
              Save & Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;