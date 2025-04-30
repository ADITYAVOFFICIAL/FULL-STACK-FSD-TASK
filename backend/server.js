const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/team-management", {
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
  joinDate: { type: Date, default: Date.now },
  profileImage: { type: String },
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
    const { name, role, email, phone, department } = req.body
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null

    if (!name || !role || !email || !profileImage) {
      return res.status(400).json({ error: "Name, role, email, and profile image are required" })
    }

    const newMember = new Member({
      name,
      role,
      email,
      phone,
      department,
      profileImage,
    })

    const savedMember = await newMember.save()
    res.status(201).json(savedMember)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
