// --- Vercel Function Start ---
console.log("--- Vercel Function Start ---");

const express = require("express");
console.log("Express loaded.");
const mongoose = require("mongoose");
console.log("Mongoose loaded.");
const cors = require("cors");
console.log("CORS loaded.");
const multer = require("multer");
console.log("Multer loaded.");
// const path = require("path"); // Removed: path module was not used

const app = express();
console.log("Express app initialized.");

// --- Middleware ---
// Allow requests from any origin - Consider restricting in production
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log("CORS middleware configured.");
app.use(express.json());
console.log("JSON middleware configured.");

// --- MongoDB Connection ---
// Hardcoded URI (Strongly Recommended: Use Environment Variables)
const MONGODB_URI_HARDCODED = "mongodb+srv://adityaverma:aditv1234Aa@devconnectcluster.paguw.mongodb.net/?retryWrites=true&w=majority&appName=DevConnectCluster";
console.log("Attempting MongoDB connection...");

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI_HARDCODED, {
    // useNewUrlParser: true, // Deprecated in Mongoose 6+
    // useUnifiedTopology: true, // Deprecated in Mongoose 6+
  })
  .then(() => console.log("MongoDB connection successful."))
  .catch((err) => console.error("!!! MongoDB connection error:", err)); // Log errors clearly

// --- Member Model ---
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Added unique constraint for email
  phone: { type: String },
  department: { type: String },
  rollNumber: { type: String, unique: true, sparse: true }, // Added unique constraint, sparse allows nulls
  year: { type: String },
  hobbies: { type: [String] },
  internship: { type: String },
  certificates: { type: [String] },
  projects: { type: [String] },
  aboutYou: { type: String },
  aim: { type: String },
  joinDate: { type: Date, default: Date.now },
  profileImage: { type: String }, // Store URL from cloud storage
});

const Member = mongoose.model("Member", memberSchema);
console.log("Member model defined.");

// --- File Upload Configuration ---
// Use memoryStorage for Vercel's serverless environment
const storage = multer.memoryStorage();
console.log("Multer using memoryStorage.");

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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
console.log("Multer configured with storage, limits, and fileFilter.");

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
        // Handle potential CastError for invalid ID format
        if (err.name === 'CastError') {
             return res.status(400).json({ error: "Invalid member ID format" });
        }
        res.status(500).json({ error: "Failed to fetch member", details: err.message });
    }
});

app.post("/api/members", upload.single("profileImage"), async (req, res) => {
  console.log(">>> Request received for POST /api/members");
  try {
    const {
      name, role, email, phone, department,
      rollNumber, year, hobbies, internship,
      certificates, projects, aboutYou, aim,
    } = req.body;
    console.log("Request body parsed:", { name, role, email, rollNumber }); // Log key fields

    let profileImageUrl = null;
    if (req.file) {
        console.log(`Received file via Multer: ${req.file.originalname}, size: ${req.file.size} bytes, buffer exists: ${!!req.file.buffer}`);
        // ** Vercel Serverless: Upload req.file.buffer to Cloud Storage (e.g., Vercel Blob, S3) here **
        // Example placeholder - replace with actual upload logic
        // profileImageUrl = await uploadToCloudStorage(req.file.buffer, `profile_${Date.now()}_${req.file.originalname}`);
        profileImageUrl = `placeholder_image_path_for_${req.file.originalname}`; // Replace this
        console.log(`Placeholder profile image URL set: ${profileImageUrl}`);
    } else {
        console.log("No profile image file received in request.");
    }

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
      profileImage: profileImageUrl, // Will be null if no file, or the cloud URL
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
    console.log("Member data prepared for saving:", memberData);

    // Check for existing member (using email or rollNumber if unique constraints are set)
    // Using email as it's more likely to be unique and required
    console.log(`Checking for existing member with email: ${memberData.email}`);
    const existingMemberByEmail = await Member.findOne({ email: memberData.email });
    if (existingMemberByEmail) {
        console.log(`Conflict: Member with email ${memberData.email} already exists.`);
        return res.status(409).json({ error: "Member with this Email already exists." });
    }
    console.log(`No existing member found with email: ${memberData.email}`);

    // Optionally check roll number if provided and intended to be unique
    if (memberData.rollNumber) {
        console.log(`Checking for existing member with roll number: ${memberData.rollNumber}`);
        const existingMemberByRoll = await Member.findOne({ rollNumber: memberData.rollNumber });
        if (existingMemberByRoll) {
            console.log(`Conflict: Member with roll number ${memberData.rollNumber} already exists.`);
            return res.status(409).json({ error: "Member with this Roll Number already exists." });
        }
        console.log(`No existing member found with roll number: ${memberData.rollNumber}`);
    }


    console.log("Creating new Member instance...");
    const newMember = new Member(memberData);
    console.log("Attempting to save new member...");
    await newMember.save();
    console.log(`New member saved successfully with ID: ${newMember._id}`);
    res.status(201).json(newMember);

  } catch (err) {
     console.error("!!! Error adding member in POST /api/members:", err);
     // Handle Multer errors
     if (err instanceof multer.MulterError) {
         console.error("Multer error details:", err);
         return res.status(400).json({ error: `File upload error: ${err.message}` });
     }
     // Handle custom file filter error
     else if (err.message.includes("Invalid file type")) {
         return res.status(400).json({ error: "Invalid file type. Only JPEG, PNG, GIF allowed." });
     }
     // Handle Mongoose validation errors
     else if (err.name === 'ValidationError') {
         console.error("Mongoose validation error details:", err.errors);
         // Extract a more user-friendly message if possible
         const messages = Object.values(err.errors).map(e => e.message);
         return res.status(400).json({ error: `Validation Error: ${messages.join(', ')}` });
     }
     // Handle potential duplicate key errors (if unique constraints are violated)
      else if (err.code === 11000) { // MongoDB duplicate key error code
        console.error("Duplicate key error:", err.keyValue);
        // Determine which field caused the error
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ error: `An account with this ${field} already exists.` });
    }
     // Generic server error
     res.status(500).json({ error: "An internal server error occurred while adding the member.", details: err.message });
  }
});

console.log("Route definitions complete.");

// --- Export the app for Vercel ---
console.log("Exporting app for Vercel...");
module.exports = app;
console.log("--- Vercel Function Initialization Complete ---"); // Log successful setup