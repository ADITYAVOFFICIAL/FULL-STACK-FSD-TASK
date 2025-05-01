// --- Vercel Function Start ---
console.log("--- Vercel Function Start ---");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

console.log("Modules loaded.");

const app = express();
console.log("Express app initialized.");

// --- Middleware ---
app.use(cors({
    origin: '*', // WARNING: Allow all origins - restrict in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
console.log("Middleware configured.");

// --- MongoDB Connection ---
// WARNING: Hardcoding credentials is insecure. Use Environment Variables.
const MONGODB_URI_HARDCODED = process.env.MONGODB_URI || "mongodb+srv://adityaverma:aditv1234Aa@devconnectcluster.paguw.mongodb.net/?retryWrites=true&w=majority&appName=DevConnectCluster";
console.log("Attempting MongoDB connection...");

mongoose.connect(MONGODB_URI_HARDCODED)
  .then(() => console.log("MongoDB connection successful."))
  .catch((err) => console.error("!!! MongoDB connection error:", err));

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
  // Stores the image as a Base64 Data URL string
  profileImage: { type: String },
});

const Member = mongoose.model("Member", memberSchema);
console.log("Member model defined.");

// --- File Upload Configuration ---
// Use memoryStorage to get the file buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (adjust as needed)
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF allowed."));
  },
});
console.log("Multer configured.");

// --- API Routes ---
app.get("/api/members", async (req, res) => {
  console.log(">>> GET /api/members");
  try {
    const members = await Member.find();
    console.log(`Found ${members.length} members.`);
    res.json(members);
  } catch (err) {
    console.error("!!! Error GET /api/members:", err);
    res.status(500).json({ error: "Failed to fetch members", details: err.message });
  }
});

app.get("/api/members/:id", async (req, res) => {
    console.log(`>>> GET /api/members/${req.params.id}`);
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            console.log(`Member not found: ${req.params.id}`);
            return res.status(404).json({ error: "Member not found" });
        }
        console.log(`Found member: ${req.params.id}`);
        res.json(member);
    } catch (err) {
        console.error(`!!! Error GET /api/members/${req.params.id}:`, err);
        if (err.name === 'CastError') {
             return res.status(400).json({ error: "Invalid member ID format" });
        }
        res.status(500).json({ error: "Failed to fetch member", details: err.message });
    }
});

app.post("/api/members", upload.single("profileImage"), async (req, res) => {
  console.log(">>> POST /api/members");
  try {
    const {
      name, role, email, phone, department,
      rollNumber, year, hobbies, internship,
      certificates, projects, aboutYou, aim,
    } = req.body;
    console.log("Request body parsed:", { name, role, email });

    let profileImageDataUrl = null; // Changed variable name for clarity

    // --- Image Handling: Convert buffer to Base64 Data URL ---
    if (req.file) {
        console.log(`Received file: ${req.file.originalname}, size: ${req.file.size}, mimetype: ${req.file.mimetype}`);
        // Convert the buffer to a Base64 string
        const base64Image = req.file.buffer.toString('base64');
        // Create the Data URL
        profileImageDataUrl = `data:${req.file.mimetype};base64,${base64Image}`;
        console.log(`Generated Data URL for ${req.file.originalname} (length: ${profileImageDataUrl.length})`);
        // WARNING: Storing large images this way can exceed MongoDB's 16MB document limit and impact performance.
        // Consider cloud storage (Vercel Blob, S3, etc.) for production applications.
    } else {
        console.log("No profile image file received.");
    }
    // --- End Image Handling ---

    if (!name || !role || !email) {
      console.log("Validation failed: Name, role, or email missing.");
      return res.status(400).json({ error: "Name, role, and email are required" });
    }

    const parseStringToArray = (str) => (typeof str === 'string' && str.length > 0 ? str.split(",").map((item) => item.trim()) : []);

    const memberData = {
      name, role, email,
      profileImage: profileImageDataUrl, // Store the Data URL string or null
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
    console.log("Member data prepared for saving.");

    // Check for existing members (optional, based on unique fields)
    const existingMemberByEmail = await Member.findOne({ email: memberData.email });
    if (existingMemberByEmail) {
        console.log(`Conflict: Email ${memberData.email} exists.`);
        return res.status(409).json({ error: "Member with this Email already exists." });
    }
    if (memberData.rollNumber) {
        const existingMemberByRoll = await Member.findOne({ rollNumber: memberData.rollNumber });
        if (existingMemberByRoll) {
            console.log(`Conflict: Roll number ${memberData.rollNumber} exists.`);
            return res.status(409).json({ error: "Member with this Roll Number already exists." });
        }
    }

    console.log("Creating and saving new member...");
    const newMember = new Member(memberData);
    await newMember.save();
    console.log(`New member saved successfully: ${newMember._id}`);
    // Return the created member (including the profileImage Data URL)
    res.status(201).json(newMember);

  } catch (err) {
     console.error("!!! Error POST /api/members:", err);
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
     res.status(500).json({ error: "An internal server error occurred.", details: err.message });
  }
});

console.log("Route definitions complete.");

// --- Export the app for Vercel ---
console.log("Exporting app for Vercel...");
module.exports = app;
console.log("--- Vercel Function Initialization Complete ---");