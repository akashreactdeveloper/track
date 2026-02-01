const express = require("express");
const geoip = require("geoip-lite");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// For Vercel serverless, we can't use file system writes
// Instead, we'll log to console (or you can use a database)
const logFilePath = path.join(__dirname, "visits.log");

app.get("/video/15971/she-finally-comes-out-as-a-lesbian-and-bangs-the-hot-nurse", (req, res) => {
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

    // Log to console (Vercel logs)
    console.log("Visit logged:", logEntry);

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Tracking Page</title>
        </head>
        <body>
            <h1>Welcome!</h1>
            <p>Your visit has been logged.</p>
            <p>Location: ${logEntry.country}, ${logEntry.state}</p>
        </body>
        </html>
    `);
});

app.get("/", (req, res) => {
    res.send("Tracking server is running!");
});

// Only start server if not in Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
