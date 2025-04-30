"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const AddMemberPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    department: "",
  })
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.role || !formData.email || !profileImage) {
      alert("Please fill in all required fields and upload a profile image.")
      return
    }

    setIsLoading(true)

    try {
      // Create form data for file upload
      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("role", formData.role)
      submitData.append("email", formData.email)
      submitData.append("phone", formData.phone || "")
      submitData.append("department", formData.department || "")
      if (profileImage) {
        submitData.append("profileImage", profileImage)
      }

      // Send data to backend
      const response = await axios.post("http://localhost:5000/api/members", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      alert("Member added successfully!")

      // Reset form
      setFormData({ name: "", role: "", email: "", phone: "", department: "" })
      setProfileImage(null)
      setImagePreview(null)

      // Redirect to view members page
      navigate("/view-members")
    } catch (error) {
      console.error("Error adding member:", error)
      alert("Failed to add member. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Add Team Member</h1>
      <p>Fill in the details to add a new team member</p>

      <div className="card">
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Role *
              </label>
              <input
                type="text"
                id="role"
                name="role"
                className="form-control"
                placeholder="Developer"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                className="form-control"
                placeholder="Engineering"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="profileImage" className="form-label">
                Profile Image *
              </label>

              {imagePreview && (
                <img src={imagePreview || "/placeholder.svg"} alt="Profile preview" className="image-preview" />
              )}

              <label htmlFor="profileImage" className="form-file-label">
                {imagePreview ? "Change Image" : "Click to upload or drag and drop"}
                <p>PNG, JPG or JPEG (MAX. 2MB)</p>
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                className="form-file-input"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Adding Member..." : "Add Member"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddMemberPage
