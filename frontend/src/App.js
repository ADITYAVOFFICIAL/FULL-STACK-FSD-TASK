import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AddMemberPage from "./pages/AddMemberPage"
import ViewMembersPage from "./pages/ViewMembersPage"
import MemberDetailsPage from "./pages/MemberDetailsPage"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-member" element={<AddMemberPage />} />
            <Route path="/view-members" element={<ViewMembersPage />} />
            <Route path="/member/:id" element={<MemberDetailsPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Student Team Management. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
