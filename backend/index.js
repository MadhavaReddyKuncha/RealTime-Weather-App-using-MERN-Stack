const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import Models
const User = require("./models/User");
const Feedback = require("./models/Feedback");

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Email service is running.");
});

// Feedback Route
app.post("/feedback", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const feedback = new Feedback({ name, email, message });
    await feedback.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Feedback System" <${process.env.EMAIL_USER}>`,
      to: "admin@example.com",
      subject: "New Feedback Received",
      text: `You have received new feedback.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Retrieve Feedback (Admin)
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ message: "User created successfully.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Login successful.", token, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// Fetch All Users (Admin)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch user data." });
  }
});

// Update User by ID
app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found." });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Delete User by ID
app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Update Profile by Email
app.put("/api/update-profile/:email", async (req, res) => {
  const { email } = req.params;
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = name || user.name;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.post("/api/send-email", async (req, res) => {
  const { weatherData, recipientEmail } = req.body;

  if (!weatherData || weatherData.length === 0 || !recipientEmail) {
    return res.status(400).json({ error: "Missing weather data or recipient email" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const emailBody = weatherData
    .map((data) => 
      `City: ${data.city} (${data.date})\nTemperature: ${data.weather.main.temp}°C\nCondition: ${data.weather.weather[0].description}\nSuggestion: ${data.suggestion}`
    )
    .join("\n\n");

  const mailOptions = {
    from: `"Trip Planner" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: "Your Trip Weather Forecast",
    text: `Here is your trip weather forecast:\n\n${emailBody}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});


// Start Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Not Loaded");
});
