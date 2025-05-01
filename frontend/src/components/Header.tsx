
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserPlus, Home, Menu, X } from "lucide-react";
import { TEAM_NAME } from "@/constants";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/30 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-team-indigo dark:text-indigo-400">
            <Users className="h-7 w-7" />
            <span>{TEAM_NAME}</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}

            {/* Desktop navigation */}
            {!isMobile && (
              <nav className="flex items-center space-x-1">
                <NavLinks />
              </nav>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobile && (
          <motion.nav
            initial={false}
            animate={isMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            className={`${isMenuOpen ? "py-3" : "py-0"} overflow-hidden`}
          >
            <div className="flex flex-col space-y-2">
              <NavLinks onClick={() => setIsMenuOpen(false)} />
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

// Extracted NavLinks component to avoid duplication
const NavLinks = ({ onClick }: { onClick?: () => void }) => (
  <>
    <NavLink 
      to="/" 
      className={({ isActive }) => 
        `flex items-center px-4 py-2 rounded-md transition-colors ${
          isActive 
            ? "bg-team-indigo/10 text-team-indigo dark:bg-indigo-500/20 dark:text-indigo-300 font-medium" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
      end
      onClick={onClick}
    >
      <Home className="mr-2 h-4 w-4" />
      <span>Home</span>
    </NavLink>
    
    <NavLink 
      to="/add-member" 
      className={({ isActive }) => 
        `flex items-center px-4 py-2 rounded-md transition-colors ${
          isActive 
            ? "bg-team-indigo/10 text-team-indigo dark:bg-indigo-500/20 dark:text-indigo-300 font-medium" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
      onClick={onClick}
    >
      <UserPlus className="mr-2 h-4 w-4" />
      <span>Add Member</span>
    </NavLink>
    
    <NavLink 
      to="/view-members" 
      className={({ isActive }) => 
        `flex items-center px-4 py-2 rounded-md transition-colors ${
          isActive 
            ? "bg-team-indigo/10 text-team-indigo dark:bg-indigo-500/20 dark:text-indigo-300 font-medium" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
      onClick={onClick}
    >
      <Users className="mr-2 h-4 w-4" />
      <span>View Members</span>
    </NavLink>
  </>
);

export default Header;
