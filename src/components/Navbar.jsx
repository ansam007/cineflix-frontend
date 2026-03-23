import React, { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, CreditCard, Settings, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Controls the dropdown visibility
  const [profileData, setProfileData] = useState(null); // Holds the user's email and plan
  
  const navigate = useNavigate();

  // 1. Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Fetch User Profile Data for the Dropdown
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/content/profile');
        setProfileData(res.data);
      } catch (error) {
        console.error("Could not fetch profile for navbar");
      }
    };
    // Only fetch if they are actually logged in
    if (localStorage.getItem('token')) {
      fetchProfile();
    }
  }, []);

  // 3. Helper to map MongoDB Plan IDs to readable text
  const getPlanName = (planId) => {
    if (!planId) return "Free Account";
    if (planId === '60d5ecb8b392d700153ee121') return "Basic";
    if (planId === '60d5ecb8b392d700153ee122') return "Standard";
    if (planId === '60d5ecb8b392d700153ee123') return "Premium";
    return "Subscriber";
  };

  // 4. Action Handlers
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  const handleCancelSubscription = async () => {
    // Add a safety check so they don't cancel by accident
    if (window.confirm("Are you sure you want to cancel? You will lose access to premium movies instantly.")) {
      try {
        const res = await axios.post('/content/cancel');
        // Secretly swap to the downgraded token
        localStorage.setItem('token', res.data.token);
        alert("Your subscription has been cancelled.");
        
        // Quick trick to force the React app to reload and show the Paywall again
        window.location.reload(); 
      } catch (error) {
        alert("Failed to cancel subscription.");
      }
    }
  };

  return (
    <nav className={`fixed w-full z-[110] transition-colors duration-300 ${isScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4 relative">
        
        {/* Left Side: Logo and Links */}
        <div className="flex items-center gap-8">
          <h1 onClick={() => navigate('/browse')} className="text-netflix-red text-3xl font-black cursor-pointer">CINEFLIX</h1>
          <ul className="hidden md:flex gap-4 text-sm text-gray-200">
            <li className="cursor-pointer text-white font-medium hover:text-gray-300">Home</li>
            <li className="cursor-pointer hover:text-gray-300 transition">TV Shows</li>
            <li className="cursor-pointer hover:text-gray-300 transition">Movies</li>
            <li className="cursor-pointer hover:text-gray-300 transition">New & Popular</li>
            <li className="cursor-pointer hover:text-gray-300 transition">My List</li>
          </ul>
        </div>

        {/* Right Side: Icons and Profile Dropdown */}
        <div className="flex items-center gap-6 text-white relative">
          <Search className="w-5 h-5 cursor-pointer" />
          <span className="hidden md:block text-sm cursor-pointer">Kids</span>
          <Bell className="w-5 h-5 cursor-pointer" />
          
          {/* The Profile Icon (Click to toggle menu) */}
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white transition"
          >
            <User className="w-5 h-5" />
          </div>

          {/* =========================================
              THE DROPDOWN MENU
              ========================================= */}
          {isProfileOpen && (
            <div className="absolute top-12 right-0 w-64 bg-black/90 border border-zinc-800 rounded-md shadow-2xl py-4 flex flex-col z-[120]">
              
              {/* User Info Header */}
              {profileData && (
                <div className="px-4 pb-4 border-b border-zinc-800 mb-2">
                  <p className="font-bold text-white truncate">{profileData.name}</p>
                  <p className="text-xs text-gray-400 truncate mb-2">{profileData.email}</p>
                  
                  {/* Badge showing current plan */}
                  <div className="inline-block bg-zinc-800 px-2 py-1 rounded text-xs font-bold text-netflix-red">
                    {getPlanName(profileData.planId)}
                  </div>
                </div>
              )}

              {/* Menu Links */}
              <button onClick={() => navigate('/plans')} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition">
                <CreditCard className="w-4 h-4" /> Change / Upgrade Plan
              </button>
              
              <button className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition">
                <Settings className="w-4 h-4" /> Account Settings
              </button>

              {/* Only show Cancel if they actually have a plan */}
              {profileData?.planId && (
                <button onClick={handleCancelSubscription} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-red-500 hover:bg-zinc-800 transition">
                  <XCircle className="w-4 h-4" /> Cancel Subscription
                </button>
              )}

              <div className="border-t border-zinc-800 mt-2 pt-2">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition">
                  <LogOut className="w-4 h-4" /> Sign out of Netflix
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;