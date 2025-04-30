"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const MemberDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/members/${id}`)
        setMember(response.data)
      } catch (error) {
        console.error("Error fetching member details:", error)
        setError("Failed to load member details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMemberDetails()
  }, [id])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading member details...</p>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-content">
            <h2>Error</h2>
            <p>{error || "Member not found"}</p>
            <button className="btn" onClick={() => navigate("/view-members")}>
              Back to Members
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <button className="btn btn-secondary" style={{ marginBottom: "20px" }} onClick={() => navigate("/view-members")}>
        Back to Members
      </button>

      <div className="card">
        <div className="card-content">
          <div className="member-details">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
              <img
                src={`http://localhost:5000${member.profileImage}`}
                alt={`${member.name}'s profile`}
                className="member-img"
              />
              <h1 style={{ marginTop: "15px" }}>{member.name}</h1>
              <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>{member.role}</p>
            </div>

            <div className="member-info">
              <div className="member-info-label">Email:</div>
              <div>{member.email}</div>

              {member.phone && (
                <>
                  <div className="member-info-label">Phone:</div>
                  <div>{member.phone}</div>
                </>
              )}

              {member.department && (
                <>
                  <div className="member-info-label">Department:</div>
                  <div>{member.department}</div>
                </>
              )}

              <div className="member-info-label">Join Date:</div>
              <div>{new Date(member.joinDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberDetailsPage
