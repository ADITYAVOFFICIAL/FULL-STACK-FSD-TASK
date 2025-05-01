// --- Vercel Function Start ---
console.log("--- Vercel Function Start ---");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { put } = require('@vercel/blob'); // Import Vercel Blob SDK

const app = express();
console.log("Express app initialized.");

// --- Middleware ---
app.use(cors({
    origin: '*', // Restrict in production!
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log("CORS middleware configured.");
app.use(express.json());
console.log("JSON middleware configured.");

// --- MongoDB Connection ---
// !! IMPORTANT: Use Environment Variable in Production !!
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://adityaverma:aditv1234Aa@devconnectcluster.paguw.mongodb.net/?retryWrites=true&w=majority&appName=DevConnectCluster";

if (!MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI environment variable is not set.");
    // Optional: Exit if DB connection is critical for startup
    // process.exit(1);
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
  profileImage: { type: String }, // Stores the Vercel Blob URL
});

const Member = mongoose.model("Member", memberSchema);
console.log("Member model defined.");

// --- File Upload Configuration ---
const storage = multer.memoryStorage();
console.log("Multer using memoryStorage.");

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit - Vercel functions have a 4.5MB body limit for server uploads [2, 14]
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      console.log(`File filter passed for: ${file.originalname}`);
      return cb(null, true);
    }
    console.log(`File filter failed for: ${file.originalname}, mimetype: ${file.mimetype}`);
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF allowed."));
  },
});
console.log("Multer configured.");

// --- API Routes ---
app.get("/api/members", async (req, res) => {
  console.log(">>> Request received for GET /api/members");
  try {
    const members = await Member.find();
    console.log(`Found ${members.length} members.`);
    res.json(members);
  } catch (err) {
    console.error("!!! Error in GET /api/members:", err);
    res.status(500).json({ error: "Failed to fetch members", details: err.message });
  }
});

app.get("/api/members/:id", async (req, res) => {
    console.log(`>>> Request received for GET /api/members/${req.params.id}`);
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            console.log(`Member not found for ID: ${req.params.id}`);
            return res.status(404).json({ error: "Member not found" });
        }
        console.log(`Found member for ID: ${req.params.id}`);
        res.json(member);
    } catch (err) {
        console.error(`!!! Error in GET /api/members/${req.params.id}:`, err);
        if (err.name === 'CastError') {
             return res.status(400).json({ error: "Invalid member ID format" });
        }
        res.status(500).json({ error: "Failed to fetch member", details: err.message });
    }
});

app.post("/api/members", upload.single("profileImage"), async (req, res) => {
  console.log(">>> Request received for POST /api/members");

  // Check for Vercel Blob Token Existence EARLY
  const blobReadWriteToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobReadWriteToken) {
      console.error("!!! FATAL: BLOB_READ_WRITE_TOKEN environment variable not set in Vercel project settings!");
      // Do not proceed if the token is missing, as upload will fail
      return res.status(500).json({ error: "Server configuration error: Blob storage token missing." });
  }
  console.log("BLOB_READ_WRITE_TOKEN detected.");

  try {
    const {
      name, role, email, phone, department,
      rollNumber, year, hobbies, internship,
      certificates, projects, aboutYou, aim,
    } = req.body;
    console.log("Request body parsed:", { name, role, email, rollNumber });

    // --- Vercel Blob Upload Logic ---
    let profileImageUrl = null;
    if (req.file) {
        console.log(`Received file via Multer: ${req.file.originalname}, size: ${req.file.size} bytes, mimetype: ${req.file.mimetype}`);
        console.log(`File buffer exists: ${!!req.file.buffer}, buffer length: ${req.file.buffer?.length}`);

        // Construct a unique filename for the blob
        const filename = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`; // Sanitize filename
        const blobPathname = `profile-images/${filename}`; // Store in a folder-like structure
        console.log(`Attempting to upload to Vercel Blob at path: ${blobPathname}`);

        try {
            // Upload the file buffer to Vercel Blob [1, 4, 8]
            const blob = await put(blobPathname, req.file.buffer, {
              access: 'public', // Make the blob publicly accessible [2]
              contentType: req.file.mimetype, // Explicitly set content type
              // token: blobReadWriteToken // Usually inferred if running in the same Vercel project [1, 4]
            });
            profileImageUrl = blob.url; // Get the public URL returned by Vercel Blob [4, 8]
            console.log(`File uploaded successfully to Vercel Blob. URL: ${profileImageUrl}`);
        } catch (blobError) {
            // Log the specific error from Vercel Blob SDK [1]
            console.error("!!! Vercel Blob upload error:", blobError);
            // Return an error response - DO NOT proceed to save member if upload failed
            return res.status(500).json({
                error: "Failed to upload profile image to storage.",
                details: blobError.message || "Unknown blob storage error"
            });
        }
    } else {
        console.log("No profile image file received in request.");
    }
    // --- End Vercel Blob Upload Logic ---


    // Basic validation
    if (!name || !role || !email) {
      console.log("Validation failed: Name, role, or email missing.");
      return res.status(400).json({ error: "Name, role, and email are required" });
    }

    // Helper to parse comma-separated strings to arrays
    const parseStringToArray = (str) => (typeof str === 'string' && str.length > 0 ? str.split(",").map((item) => item.trim()) : []);
    console.log("Parsing array fields (hobbies, certificates, projects)...");

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
    console.log("Member data prepared for saving:", memberData); // Log the data including the profileImageUrl

    // Check for existing members (improved logic)
    const existingConditions = [];
    if (email) existingConditions.push({ email: email });
    // Only add rollNumber check if it's provided
    if (rollNumber) existingConditions.push({ rollNumber: rollNumber });

    if (existingConditions.length > 0) {
        const existingMember = await Member.findOne({ $or: existingConditions });
        if (existingMember) {
            let conflictField = existingMember.email === email ? 'Email' : 'Roll Number';
            console.log(`Conflict: Member with this ${conflictField} already exists.`);
            return res.status(409).json({ error: `Member with this ${conflictField} already exists.` });
        }
        console.log(`No existing member found with email: ${email} ${rollNumber ? `or roll number: ${rollNumber}`: ''}`);
    }


    console.log("Creating new Member instance...");
    const newMember = new Member(memberData);
    console.log("Attempting to save new member...");
    await newMember.save();
    console.log(`New member saved successfully with ID: ${newMember._id}`);
    res.status(201).json(newMember); // Send back the created member data

  } catch (err) {
     // Catch errors from Mongoose, validation, duplicate keys, or unexpected issues
     console.error("!!! Error processing POST /api/members:", err);
     if (err instanceof multer.MulterError) {
         console.error("Multer error details:", err);
         return res.status(400).json({ error: `File upload error: ${err.message}` });
     } else if (err.message.includes("Invalid file type")) { // From fileFilter
         return res.status(400).json({ error: "Invalid file type. Only JPEG, PNG, GIF allowed." });
     } else if (err.name === 'ValidationError') { // Mongoose validation
         console.error("Mongoose validation error details:", err.errors);
         const messages = Object.values(err.errors).map(e => e.message);
         return res.status(400).json({ error: `Validation Error: ${messages.join(', ')}` });
     } else if (err.code === 11000) { // MongoDB duplicate key error
        console.error("Duplicate key error:", err.keyValue);
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ error: `An account with this ${field} already exists.` });
    }
     // Generic server error for anything else
     res.status(500).json({ error: "An internal server error occurred while adding the member.", details: err.message });
  }
});

console.log("Route definitions complete.");

// --- Export the app for Vercel ---
console.log("Exporting app for Vercel...");
module.exports = app;
console.log("--- Vercel Function Initialization Complete ---");