const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { put } = require('@vercel/blob'); // Import Vercel Blob SDK

const app = express();

// --- Middleware ---
app.use(cors({
    origin: '*', // Be more specific in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- MongoDB Connection ---
// !! IMPORTANT: Use Environment Variable in Production !!
// const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI = "mongodb+srv://adityaverma:aditv1234Aa@devconnectcluster.paguw.mongodb.net/?retryWrites=true&w=majority&appName=DevConnectCluster"; // Replace with process.env.MONGODB_URI

if (!MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI environment variable is not set.");
    // In a real app, you might exit or prevent startup: process.exit(1);
} else {
    mongoose
      .connect(MONGODB_URI)
      .then(() => console.log("MongoDB connection successful."))
      .catch((err) => console.error("!!! MongoDB connection error:", err));
}

// --- Member Model ---
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String },
  rollNumber: { type: String, unique: true, sparse: true },
  year: { type: String },
  hobbies: { type: [String] },
  internship: { type: String },
  certificates: { type: [String] },
  projects: { type: [String] },
  aboutYou: { type: String },
  aim: { type: String },
  joinDate: { type: Date, default: Date.now },
  profileImage: { type: String }, // This will store the Vercel Blob URL
});

const Member = mongoose.model("Member", memberSchema);

// --- File Upload Configuration ---
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF allowed."));
  },
});

// --- API Routes ---
app.get("/api/members", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    console.error("Error in GET /api/members:", err);
    res.status(500).json({ error: "Failed to fetch members", details: err.message });
  }
});

app.get("/api/members/:id", async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }
        res.json(member);
    } catch (err) {
        console.error(`Error in GET /api/members/${req.params.id}:`, err);
        if (err.name === 'CastError') {
             return res.status(400).json({ error: "Invalid member ID format" });
        }
        res.status(500).json({ error: "Failed to fetch member", details: err.message });
    }
});

app.post("/api/members", upload.single("profileImage"), async (req, res) => {
  console.log("Received POST /api/members request");
  try {
    const {
      name, role, email, phone, department,
      rollNumber, year, hobbies, internship,
      certificates, projects, aboutYou, aim,
    } = req.body;

    // --- Vercel Blob Upload Logic ---
    let profileImageUrl = null;
    if (req.file) {
        console.log(`Received file: ${req.file.originalname}, size: ${req.file.size}`);
        // Construct a unique filename for the blob
        const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;
        const blobPathname = `profile-images/${filename}`; // Store in a folder
        console.log(`Attempting to upload to Vercel Blob at path: ${blobPathname}`);

        try {
            const blob = await put(blobPathname, req.file.buffer, {
              access: 'public', // Make the blob publicly accessible
              token: process.env.BLOB_READ_WRITE_TOKEN // Explicitly pass token if needed, usually inferred
            });
            profileImageUrl = blob.url; // Get the public URL
            console.log(`File uploaded successfully to Vercel Blob: ${profileImageUrl}`);
        } catch (blobError) {
            console.error("!!! Vercel Blob upload error:", blobError);
            // Decide if the member should still be created without an image
            // return res.status(500).json({ error: "Failed to upload profile image.", details: blobError.message });
            // Or set profileImageUrl to null and continue, logging the error
             profileImageUrl = null; // Or a default image URL
             // Optionally add an error message to the response later
        }
    } else {
        console.log("No profile image file received in request.");
    }
    // --- End Vercel Blob Upload Logic ---


    if (!name || !role || !email) {
      return res.status(400).json({ error: "Name, role, and email are required" });
    }

    const parseStringToArray = (str) => (typeof str === 'string' && str.length > 0 ? str.split(",").map((item) => item.trim()) : []);

    const memberData = {
      name, role, email,
      profileImage: profileImageUrl, // Use the actual Blob URL or null
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

    // Check for existing members (improved logic)
    const existingConditions = [];
    if (email) existingConditions.push({ email: email });
    if (rollNumber) existingConditions.push({ rollNumber: rollNumber });

    if (existingConditions.length > 0) {
        const existingMember = await Member.findOne({ $or: existingConditions });
        if (existingMember) {
            let conflictField = existingMember.email === email ? 'Email' : 'Roll Number';
            console.log(`Conflict: Member with this ${conflictField} already exists.`);
            return res.status(409).json({ error: `Member with this ${conflictField} already exists.` });
        }
    }

    const newMember = new Member(memberData);
    await newMember.save();
    console.log(`New member saved successfully with ID: ${newMember._id}`);
    res.status(201).json(newMember);

  } catch (err) {
     console.error("!!! Error adding member in POST /api/members:", err);
     if (err instanceof multer.MulterError) {
         return res.status(400).json({ error: `File upload error: ${err.message}` });
     } else if (err.message.includes("Invalid file type")) {
         return res.status(400).json({ error: "Invalid file type." });
     } else if (err.name === 'ValidationError') {
         const messages = Object.values(err.errors).map(e => e.message);
         return res.status(400).json({ error: `Validation Error: ${messages.join(', ')}` });
     } else if (err.code === 11000) { // Duplicate key error
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ error: `An account with this ${field} already exists.` });
    }
     res.status(500).json({ error: "An internal server error occurred while adding the member.", details: err.message });
  }
});

// --- Export the app for Vercel ---
module.exports = app;
console.log("--- Vercel Function Initialization Complete ---");