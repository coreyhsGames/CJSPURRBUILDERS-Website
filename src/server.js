const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve everything inside /public as static files
app.use(express.static(path.join(__dirname, "../public")));

// Redirect root URL (/) to your home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

// 404 page redirect
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/404.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
