import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react"; 

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log the error for debugging purposes
    console.error(
      `404 Error: User attempted to access non-existent route: ${location.pathname}`
    );
  }, [location.pathname]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { delay: 0.2, type: "spring", stiffness: 120, damping: 15 } 
    },
  };

  const iconVariants = {
    hidden: { scale: 0.5, rotate: -15 },
    visible: { 
      scale: 1, 
      rotate: 0, 
      transition: { delay: 0.3, type: "spring", stiffness: 150 } 
    },
  };

  const textVariants = (delay: number) => ({
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay, duration: 0.4 } },
  });

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.6, duration: 0.3 } },
  };

  return (
    <motion.div 
      className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-16" // Adjusted min-height, gradient background
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-center max-w-lg w-full p-8 sm:p-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700" // Enhanced card styling: larger padding, rounded-xl, border
        variants={cardVariants}
      >
        <motion.div
          variants={iconVariants}
          className="mb-6 text-team-indigo dark:text-team-blue" 
        >
          {/* Increased icon size slightly */}
          <SearchX size={72} className="mx-auto drop-shadow-md" /> 
        </motion.div>

        <motion.h1 
          className="text-6xl font-extrabold text-team-indigo dark:text-team-blue mb-3 tracking-tight" // Larger font, bolder, tracking
          variants={textVariants(0.4)}
        >
          404
        </motion.h1>
        <motion.h2 
          className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-5" // Increased size, adjusted margin
          variants={textVariants(0.5)}
        >
          Page Not Found
        </motion.h2>
        <motion.p 
          className="text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed" // Larger text, more line spacing
          variants={textVariants(0.6)}
        >
          Oops! The page you're looking for at{' '}
          <code className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-base font-medium text-red-700 dark:text-red-400 break-all"> {/* Improved code styling */}
            {location.pathname}
          </code>
          {' '}doesn't seem to exist. It might have been moved or deleted.
        </motion.p>
        <motion.div variants={buttonVariants}>
          <Link
            to="/"
            // Enhanced button styling with focus ring
            className="inline-flex items-center justify-center py-3 px-8 rounded-lg bg-team-indigo text-white text-base font-semibold hover:bg-team-purple transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-team-purple dark:focus:ring-offset-gray-800"
          >
            <Home className="mr-2 h-5 w-5" /> {/* Slightly larger icon */}
            Go Back Home
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;