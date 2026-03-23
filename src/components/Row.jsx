import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; // 🚨 1. IMPORT THE TELEPORTER
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ChevronLeft, ChevronRight, X, Lock } from 'lucide-react'; 

const Row = ({ title, fetchUrl, isLargeRow = false }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [userRole, setUserRole] = useState('free_user');
  const [userPlan, setUserPlan] = useState(null);
  
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(fetchUrl);
        const moviesArray = Array.isArray(response.data) ? response.data : response.data.movies || response.data.data || [];
        setMovies(moviesArray);
      } catch (error) {
        console.error(`Error fetching row ${title}:`, error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (error) {
        console.error("Could not read token data");
      }

      axios.get('/content/profile').then(res => {
        if (res.data.planId) {
          const plans = [
            { id: '60d5ecb8b392d700153ee121', name: 'Basic', resolution: '720p HD', devices: '1 Device' },
            { id: '60d5ecb8b392d700153ee122', name: 'Standard', resolution: '1080p Full HD', devices: '2 Devices' },
            { id: '60d5ecb8b392d700153ee123', name: 'Premium', resolution: '4K Ultra HD + HDR', devices: '4 Devices' }
          ];
          setUserPlan(plans.find(p => p.id === res.data.planId));
        }
      }).catch(err => console.error(err));
    }

    fetchData();
  }, [fetchUrl]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    if (userRole === 'subscriber' || userRole === 'admin') {
      setShowPlayer(true); 
    } else {
      setShowPaywall(true); 
    }
  };

  const slide = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* =========================================
          2. THE PORTALS (Teleported to document.body)
          ========================================= */}
      
      {/* PAYWALL PORTAL */}
      {showPaywall && selectedMovie && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
          <div className="bg-zinc-900 p-8 md:p-12 rounded-lg max-w-lg w-full text-center border border-zinc-700 shadow-2xl relative">
            <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition duration-300">
              <X className="w-8 h-8" />
            </button>
            <div className="flex justify-center mb-6">
              <div className="bg-netflix-red/20 p-4 rounded-full"><Lock className="w-12 h-12 text-netflix-red" /></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Watch</h2>
            <p className="text-gray-400 mb-8">
              Your free account lets you browse the catalog, but you need an active subscription to stream {selectedMovie.title}.
            </p>
            <button 
              onClick={() => navigate('/plans')} 
              className="w-full bg-netflix-red text-white font-bold py-4 rounded hover:bg-red-700 transition text-lg"
            >
              View Subscription Plans
            </button>
          </div>
        </div>,
        document.body // Teleports this HTML straight to the root of the page!
      )}

      {/* VIDEO PLAYER PORTAL */}
      {showPlayer && selectedMovie && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
          
          {/* Close button safely out of Navbar's reach */}
          <button onClick={() => setShowPlayer(false)} className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-netflix-red transition duration-300 z-[10000]">
            <X className="w-12 h-12" />
          </button>
          
          <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-zinc-800 relative">
            {userPlan && (
              <div className="absolute top-4 left-4 z-[10000] bg-black/70 px-4 py-2 rounded border border-gray-600 backdrop-blur-sm flex items-center gap-3 shadow-lg pointer-events-none">
                <span className="text-netflix-red font-black tracking-wider uppercase">{userPlan.name}</span>
                <span className="text-gray-200 text-sm font-medium border-l border-gray-500 pl-3">{userPlan.resolution}</span>
                <span className="text-gray-200 text-sm font-medium border-l border-gray-500 pl-3">{userPlan.devices}</span>
              </div>
            )}
            <iframe
              src={selectedMovie?.videoUrl ? `${selectedMovie.videoUrl}?autoplay=1` : "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"}
              title="Movie Player"
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          </div>
        </div>,
        document.body // Teleports this HTML straight to the root of the page!
      )}

      {/* =========================================
          THE SCROLLING ROW (Stays exactly where it is)
          ========================================= */}
      <div className="text-white ml-4 md:ml-12 mt-8 mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
        
        <div className="relative group">
          <div onClick={() => slide('left')} className="absolute top-0 bottom-0 left-0 z-40 m-auto h-full w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition duration-300 hover:bg-black/80 rounded-l-md">
            <ChevronLeft className="w-8 h-8 text-white" />
          </div>

          <div ref={sliderRef} className="flex overflow-x-scroll scrollbar-hide gap-4 py-4 pr-12 scroll-smooth">
            {movies.map((movie) => {
              const rawImage = movie.thumbnailUrl || movie.backdrop_path;
              const imageUrl = rawImage?.includes('http') ? rawImage : `https://image.tmdb.org/t/p/w500${rawImage}`;
              if (!rawImage) return null;

              return (
                <img
                  key={movie._id}
                  src={imageUrl}
                  alt={movie.title}
                  onClick={() => handleMovieClick(movie)} 
                  className={`object-cover rounded-md transition-transform duration-300 hover:scale-105 cursor-pointer flex-none ${
                    isLargeRow ? "h-64 md:h-80 w-auto" : "h-32 md:h-44 w-auto"
                  }`}
                />
              );
            })}
          </div>

          <div onClick={() => slide('right')} className="absolute top-0 bottom-0 right-0 z-40 m-auto h-full w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition duration-300 hover:bg-black/80 rounded-r-md">
            <ChevronRight className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Row;