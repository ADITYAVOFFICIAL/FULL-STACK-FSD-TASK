import { Link } from "react-router-dom"

const HomePage = () => {
  // You can replace this with your actual team name
  const teamName = "Awesome Team"

  return (
    <div className="home-container">
      <h1 className="home-title">{teamName}</h1>
      <p className="home-subtitle">Welcome to our Team Members Management Application</p>

      <div className="card">
        <div className="card-content">
          <h2>About Our Team</h2>
          <p>
            This application helps you manage your team members efficiently. You can add new members, view all team
            members, and check individual member details.
          </p>

          <div className="home-buttons">
            <Link to="/add-member" className="btn btn-large">
              Add Member
            </Link>
            <Link to="/view-members" className="btn btn-secondary btn-large">
              View Members
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
