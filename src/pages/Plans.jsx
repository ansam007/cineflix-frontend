import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Check } from "lucide-react";

const Plans = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // NEW: State to track which plan the user clicked. We default to the 'Standard' plan ID.
  const [selectedPlan, setSelectedPlan] = useState("60d5ecb8b392d700153ee122");

  const subscriptionPlans = [
    {
      id: "60d5ecb8b392d700153ee121",
      name: "Basic",
      price: "₹199",
      resolution: "720p",
      devices: "1",
      isPopular: false,
    },
    {
      id: "60d5ecb8b392d700153ee122",
      name: "Standard",
      price: "₹499",
      resolution: "1080p",
      devices: "2",
      isPopular: true,
    },
    {
      id: "60d5ecb8b392d700153ee123",
      name: "Premium",
      price: "₹649",
      resolution: "4K + HDR",
      devices: "4",
      isPopular: false,
    },
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // 1. Send the payment to the backend
      const response = await axios.post("/content/subscribe", {
        planId: selectedPlan,
      });

      // 2. Secretly swap out the old token for the new "Subscriber" token!
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // 3. Take them straight to the movies
      alert("✅ Payment successful! Welcome to Netflix Premium.");
      navigate("/browse");
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Something went wrong with the subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center pt-10 px-4 pb-20">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-12">
        <h1
          className="text-netflix-red text-4xl font-black cursor-pointer"
          onClick={() => navigate("/browse")}
        >
          CINEFLIX
        </h1>
        <button
          onClick={() => navigate("/browse")}
          className="text-xl font-medium hover:underline"
        >
          Cancel
        </button>
      </div>

      <div className="max-w-5xl w-full">
        <h2 className="text-3xl font-medium mb-2">
          Choose the plan that's right for you
        </h2>
        <ul className="mb-8 space-y-2 text-lg">
          <li className="flex items-center gap-2">
            <Check className="text-netflix-red w-6 h-6" /> Watch all you want.
            Ad-free.
          </li>
          <li className="flex items-center gap-2">
            <Check className="text-netflix-red w-6 h-6" /> Recommendations just
            for you.
          </li>
          <li className="flex items-center gap-2">
            <Check className="text-netflix-red w-6 h-6" /> Change or cancel your
            plan anytime.
          </li>
        </ul>

        {/* The Interactive Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {subscriptionPlans.map((plan) => {
            // Check if this specific card matches our selected state
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)} // This makes the whole card clickable!
                className={`border-2 rounded-xl p-6 flex flex-col relative cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-netflix-red shadow-2xl scale-105" // Highlighted styling
                    : "border-gray-300 hover:border-gray-400 opacity-80 hover:opacity-100" // Dimmed styling
                }`}
              >
                {plan.isPopular && (
                  <div
                    className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-bold transition-colors ${isSelected ? "bg-netflix-red text-white" : "bg-gray-500 text-white"}`}
                  >
                    Most Popular
                  </div>
                )}

                <h3
                  className={`text-2xl font-bold mb-4 ${isSelected ? "text-netflix-red" : "text-gray-700"}`}
                >
                  {plan.name}
                </h3>

                <p className="text-gray-500 mb-6">
                  Resolution:{" "}
                  <span
                    className={`font-bold ${isSelected ? "text-black" : "text-gray-600"}`}
                  >
                    {plan.resolution}
                  </span>
                </p>

                <div className="mt-auto mb-6">
                  <span
                    className={`text-4xl font-bold ${isSelected ? "text-black" : "text-gray-700"}`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>

                <p className="text-sm text-gray-500">
                  Watch on {plan.devices} supported devices at a time.
                </p>

                {/* Visual Checkmark to show it's selected */}
                {isSelected && (
                  <div className="absolute bottom-4 right-4 bg-netflix-red rounded-full p-1 text-white">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ONE Giant Subscribe Button at the bottom */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full max-w-md bg-netflix-red text-white py-4 rounded font-bold text-2xl hover:bg-red-700 transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : "Subscribe Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Plans;
