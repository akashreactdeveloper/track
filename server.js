const express = require("express");
const geoip = require("geoip-lite");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Log file path
const logFilePath = path.join(__dirname, "visits.log");

app.get("/track", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const geo = geoip.lookup(ip);

  const logEntry = {
    time: new Date().toISOString(),
    ip: ip,
    country: geo?.country || "Unknown",
    state: geo?.region || "Unknown",
    userAgent: req.headers["user-agent"]
  };

  // Convert to string line
  const logLine = JSON.stringify(logEntry) + "\n";

  // Append to file
  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) console.error("Log write error:", err);
  });

  console.log("Visit logged:", logEntry);

  res.send("Page opened");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
