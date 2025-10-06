const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Database setup
const db = new sqlite3.Database("src/db/contactForm.db", (err) => {
    if (err) {
        console.error("Error connecting to the database: ", err.message);
    } else {
        console.log("Connected to the database!");
    }
});

db.run(`CREATE TABLE IF NOT EXISTS contactForm (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, phoneNum INTEGER, email TEXT, msg TEXT)`);

// Redirect root URL (/) to your home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

// Contact form submission (POST)
app.post("/contact", (req, res) => {
  const { firstName, lastName, phoneNum, email, msg } = req.body;

  if (!firstName || !lastName || !phoneNum || !email || !msg) {
    return res.status(400).send("All fields are required.");
  }

  const query = `
    INSERT INTO contactForm (firstName, lastName, phoneNum, email, msg)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [firstName, lastName, phoneNum, email, msg], err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving your message.");
    }
    res.status(200).send("Message received!");
  });
});

// 404 page redirect
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/404.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
