const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
// Removed 'fs' as we are not using diskStorage anymore

const app = express();
// PORT is not needed when deploying to Vercel serverless functions
// const PORT = process.env.PORT || 5069;

// Middleware
app.use(cors({
    origin: 'https://teammavericks.vercel.app', // Allow requests from your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow necessary headers
  }));
  app.use(express.json());
// Removed static file serving for /uploads, as files won't be stored locally
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection - Hardcoded (Not Recommended for Security)
const MONGODB_URI_HARDCODED = "mongodb+srv://adityaverma:aditv1234Aa@devconnectcluster.paguw.mongodb.net/";

mongoose
  .connect(MONGODB_URI_HARDCODED, { // Use hardcoded variable
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Member Model (Schema remains the same)
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  department: { type: String },
  rollNumber: { type: String },
  year: { type: String },
  hobbies: { type: [String] },
  internship: { type: String },
  certificates: { type: [String] },
  projects: { type: [String] },
  aboutYou: { type: String },
  aim: { type: String },
  joinDate: { type: Date, default: Date.now },
  profileImage: { type: String }, // Store URL from cloud storage or handle differently
});

const Member = mongoose.model("Member", memberSchema);

// File Upload Configuration - Use memoryStorage for Vercel
// Store files in memory as Buffers instead of saving to disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (adjust as needed)
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Add/remove allowed types
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF allowed."));
  },
});

// API Routes
app.get("/api/members", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/members/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST route needs adjustment for handling memory storage
app.post("/api/members", upload.single("profileImage"), async (req, res) => {
  try {
    const {
      name, role, email, phone, department,
      rollNumber, year, hobbies, internship,
      certificates, projects, aboutYou, aim,
    } = req.body;

    // --- Handling the uploaded file ---
    // With memoryStorage, req.file contains a buffer: req.file.buffer
    // You'll need to upload this buffer to a cloud storage service (Vercel Blob, S3, etc.)
    // and get a URL back to store in the database.
    // For now, we'll just store a placeholder or null.
    // **IMPORTANT**: This part needs integration with a cloud storage provider.
    let profileImageUrl = null;
    if (req.file) {
        // Example placeholder - replace with actual cloud upload logic
        console.log(`Received file: ${req.file.originalname}, size: ${req.file.size} bytes`);
        // profileImageUrl = await uploadToCloudStorage(req.file.buffer, req.file.originalname); // Your cloud upload function
        profileImageUrl = `placeholder_image_path_for_${req.file.originalname}`; // Replace this
    }

    // Basic validation
    if (!name || !role || !email) { // Profile image is no longer strictly required here if handled differently
      return res.status(400).json({ error: "Name, role, and email are required" });
    }

    // Helper to split comma-separated strings
    const parseStringToArray = (str) => (str ? str.split(",").map((item) => item.trim()) : []);

    // Prepare member data
    const memberData = {
      name, role, email,
      profileImage: profileImageUrl, // Use the URL from cloud storage
      ...(phone && { phone }),
      ...(department && { department }),
      ...(rollNumber && { rollNumber }),
      ...(year && { year }),
      hobbies: parseStringToArray(hobbies),
      ...(internship && { internship }),
      certificates: parseStringToArray(certificates),
      projects: parseStringToArray(projects),
      ...(aboutYou && { aboutYou }),
      ...(aim && { aim }),
    };

    // Check for duplicate rollNumber
    if (memberData.rollNumber) {
        const existingMember = await Member.findOne({ rollNumber: memberData.rollNumber });
        if (existingMember) {
            return res.status(409).json({ error: "Member with this Roll Number already exists." });
        }
    }

    const newMember = new Member(memberData);
    await newMember.save();
    res.status(201).json(newMember);

  } catch (err) {
     console.error("Error adding member:", err); // Log the actual error
     // Handle potential Multer errors specifically
     if (err instanceof multer.MulterError) {
         return res.status(400).json({ error: `File upload error: ${err.message}` });
     } else if (err.message.includes("Only .png")) { // Check specific error message if needed
         return res.status(400).json({ error: "Invalid file type." });
     } else if (err.name === 'ValidationError') {
         return res.status(400).json({ error: `Validation Error: ${err.message}` });
     }
     // General server error
     res.status(500).json({ error: err.message || "An internal server error occurred while adding the member." });
  }
});

// Remove the app.listen block for Vercel
/*
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
*/

// Export the app for Vercel's Node.js runtime
module.exports = app;