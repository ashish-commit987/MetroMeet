import { useState, useEffect } from "react";
import axios from "axios";
import stations from "../dmrc-stations.json";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { StationSelect } from "@/modules/shared/components/StationSelect";
import { MapPin, Clock, Users, Train, ArrowRight, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { useToast, ToastContainer } from "@/modules/shared/components/Toast";

const FindRides = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [waitWindow, setWaitWindow] = useState(30);
  const [minTime, setMinTime] = useState("");
  const { toasts, addToast, removeToast } = useToast();

  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (departureDate === today) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setMinTime(`${hours}:${minutes}`);
      
      if (departureTime) {
        const [selectedHours, selectedMinutes] = departureTime.split(':');
        const selectedTimeInMinutes = parseInt(selectedHours) * 60 + parseInt(selectedMinutes);
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        
        if (selectedTimeInMinutes < currentTimeInMinutes) {
          setDepartureTime("");
        }
      }
    } else {
      setMinTime("");
    }
  }, [departureDate, today, departureTime]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSubmit = async () => {
    if (!source || !destination) {
      addToast("Please choose both source and destination", "error");
      return;
    }

    if (!departureDate) {
      addToast("Please select departure date", "error");
      return;
    }

    if (!departureTime) {
      addToast("Please select departure time", "error");
      return;
    }

    const selectedDateTime = new Date(`${departureDate}T${departureTime}:00`);
    const now = new Date();
    
    if (selectedDateTime < now) {
      addToast("Cannot select past date and time. Please choose a future time.", "error");
      return;
    }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      addToast("Please login first", "error");
      navigate("/login");
      return;
    }

    try {
      const fullDateTime = `${departureDate}T${departureTime}:00`;

      await axios.put('/api/v1/travel/update', {
        userId,
        source,
        destination,
        departureTime: fullDateTime,
        waitWindow
      }, {
        headers: {
          'Authorization': token
        }
      });

      addToast("Finding your metro mates...", "success");

      const qs = new URLSearchParams({
        source,
        destination,
        departureTime: fullDateTime,
      }).toString();

      setTimeout(() => {
        navigate(`/matches?${qs}`);
      }, 1000);
    } catch (err: any) {
      console.log("Update route error:", err);
      
      if (err.response?.status === 401) {
        localStorage.clear();
        addToast("Session expired. Please login again.", "error");
        navigate("/login");
      } else {
        addToast(err.response?.data?.message || "Server error", "error");
      }
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div 
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="MetroMeet Logo" className="h-10 w-auto" />
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-md"
            >
              <LogOut className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Train className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Plan Your Journey
              </CardTitle>
              <p className="text-gray-600 mt-2">Find travel companions for your metro ride</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Source Station */}
              <div>
                <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Source Station
                </label>
                <StationSelect
                  value={source}
                  onChange={setSource}
                  stations={stations}
                  placeholder="Select Source Station"
                />
              </div>

              {/* Destination Station */}
              <div>
                <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Destination Station
                </label>
                <StationSelect
                  value={destination}
                  onChange={setDestination}
                  stations={stations}
                  placeholder="Select Destination Station"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={today}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    min={departureDate === today ? minTime : undefined}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50"
                  />
                  {departureDate === today && (
                    <p className="text-xs text-gray-500 mt-1">
                      Select a time from now onwards
                    </p>
                  )}
                </div>
              </div>

              {/* Wait Window */}
              <div>
                <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                  <Users className="w-5 h-5 text-green-600" />
                  Wait Window
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={5}
                    max={120}
                    value={waitWindow}
                    onChange={(e) => setWaitWindow(Number(e.target.value))}
                    className="flex-1 h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${(waitWindow / 120) * 100}%, #e5e7eb ${(waitWindow / 120) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="px-5 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 font-bold rounded-xl min-w-[90px] text-center shadow-sm">
                    ±{waitWindow}m
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    🎯 Find matches within <span className="font-semibold text-blue-600">±{waitWindow} minutes</span> of your departure time
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-6 rounded-xl text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Find Metro Mates</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Info Cards */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-1">🔒</div>
                  <p className="text-xs font-semibold text-gray-700">Safe</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-1">⚡</div>
                  <p className="text-xs font-semibold text-gray-700">Instant</p>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <div className="text-2xl mb-1">🎯</div>
                  <p className="text-xs font-semibold text-gray-700">Accurate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FindRides;
