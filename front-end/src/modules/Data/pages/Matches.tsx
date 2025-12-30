import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Train, MapPin, Clock, User, ArrowRight, Search, LogOut } from "lucide-react";

interface MatchUser {
  name: string;
  email: string;
  travel: {
    source: string;
    destination: string;
    departureTime: string;
  };
}

const Matches = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  
  const source = params.get("source");
  const destination = params.get("destination");
  const departureTime = params.get("departureTime");

  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        if (!token || !userId) {
          navigate("/login");
          return;
        }

        const storedName = localStorage.getItem("userName");
        if (storedName) {
          setUserName(storedName);
        }

        const res = await axios.get('/api/v1/match/find', {
          params: {
            source,
            destination,
            departureTime,
            userId
          },
          headers: {
            'Authorization': token
          }
        });

        setMatches(res.data.matches || []);
      } catch (err: any) {
        console.error("Match fetch error:", err);
        
        if (err.response?.status === 401) {
          localStorage.clear();
          alert("Session expired. Please login again.");
          navigate("/login");
        } else {
          setError(err.response?.data?.message || "Failed to fetch matches");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [source, destination, departureTime, navigate]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    const formattedDate = date.toLocaleDateString('en-IN', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-IN', timeOptions);

    return { date: formattedDate, time: formattedTime };
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const yourDateTime = departureTime ? formatDateTime(departureTime) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Finding your metro mates...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-red-600 text-lg font-semibold">{error}</p>
            <button
              onClick={() => navigate("/find-rides")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-lg shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate("/")}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Train className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MetroMeet
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/find-rides")}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full hover:bg-gray-50 transition-all shadow-sm"
              >
                <Search className="w-4 h-4 text-gray-600" />
                <span className="hidden md:inline text-gray-700 font-medium">New Search</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full hover:bg-gray-50 transition-all shadow-sm"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
                <span className="hidden md:inline text-gray-700 font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Your Journey Card */}
          <Card className="bg-white/80 backdrop-blur-lg shadow-xl border border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {userName ? `${userName}'s Journey` : "Your Journey"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">From</p>
                        <p className="font-semibold text-gray-800">{source}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">To</p>
                        <p className="font-semibold text-gray-800">{destination}</p>
                      </div>
                    </div>
                    {yourDateTime && (
                      <>
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-indigo-600 mt-1" />
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Date</p>
                            <p className="font-semibold text-gray-800">{yourDateTime.date}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-pink-600 mt-1" />
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Time</p>
                            <p className="font-semibold text-gray-800">{yourDateTime.time}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matches Section */}
          <Card className="bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20">
            <CardHeader>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full mb-3">
                  <Train className="w-5 h-5" />
                  <span className="font-bold">Metro Mates Found</span>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  {matches.length} {matches.length === 1 ? 'Match' : 'Matches'} 🎉
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              {matches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-7xl mb-4">😔</div>
                  <p className="text-gray-700 text-2xl font-bold mb-2">No matches found</p>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your time or check back later!
                  </p>
                  <button
                    onClick={() => navigate("/find-rides")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search Again</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((user, index) => {
                    const userDateTime = user.travel?.departureTime 
                      ? formatDateTime(user.travel.departureTime)
                      : null;

                    return (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-xl text-gray-800">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            ✓ Verified
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-white/60 rounded-xl p-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                            <div>
                              <p className="text-xs text-gray-500 font-medium">From</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {user.travel?.source || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-purple-600 mt-1" />
                            <div>
                              <p className="text-xs text-gray-500 font-medium">To</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {user.travel?.destination || 'N/A'}
                              </p>
                            </div>
                          </div>
                          {userDateTime && (
                            <>
                              <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-indigo-600 mt-1" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Date</p>
                                  <p className="text-sm font-semibold text-gray-800">{userDateTime.date}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-pink-600 mt-1" />
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Time</p>
                                  <p className="text-sm font-semibold text-gray-800">{userDateTime.time}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                          <span>Connect</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Matches;
