import React, { useEffect, useState } from "react";
import { Play, Info, X, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [userRole, setUserRole] = useState("free_user");

  // NEW: State to hold the specific features they paid for
  const [userPlan, setUserPlan] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch (error) {
        console.error("Could not read token data");
      }
    }

    // NEW: Fetch the user's profile to see exactly which plan they bought
    const fetchProfileData = async () => {
      if (token) {
        try {
          const res = await axios.get("/content/profile");
          const dbUser = res.data;

          if (dbUser.planId) {
            // We map their database ID to the features we promised them on the Plans page
            const plans = [
              {
                id: "60d5ecb8b392d700153ee121",
                name: "Basic",
                resolution: "720p HD",
                devices: "1 Device",
              },
              {
                id: "60d5ecb8b392d700153ee122",
                name: "Standard",
                resolution: "1080p Full HD",
                devices: "2 Devices",
              },
              {
                id: "60d5ecb8b392d700153ee123",
                name: "Premium",
                resolution: "4K Ultra HD + HDR",
                devices: "4 Devices",
              },
            ];
            const myPlan = plans.find((p) => p.id === dbUser.planId);
            setUserPlan(myPlan);
          }
        } catch (error) {
          console.error("Could not fetch user profile details.");
        }
      }
    };

    const fetchRandomMovie = async () => {
      try {
        const response = await axios.get("/content/movies");
        const moviesArray = Array.isArray(response.data)
          ? response.data
          : response.data.movies || response.data.data || [];
        if (moviesArray.length > 0) {
          const randomSelection =
            moviesArray[Math.floor(Math.random() * moviesArray.length)];
          setMovie(randomSelection);
        }
      } catch (error) {
        console.error("Failed to fetch movie from backend:", error);
      }
    };

    fetchProfileData();
    fetchRandomMovie();
  }, []);

  const handlePlayClick = () => {
    if (userRole === "subscriber" || userRole === "admin") {
      setShowPlayer(true);
    } else {
      setShowPaywall(true);
    }
  };

  const displayMovie = movie || {
    title: "Loading...",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
  };
  const rawImage = displayMovie?.thumbnailUrl || displayMovie?.backdrop_path;
  const imageUrl = rawImage?.includes("http")
    ? rawImage
    : `https://image.tmdb.org/t/p/original${rawImage}`;
  const truncate = (str, n) =>
    str?.length > n ? str.substring(0, n - 1) + "..." : str;

  return (
    <>
      {/* 1. THE PAYWALL */}
      {showPaywall && (
        // Changed z-[100] to z-[120]
        <div className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4">
          <div className="bg-zinc-900 p-8 md:p-12 rounded-lg max-w-lg w-full text-center border border-zinc-700 shadow-2xl relative">
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex justify-center mb-6">
              <div className="bg-netflix-red/20 p-4 rounded-full">
                <Lock className="w-12 h-12 text-netflix-red" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Subscribe to Watch
            </h2>
            <p className="text-gray-400 mb-8">
              Your free account lets you browse the catalog, but you need an
              active subscription to stream {displayMovie.title}.
            </p>
            <button
              onClick={() => navigate("/plans")}
              className="w-full bg-netflix-red text-white font-bold py-4 rounded hover:bg-red-700 transition text-lg"
            >
              View Subscription Plans
            </button>
          </div>
        </div>
      )}

      {/* 2. THE VIDEO PLAYER WITH FEATURE BADGE */}
      {showPlayer && (
        // Changed z-[100] to z-[120]
        <div className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4">
          {/* Changed z-[101] to z-[130] and adjusted top margin so it's easier to click */}
          <button
            onClick={() => setShowPlayer(false)}
            className="absolute top-8 right-8 md:top-12 md:right-12 text-white hover:text-netflix-red transition duration-300 z-[130]"
          >
            <X className="w-10 h-10" />
          </button>

          <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-zinc-800 relative">
            {/* 🚨 THE UPGRADE: The Dynamic Feature Badge! */}
            {userPlan && (
              <div className="absolute top-4 left-4 z-[102] bg-black/70 px-4 py-2 rounded border border-gray-600 backdrop-blur-sm flex items-center gap-3 shadow-lg pointer-events-none">
                <span className="text-netflix-red font-black tracking-wider uppercase">
                  {userPlan.name}
                </span>
                <span className="text-gray-200 text-sm font-medium border-l border-gray-500 pl-3">
                  {userPlan.resolution}
                </span>
                <span className="text-gray-200 text-sm font-medium border-l border-gray-500 pl-3">
                  {userPlan.devices}
                </span>
              </div>
            )}

            <iframe
              src={
                displayMovie?.videoUrl
                  ? `${displayMovie.videoUrl}?autoplay=1`
                  : "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              }
              title="Movie Player"
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* 3. THE HERO SECTION */}
      <div className="relative w-full h-[70vh] md:h-[800px] text-white">
        <div className="absolute w-full h-full">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={displayMovie.title}
              className="w-full h-full object-cover object-top transition-opacity duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent"></div>
        </div>

        <div className="absolute w-full top-[30%] md:top-[35%] p-8 md:p-16 z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-4 w-full md:max-w-[70%] drop-shadow-lg">
            {displayMovie?.title}
          </h1>
          <p className="w-full md:max-w-[60%] lg:max-w-[45%] text-gray-200 text-lg md:text-xl drop-shadow-md mb-8 leading-relaxed">
            {truncate(displayMovie?.description, 150)}
          </p>

          <div className="flex gap-4">
            <button
              onClick={handlePlayClick}
              className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-white/80 transition shadow-lg"
            >
              <Play className="w-6 h-6 fill-black" /> Play
            </button>
            <button className="flex items-center gap-2 bg-gray-500/70 text-white px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-gray-500/90 transition shadow-lg">
              <Info className="w-6 h-6" /> More Info
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
