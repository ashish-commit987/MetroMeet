// cleanup-scheduler.js
import { userModel } from "./models/user-model.js";

// Function to clean up expired travel entries
export const cleanupExpiredTravels = async () => {
  try {
    const result = await userModel.updateMany(
      { "travel.expiresAt": { $lt: new Date() } },
      { $unset: { travel: "" } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`🧹 Cleaned up ${result.modifiedCount} expired travel entries at ${new Date().toLocaleString('en-IN')}`);
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }
};

// Run cleanup every 5 minutes
export const startCleanupScheduler = () => {
  // Run immediately on startup
  cleanupExpiredTravels();
  
  // Then run every 5 minutes (300000 ms)
  setInterval(cleanupExpiredTravels, 5 * 60 * 1000);
  
  console.log("✅ Cleanup scheduler started - runs every 5 minutes");
};