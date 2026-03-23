import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios'; 

const Register = () => {
  const location = useLocation();
  const initialEmail = location.state?.email || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // This state holds your backend error message
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear any old errors when they try again
    setLoading(true);

    try {
      await axios.post('/auth/register', { name, email, password });
      
      alert("✅ Account created successfully! Please log in.");
      navigate('/login');
    } catch (err) {
      // 🚨 Here is where we catch your backend duplicate email message!
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[url('/netflix-bg.jpg')] bg-cover bg-no-repeat bg-center">
      <div className="absolute inset-0 bg-black/60 flex flex-col">
        
        <nav className="p-6 md:p-8">
          <h1 className="text-netflix-red text-4xl md:text-5xl font-black tracking-tight cursor-pointer" onClick={() => navigate('/')}>
            CINEFLIX
          </h1>
        </nav>
        
        <div className="flex flex-1 justify-center items-center px-4">
          <div className="bg-black/80 p-12 md:p-16 rounded-md w-full max-w-[450px]">
            <h2 className="text-white text-3xl font-bold mb-8">Sign Up</h2>
            
            {/* 🚨 Here is where the error paints onto the screen in a red box */}
            {error && <div className="bg-netflix-red p-3 rounded mb-4 text-white text-sm font-medium">{error}</div>}

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded bg-[#333] text-white outline-none focus:bg-[#444] border border-transparent focus:border-white"
                required
              />
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded bg-[#333] text-white outline-none focus:bg-[#444] border border-transparent focus:border-white"
                required
              />
              <input 
                type="password" 
                placeholder="Create a Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded bg-[#333] text-white outline-none focus:bg-[#444] border border-transparent focus:border-white"
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-netflix-red text-white p-3 rounded font-bold mt-6 hover:bg-red-700 transition"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            
            <p className="text-[#737373] mt-8">
              Already have an account? <span onClick={() => navigate('/login')} className="text-white cursor-pointer hover:underline font-medium">Sign in now.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;