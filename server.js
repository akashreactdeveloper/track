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

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Tracking Page</title>
        </head>
        <body>
            <h1>Welcome!</h1>
            <p>Your visit has been logged.</p>
        </body>
        </html>
    `);
});
