import { Link, NavLink } from "react-router-dom"

const Header = () => {
  // You can replace this with your actual team name
  const teamName = "Awesome Team"

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          {teamName}
        </Link>

        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
          <NavLink to="/add-member" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Add Member
          </NavLink>
          <NavLink to="/view-members" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            View Members
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
