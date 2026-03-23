import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Connects to your backend Login route
      const response = await axios.post("/auth/login", { email, password });

      // Save the VIP wristband to the browser
      localStorage.setItem("token", response.data.token);

      // Send them to the Home/Browse page
      navigate("/browse");
    } catch (err) {
      // Catch any wrong password/email errors from the backend Bouncer
      setError(
        err.response?.data?.message ||
          "Failed to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[url('/netflix-bg.jpg')] bg-cover bg-no-repeat bg-center">
      <div className="absolute inset-0 bg-black/60 flex flex-col">
        {/* Logo Header */}
        <nav className="p-6 md:p-8">
          <h1
            className="text-netflix-red text-4xl md:text-5xl font-black tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            CINEFLIX
          </h1>
        </nav>

        {/* Login Form Container */}
        <div className="flex flex-1 justify-center items-center px-4">
          <div className="bg-black/80 p-12 md:p-16 rounded-md w-full max-w-[450px]">
            <h2 className="text-white text-3xl font-bold mb-8">Sign In</h2>

            {/* Error Message Box */}
            {error && (
              <div className="bg-netflix-red p-3 rounded mb-4 text-white text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded bg-[#333] text-white outline-none focus:bg-[#444] border border-transparent focus:border-white transition"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded bg-[#333] text-white outline-none focus:bg-[#444] border border-transparent focus:border-white transition"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-netflix-red text-white p-3 rounded font-bold mt-6 hover:bg-red-700 transition"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* 🚨 THE MISSING LINK: This takes them to the Register page! */}
            <p className="text-[#737373] mt-8">
              New to Netflix?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-white cursor-pointer hover:underline font-medium"
              >
                Sign up now.
              </span>
            </p>

            <p
              className="text-gray-400 text-sm text-center mt-4 cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot your password?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
