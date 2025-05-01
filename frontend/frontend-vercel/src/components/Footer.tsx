import { motion } from "framer-motion";
import { TEAM_NAME } from "@/constants";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="container mx-auto px-4">
        {/* Adjusted grid layout for better responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Section - Spans 2 columns on small screens */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-white mb-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Heart className="h-6 w-6 text-team-purple" fill="currentColor" />
              </motion.div>
              <span>{TEAM_NAME}</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Manage your team members with ease and elegance. Built with care for teams of all sizes.
            </p>
          </div>
          
          {/* Quick Links - Centered on larger screens */}
          <div className="lg:justify-self-center">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3"> {/* Increased spacing slightly */}
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/add-member" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Add Member
                </Link>
              </li>
              <li>
                <Link to="/view-members" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  View Members
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social Media - Centered on larger screens */}
          <div className="lg:justify-self-center">
            <h3 className="text-lg font-semibold mb-4 text-white">Connect With Us</h3>
            <div className="flex space-x-4">
              <motion.a 
                href="#" // Replace with actual links
                aria-label="GitHub"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-6 w-6" /> {/* Slightly larger icons */}
              </motion.a>
              <motion.a 
                href="#" // Replace with actual links
                aria-label="Twitter"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="h-6 w-6" />
              </motion.a>
              <motion.a 
                href="#" // Replace with actual links
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="h-6 w-6" />
              </motion.a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar - Adjusted responsiveness and alignment */}
        <div className="border-t border-gray-700 dark:border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-gray-400 text-sm mb-2 sm:mb-0">
            &copy; {currentYear} {TEAM_NAME}. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs flex items-center justify-center sm:justify-start gap-1">
            <span>Made with</span> 
            <Heart className="h-3 w-3 text-red-500 inline" fill="currentColor" /> 
            <span>for teams everywhere</span>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;