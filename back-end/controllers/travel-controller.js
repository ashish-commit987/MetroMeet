import { userModel } from "../models/user-model.js";

export const updateTravelRoute = async (req, res) => {
  try {
    const { userId, source, destination, departureTime, waitWindow } = req.body;

    console.log("🔥 Body:", req.body);

    if (!userId || !source || !destination || !departureTime || Number(waitWindow) <= 0) {
      return res.status(400).json({ message: "Missing fields." });
    }

    const depTime = new Date(departureTime);

    if (isNaN(depTime.getTime())) {
      return res.status(400).json({ message: "Invalid departure time." });
    }

    // ✅ FIX: Store the FULL wait window (both before and after departure time)
    // If user selects 2:00 PM with 30 min wait, they can meet from 1:30 PM to 2:30 PM
    const waitWindowMs = waitWindow * 60000;
    const windowStart = new Date(depTime.getTime() - waitWindowMs);
    const windowEnd = new Date(depTime.getTime() + waitWindowMs);

    console.log("📅 Departure Time:", depTime.toLocaleString('en-IN'));
    console.log("⏰ Window Start (earliest):", windowStart.toLocaleString('en-IN'));
    console.log("⏰ Window End (latest):", windowEnd.toLocaleString('en-IN'));

    const updated = await userModel.findByIdAndUpdate(
      userId,
      {
        travel: {
          source,
          destination,
          departureTime: windowStart,  // ✅ Store window START (earliest time)
          expiresAt: windowEnd          // ✅ Store window END (latest time)
        }
      },
      { new: true, runValidators: true }
    );

    console.log("✅ UPDATED USER →", updated);

    res.json({ 
      success: true, 
      message: "Route updated successfully.",
      windowStart: windowStart.toLocaleString('en-IN'),
      windowEnd: windowEnd.toLocaleString('en-IN')
    });

  } catch (err) {
    console.log("Route update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};