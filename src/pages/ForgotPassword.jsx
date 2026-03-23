import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/auth/forgot-password", { email });

      // 🚨 ADD THIS LINE RIGHT HERE! Let's see what the backend actually sent.
      console.log("BACKEND SENT THIS:", res.data);

      if (res.data.token) {
        navigate(`/reset-password/${res.data.token}`);
      } else {
        setMessage("Backend didn't send a token! Check the console.");
      }
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative h-screen w-screen bg-[url('/netflix-bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center px-4">
        <h1
          className="absolute top-6 left-6 text-netflix-red text-4xl font-black cursor-pointer"
          onClick={() => navigate("/")}
        >
          CINEFLIX
        </h1>

        <div className="bg-black/80 p-12 rounded-md w-full max-w-[450px]">
          <h2 className="text-white text-3xl font-bold mb-4">
            Update Password
          </h2>
          <p className="text-gray-400 mb-8">
            Enter your email to receive a secure reset link.
          </p>

          {message && (
            <div className="bg-green-600/20 border border-green-500 p-3 rounded mb-4 text-green-400 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleResetRequest} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded bg-[#333] text-white outline-none focus:bg-[#444]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-netflix-red text-white p-3 rounded font-bold mt-4 hover:bg-red-700 transition"
            >
              {loading ? "Sending..." : "Email Me"}
            </button>
          </form>

          <p
            className="text-[#737373] mt-8 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Back to Sign In
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
