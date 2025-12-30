import { userModel } from "../models/user-model.js";
import { getLineOfStation, getAdjacentStations } from "../utils/stations.js";

export const findMatches = async (req, res) => {
  try {
    const { source, destination, departureTime, userId } = req.query;

    console.log("▶ Received Source:", source);
    console.log("▶ Received Destination:", destination);
    console.log("▶ Received userId:", userId);
    console.log("🔥 FULL QUERY:", req.query);

    // 1) Basic validation
    if (!source || !destination) {
      return res.status(400).json({ success: false, message: "Missing source/destination" });
    }

    if (!departureTime) {
      console.log("❌ No departureTime in query at all");
      return res.status(400).json({ success: false, message: "Missing departureTime" });
    }

    if (!userId) {
      console.log("❌ No userId in query");
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const baseTime = new Date(departureTime);
    console.log("🕒 Parsed baseTime:", baseTime);

    if (isNaN(baseTime.getTime())) {
      console.log("❌ Invalid date from departureTime:", departureTime);
      return res.status(400).json({ success: false, message: "Invalid departureTime" });
    }

    // 2) Line detection
    const srcInfo = getLineOfStation(source);
    const dstInfo = getLineOfStation(destination);

    console.log("ℹ srcInfo:", srcInfo?.line);
    console.log("ℹ dstInfo:", dstInfo?.line);

    if (!srcInfo || !dstInfo) {
      return res.json({ success: false, message: "Invalid station name" });
    }

    // 3) Adjacent stations
    const nearSource = getAdjacentStations(srcInfo.stations, source);
    const nearDestination = getAdjacentStations(dstInfo.stations, destination);

    console.log("📌 YOUR SOURCE:", source);
    console.log("📌 nearSource:", nearSource);

    console.log("📌 YOUR DEST:", destination);
    console.log("📌 nearDestination:", nearDestination);

    // 4) Get current user's stored travel window
    const currentUser = await userModel.findById(userId);
    
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ USE THE SEARCHER'S STORED WINDOW FROM DATABASE
    // This is what they saved when they submitted their journey
    let searcherMinTime, searcherMaxTime;

    if (currentUser?.travel?.departureTime && currentUser?.travel?.expiresAt) {
      searcherMinTime = currentUser.travel.departureTime;
      searcherMaxTime = currentUser.travel.expiresAt;
      console.log("✅ Using searcher's stored travel window from database");
    } else {
      console.log("❌ Current user has no stored travel data!");
      return res.json({
        success: false,
        message: "Please submit your journey details first",
        matches: []
      });
    }

    console.log("🕒 Searcher's time window:", { 
      searcherMinTime: searcherMinTime.toLocaleString('en-IN'), 
      searcherMaxTime: searcherMaxTime.toLocaleString('en-IN')
    });

    // 5) Find reverse-route candidates (ignore time initially)
    const routeCandidates = await userModel.find({
      _id: { $ne: userId }, // Exclude the current user
      "travel.source": { $in: nearDestination },
      "travel.destination": { $in: nearSource },
      "travel.departureTime": { $exists: true },
      "travel.expiresAt": { $exists: true }
    });

    console.log("🔁 Reverse-route candidates (before time filtering):", routeCandidates.length);

    // 6) Filter by overlapping time windows
    const matches = routeCandidates.filter(candidate => {
      const candidateMinTime = candidate.travel.departureTime;
      const candidateMaxTime = candidate.travel.expiresAt;

      console.log(`\n👤 Checking candidate: ${candidate.name}`);
      console.log(`   Candidate window: ${candidateMinTime.toLocaleString('en-IN')} to ${candidateMaxTime.toLocaleString('en-IN')}`);
      console.log(`   Searcher window: ${searcherMinTime.toLocaleString('en-IN')} to ${searcherMaxTime.toLocaleString('en-IN')}`);

      // Check if time windows overlap
      // Two time ranges overlap if: start1 <= end2 AND start2 <= end1
      const overlaps = searcherMinTime <= candidateMaxTime && candidateMinTime <= searcherMaxTime;

      console.log(`   ⏰ Windows overlap? ${overlaps ? '✅ YES' : '❌ NO'}`);

      return overlaps;
    });

    console.log("✅ Final matching users:", matches.length);

    // 7) Clean up expired travels
    await userModel.updateMany(
      { "travel.expiresAt": { $lt: new Date() } },
      { $unset: { travel: "" } }
    );

    return res.json({
      success: true,
      nearSource,
      nearDestination,
      matches: matches,
    });
  } catch (err) {
    console.log("Match error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};