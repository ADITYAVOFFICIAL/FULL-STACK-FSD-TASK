console.log("--- Vercel Function Start ---");

const express = require("express");
console.log("Express loaded.");
const mongoose = require("mongoose");
console.log("Mongoose loaded.");
const cors = require("cors");
console.log("CORS loaded.");
const multer = require("multer");
console.log("Multer loaded.");
const path = require("path");
console.log("Path loaded.");

const app = express();
console.log("Express app initialized.");

// Middleware
app.use(cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow necessary headers
  }));
console.log("CORS middleware configured.");
app.use(express.json());
console.log("JSON middleware configured.");

// MongoDB Connection - Hardcoded (Not Recommended for Security)
// Using the provided connection string
const MONGODB_URI_HARDCODED = "mongodb+srv://adityaverma:aditv1234Aa@devconnectcluster.paguw.mongodb.net/?retryWrites=true&w=majority&appName=DevConnectCluster";
console.log("Attempting MongoDB connection...");

mongoose
  .connect(MONGODB_URI_HARDCODED, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection successful."))
  .catch((err) => console.error("!!! MongoDB connection error:", err)); // Log errors clearly

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
console.log("Member model defined.");

// File Upload Configuration - Use memoryStorage for Vercel
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

// API Routes
app.get("/api/members", async (req, res) => {
  console.log(">>> Request received for GET /api/members"); // Log route entry
  try {
    const members = await Member.find();
    console.log(`Found ${members.length} members.`); // Log success
    res.json(members);
  } catch (err) {
    console.error("!!! Error in GET /api/members:", err); // Log errors in route
    res.status(500).json({ error: err.message });
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
        res.status(500).json({ error: err.message });
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
        // **IMPORTANT**: Add cloud storage upload logic here
        // profileImageUrl = await uploadToCloudStorage(req.file.buffer, req.file.originalname);
        profileImageUrl = `placeholder_image_path_for_${req.file.originalname}`; // Replace this
        console.log(`Placeholder profile image URL set: ${profileImageUrl}`);
    } else {
        console.log("No profile image file received in request.");
    }

    if (!name || !role || !email) {
      console.log("Validation failed: Name, role, or email missing.");
      return res.status(400).json({ error: "Name, role, and email are required" });
    }

    const parseStringToArray = (str) => (str ? str.split(",").map((item) => item.trim()) : []);
    console.log("Parsing array fields (hobbies, certificates, projects)...");

    const memberData = {
      name, role, email,
      profileImage: profileImageUrl,
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

    if (memberData.rollNumber) {
        console.log(`Checking for existing member with roll number: ${memberData.rollNumber}`);
        const existingMember = await Member.findOne({ rollNumber: memberData.rollNumber });
        if (existingMember) {
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
     console.error("!!! Error adding member in POST /api/members:", err); // Log the actual error
     if (err instanceof multer.MulterError) {
         console.error("Multer error details:", err);
         return res.status(400).json({ error: `File upload error: ${err.message}` });
     } else if (err.message.includes("Invalid file type")) {
         return res.status(400).json({ error: "Invalid file type." });
     } else if (err.name === 'ValidationError') {
         console.error("Mongoose validation error details:", err.errors);
         return res.status(400).json({ error: `Validation Error: ${err.message}` });
     }
     res.status(500).json({ error: err.message || "An internal server error occurred while adding the member." });
  }
});

console.log("Route definitions complete.");

// Export the app for Vercel's Node.js runtime
console.log("Exporting app for Vercel...");
module.exports = app;
console.log("--- Vercel Function Initialization Complete ---"); // Log successful setup