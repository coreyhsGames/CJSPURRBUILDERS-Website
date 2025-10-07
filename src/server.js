const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => res.render("home", { activePage: "home" }));
app.get("/about", (req, res) => res.render("about", { activePage: "about" }));
app.get("/our-services", (req, res) => res.render("ourServices", { activePage: "ourServices" }));
app.get("/testimonials", (req, res) => res.render("testimonials", { activePage: "testimonials" }));
app.get("/contact", (req, res) => res.render("contact", { activePage: "contact" }));

// Database setup
const contactFormDB = new sqlite3.Database("src/db/contactForm.db", (err) => {
    if (err) {
        console.error("Error connecting to the contact form database: ", err.message);
    } else {
        console.log("Connected to the contact form database!");
    }
});
contactFormDB.run(`CREATE TABLE IF NOT EXISTS contactForm (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, phone_num INTEGER, email TEXT, msg TEXT)`);

const projectsDB = new sqlite3.Database("src/db/projects.db", (err) => {
    if (err) {
        console.error("Error connecting to the projects database: ", err.message);
    } else {
        console.log("Connected to the projects database!");
    }
});
projectsDB.run(`CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL)`);
projectsDB.run(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, location_id INTEGER NOT NULL, name TEXT NOT NULL, FOREIGN KEY (location_id) REFERENCES locations(id))`);
projectsDB.run(`CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER NOT NULL, photo_path TEXT NOT NULL, FOREIGN KEY (project_id) REFERENCES projects(id))`);

// Redirect root URL (/) to your home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

// Contact form submission (POST)
app.post("/contact", (req, res) => {
  const { first_name, last_name, phone_num, email, msg } = req.body;

  if (!first_name || !last_name || !phone_num || !email || !msg) {
    return res.status(400).send("All fields are required.");
  }

  const query = `
    INSERT INTO contactForm (first_name, last_name, phone_num, email, msg)
    VALUES (?, ?, ?, ?, ?)
  `;
  contactFormDB.run(query, [first_name, last_name, phone_num, email, msg], err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving your message.");
    }
    res.status(200).send("Message received!");
  });
});

app.get("/our-projects", (req, res) => {
  projectsDB.all("SELECT * FROM locations ORDER BY name ASC", (err, locations) => {
    if (err) return res.status(500).send("Database error");

    const categories = {};

    // Group by first letter
    locations.forEach(loc => {
      const letter = loc.name[0].toUpperCase();
      if (!categories[letter]) categories[letter] = [];
      categories[letter].push(loc);
    });

    // Pass both categories and activePage
    res.render("ourProjects", { categories, activePage: "ourProjects" });
  });
});

app.get("/projects/:locationId", (req, res) => {
  const locationId = req.params.locationId;

  // Get location name + its projects + photos
  projectsDB.get("SELECT name FROM locations WHERE id = ?", [locationId], (err, location) => {
    if (err || !location) return res.status(404).send("Location not found");

    const query = `
      SELECT projects.id AS projectId, projects.name AS projectName, photos.photo_path
      FROM projects
      LEFT JOIN photos ON projects.id = photos.project_id
      WHERE projects.location_id = ?
    `;

    projectsDB.all(query, [locationId], (err, rows) => {
      if (err) return res.status(500).send("Error loading projects");

      // Group photos by project
      const projects = {};
      rows.forEach(row => {
        if (!projects[row.projectId]) {
          projects[row.projectId] = {
            name: row.projectName,
            photos: []
          };
        }
        if (row.photo_path) projects[row.projectId].photos.push(row.photo_path);
      });

      // Pass activePage so navbar knows which page is active
      res.render("locationProjects", { location, projects, activePage: "ourProjects" });
    });
  });
});

// 404 page redirect
app.use((req, res) => {
  res.status(404).render("404", { activePage: "" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
