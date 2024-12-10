const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/User");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files
app.set("view engine", "ejs"); // Set EJS as the view engine

// MongoDB Connection
mongoose
  .connect("mongodb+srv://skyrrah999:zvsFOzq7GernQk9E@cluster0.uthoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.render("index", { title: "Home", users });
  } catch (error) {
    res.status(500).send("Error fetching users.");
  }
});


app.get("/add-user", (req, res) => {
  res.render("about", { title: "Add User", description: "Fill in user details." });
});

app.post("/add-user", async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const newUser = new User({ name, email, age });
    await newUser.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error saving user.");
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
