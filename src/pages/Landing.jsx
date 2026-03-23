import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import axios from '../api/axios'; // Bring in our API bridge

const Landing = () => {
  const [email, setEmail] = useState('');
  const [teasers, setTeasers] = useState([]); // State to hold the real database movies
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    // Passes the email they typed via React Router state!
    navigate('/register', { state: { email: email } }); 
  };

  // Fetch the teaser movies when the page loads
  useEffect(() => {
    const fetchTeasers = async () => {
      try {
        // Asking the backend for the public teasers
        const response = await axios.get('/content/teasers');
        const moviesArray = Array.isArray(response.data) ? response.data : response.data.data || [];
        setTeasers(moviesArray);
      } catch (error) {
        console.error("Error fetching teasers from database:", error);
      }
    };

    fetchTeasers();
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      
      {/* SECTION 1: THE MAIN HERO */}
      <div className="relative min-h-[85vh] w-full bg-[url('/netflix-bg.jpg')] bg-cover bg-center bg-no-repeat border-b-8 border-zinc-800">
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>

        <div className="relative z-10 h-full flex flex-col">
          <nav className="flex justify-between items-center p-6 md:px-12 md:py-8">
            <h1 className="text-netflix-red text-4xl md:text-5xl font-black tracking-tight">CINEFLIX</h1>
            <button 
              onClick={() => navigate('/login')}
              className="bg-netflix-red text-white px-4 py-1.5 md:px-6 md:py-2 rounded font-medium hover:bg-red-700 transition"
            >
              Sign In
            </button>
          </nav>

          <div className="flex-1 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto mt-10 md:mt-20 pb-20">
            <h1 className="text-white text-4xl md:text-6xl font-black mb-4 tracking-wide">
              Unlimited movies, TV shows and more
            </h1>
            <p className="text-white text-xl md:text-2xl font-medium mb-8">
              Watch anywhere. Cancel anytime.
            </p>
            <p className="text-white text-lg md:text-xl mb-4">
              Ready to watch? Enter your email to create or restart your membership.
            </p>

            <form onSubmit={handleGetStarted} className="flex flex-col md:flex-row gap-2 w-full max-w-2xl">
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-4 rounded bg-black/50 border border-gray-500 text-white focus:outline-none focus:border-white transition"
                required
              />
              <button 
                type="submit" 
                className="bg-netflix-red text-white text-xl md:text-2xl font-bold px-8 py-3 rounded flex items-center justify-center hover:bg-red-700 transition whitespace-nowrap"
              >
                Get Started <ChevronRight className="ml-2 w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE DYNAMIC TEASER CONTENT */}
      <div className="relative z-10 bg-black text-white py-16 px-4 md:px-12 lg:px-24 border-b-8 border-zinc-800">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">Trending Now</h2>
        <p className="text-gray-400 mb-8 text-center md:text-left text-lg">Sign in to unlock our full catalog of blockbuster movies.</p>
        
        {/* The Grid mapping over your REAL database movies */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {teasers.map((movie) => {
            // Formatting the image URL just like we did on the Home page
            const rawImage = movie.thumbnailUrl || movie.backdrop_path;
            const imageUrl = rawImage?.includes('http') 
              ? rawImage 
              : `https://image.tmdb.org/t/p/w500${rawImage}`;

            if (!rawImage) return null; // Skip if no image

            return (
              <div 
                key={movie._id} 
                onClick={() => navigate('/login')}
                className="cursor-pointer group relative overflow-hidden rounded-md transition-transform duration-300 hover:scale-105"
              >
                <img 
                  src={imageUrl} 
                  alt={movie.title} 
                  className="w-full h-auto object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-md">
                  <span className="font-bold text-sm md:text-base text-netflix-red text-center px-2">Sign in to watch</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Landing;