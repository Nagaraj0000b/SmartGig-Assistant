const axios = require("axios");

const getTraffic = async (lat, lon) => {
  const API_KEY = process.env.TOMTOM_API_KEY;
  const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${API_KEY}&point=${lat},${lon}`;

  const res = await axios.get(url);
  const flow = res.data.flowSegmentData;

  const currentSpeed = flow.currentSpeed;   // actual speed now
  const freeFlowSpeed = flow.freeFlowSpeed; // normal max speed
  const congestion = Math.round((1 - currentSpeed / freeFlowSpeed) * 100); // % blocked

  let level = "clear";
  if (congestion > 60) level = "heavy";
  else if (congestion > 30) level = "moderate";

  return {
    
    current_speed_kmh: currentSpeed,
    free_flow_speed_kmh: freeFlowSpeed,
    congestion_percent: congestion,  // 0 = clear, 100 = standstill
    traffic_level: level,            // "clear" | "moderate" | "heavy"
  };
};

module.exports = { getTraffic };
