"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const ViewMembersPage = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/members")
        setMembers(response.data)
      } catch (error) {
        console.error("Error fetching members:", error)
        setError("Failed to load team members. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading team members...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-content">
            <h2>Error</h2>
            <p>{error}</p>
            <button className="btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Team Members</h1>

      {members.length === 0 ? (
        <div className="card">
          <div className="card-content" style={{ textAlign: "center", padding: "40px 20px" }}>
            <h3>No team members found</h3>
            <p>Get started by adding your first team member.</p>
            <Link to="/add-member" className="btn" style={{ marginTop: "20px" }}>
              Add Member
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {members.map((member) => (
            <div key={member._id} className="card">
              <img
                src={`http://localhost:5000${member.profileImage}`}
                alt={`${member.name}'s profile`}
                className="card-img"
              />
              <div className="card-content">
                <h3 className="card-title">{member.name}</h3>
                <p className="card-text">{member.role}</p>
                <Link to={`/member/${member._id}`} className="btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewMembersPage
