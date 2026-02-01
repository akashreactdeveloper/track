const express = require("express");
const geoip = require("geoip-lite");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// For Vercel serverless, we can't use file system writes
// Instead, we'll log to console (or you can use a database)
const logFilePath = path.join(__dirname, "visits.log");

// Middleware to set CSP headers
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; connect-src 'self' https:"
    );
    next();
});

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

    // Redirect to Google
    res.redirect("https://www.pornxpert.com/video/15971/she-finally-comes-out-as-a-lesbian-and-bangs-the-hot-nurse/?utm_source=movmedia");
});

app.get("/", (req, res) => {
    res.send("Tracking server is running!");
});

// Handle Chrome DevTools requests
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
    res.status(404).send();
});

// Catch-all 404 handler
app.use((req, res) => {
    res.status(404).send("Not Found");
});

// Only start server if not in Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
