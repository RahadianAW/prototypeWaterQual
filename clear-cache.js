// Clear backend cache
import fetch from "node-fetch";

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJySlBUWER6OFB5UlhjbTdzMnZyZnRkZ1U2NXUyIiwiZW1haWwiOiJmYXR0YWguYWZyMkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjMwMzEwMTYsImV4cCI6MTc2MzExNzQxNn0.Yf4A4gwEyYD6uKn7USDkGVAtfySAP5CfULJr-Odh_8k";

async function clearCache() {
  try {
    console.log("🧹 Clearing backend cache...");
    const response = await fetch("http://localhost:3000/api/cache/clear", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    const data = await response.json();
    console.log("✅ Cache cleared:", data);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

clearCache();
