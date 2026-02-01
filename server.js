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

    // Show loading page
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Loading...</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: #1a1a1a;
                    font-family: Arial, sans-serif;
                    color: #fff;
                }
                .loader-container {
                    text-align: center;
                }
                .spinner {
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    border-top: 4px solid #fff;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                h2 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: normal;
                }
                p {
                    margin: 10px 0 0;
                    color: #888;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="loader-container">
                <div class="spinner"></div>
                <h2>Loading Content...</h2>
                <p>Please wait while we prepare your content</p>
            </div>
        </body>
        </html>
    `);
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
