const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const app = express()
const PORT = process.env.PORT || 5069

// Middleware
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// MongoDB Connection
mongoose
  .connect("mongodb+srv://adityaverma:aditv1234Aa@devconnectcluster.paguw.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Member Model
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  department: { type: String },
  rollNumber: { type: String }, // Added
  year: { type: String }, // Added
  hobbies: { type: [String] }, // Added - Array of strings
  internship: { type: String }, // Added
  certificates: { type: [String] }, // Added - Array of strings
  projects: { type: [String] }, // Added - Array of strings
  aboutYou: { type: String }, // Added
  aim: { type: String }, // Added
  joinDate: { type: Date, default: Date.now },
  profileImage: { type: String }, // Keep required validation in POST route
})

const Member = mongoose.model("Member", memberSchema)

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error("Only .png, .jpg and .jpeg format allowed!"))
  },
})

// API Routes
app.get("/api/members", async (req, res) => {
  try {
    const members = await Member.find()
    res.json(members)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/members/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
    if (!member) return res.status(404).json({ error: "Member not found" })
    res.json(member)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/api/members", upload.single("profileImage"), async (req, res) => {
  try {
    // Destructure all fields from req.body
    const {
      name, role, email, phone, department,
      rollNumber, // Added
      year, // Added
      hobbies, // Added
      internship, // Added
      certificates, // Added
      projects, // Added
      aboutYou, // Added
      aim, // Added
    } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

    // Basic validation
    if (!name || !role || !email || !profileImage) {
      return res.status(400).json({ error: "Name, role, email, and profile image are required" });
    }

    // Helper to split comma-separated strings
    const parseStringToArray = (str) => (str ? str.split(",").map((item) => item.trim()) : []);

    // Prepare member data, omitting optional fields if they are empty strings
    const memberData = {
      name,
      role,
      email,
      profileImage,
      // Conditionally add fields only if they have a non-empty value
      ...(phone && { phone }),
      ...(department && { department }),
      ...(rollNumber && { rollNumber }), // Only include if rollNumber is not empty
      ...(year && { year }),
      hobbies: parseStringToArray(hobbies),
      ...(internship && { internship }),
      certificates: parseStringToArray(certificates),
      projects: parseStringToArray(projects),
      ...(aboutYou && { aboutYou }),
      ...(aim && { aim }),
    };

    // Explicitly check for duplicate rollNumber before attempting to save
    // This gives a cleaner error than relying solely on the database index error
    if (memberData.rollNumber) {
        const existingMember = await Member.findOne({ rollNumber: memberData.rollNumber });
        if (existingMember) {
            // Return a specific error if a member with this roll number exists
            return res.status(400).json({ error: `A member with roll number '${memberData.rollNumber}' already exists.` });
        }
    }

    const newMember = new Member(memberData);
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (err) {
     // Improve error handling for duplicate keys (E11000)
     if (err.code === 11000 && err.keyPattern && err.keyPattern.rollNumber !== undefined) {
       // Provide a user-friendly message for duplicate roll number
       // Use err.keyValue.rollNumber which holds the duplicate value
       res.status(400).json({ error: `Roll number '${err.keyValue.rollNumber}' already exists. Please use a unique roll number or leave it blank if not applicable.` });
     } else {
       // Handle other potential validation errors or general errors
       console.error("Error saving member:", err); // Log the full error for debugging
       res.status(400).json({ error: err.message || "An error occurred while adding the member." });
     }
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
