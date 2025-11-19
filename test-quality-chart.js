// Quick test for quality score chart data
import fetch from "node-fetch";

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJySlBUWER6OFB5UlhjbTdzMnZyZnRkZ1U2NXUyIiwiZW1haWwiOiJmYXR0YWguYWZyMkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjMwMzEwMTYsImV4cCI6MTc2MzExNzQxNn0.Yf4A4gwEyYD6uKn7USDkGVAtfySAP5CfULJr-Odh_8k";

async function testQualityChart() {
  try {
    console.log("🧪 Testing Quality Score Chart Data\n");

    // Test week period
    console.log("📊 Fetching week data...");
    const response = await fetch(
      "http://localhost:3000/api/dashboard/readings/1?period=week&limit=50",
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    console.log("✅ Response Status:", data.success);
    console.log("📈 Total readings:", data.count);
    console.log("📅 Period:", data.period);
    console.log("📊 Date range:", data.date_range);
    console.log("\n📋 Summary:", JSON.stringify(data.summary, null, 2));

    if (data.data && data.data.length > 0) {
      console.log("\n🔍 First reading sample:");
      console.log("   Timestamp:", data.data[0].timestamp);
      console.log("   Date:", data.data[0].date, "✅");
      console.log("   Time:", data.data[0].time, "✅");
      console.log("   Quality Score:", data.data[0].quality_score);
      console.log("   Status:", data.data[0].status);
      console.log("   Inlet pH:", data.data[0].inlet_ph);
      console.log("   Outlet pH:", data.data[0].outlet_ph);

      console.log("\n🔢 Quality Scores (first 10):");
      const scores = data.data
        .slice(0, 10)
        .map((r) => `${r.quality_score} (${r.status})`);
      console.log("   ", scores.join(", "));

      console.log(
        "\n📊 All quality scores:",
        data.data.map((r) => r.quality_score)
      );

      // Check for zero or null scores
      const zeroScores = data.data.filter(
        (r) => !r.quality_score || r.quality_score === 0
      );
      console.log(
        `\n⚠️  Readings with zero/null quality_score: ${zeroScores.length}/${data.count}`
      );

      if (zeroScores.length > 0) {
        console.log("   First zero score reading:", {
          timestamp: zeroScores[0].timestamp,
          inlet: {
            ph: zeroScores[0].inlet_ph,
            tds: zeroScores[0].inlet_tds,
          },
          outlet: {
            ph: zeroScores[0].outlet_ph,
            tds: zeroScores[0].outlet_tds,
          },
          fuzzy: {
            quality_score: zeroScores[0].quality_score,
            status: zeroScores[0].status,
          },
        });
      }
    } else {
      console.log("\n❌ NO DATA FOUND!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testQualityChart();
