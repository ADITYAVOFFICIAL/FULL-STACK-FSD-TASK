import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { API_URL } from "@/constants"; // Still needed for API calls
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";

// Define TypeScript interfaces
interface Member {
  _id: string;
  name: string;
  role: string;
  profileImage: string | null; // Allow null for cases where image wasn't uploaded/saved
  department?: string;
  email: string;
}

const ViewMembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Removed getSecureUrl as it's not needed for Blob URLs

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch members from the API
        const response = await axios.get<{ data: Member[] } | Member[]>(`${API_URL}/api/members`);
        // Handle potential differences in API response structure (e.g., if wrapped in a 'data' key)
        const fetchedMembers = Array.isArray(response.data) ? response.data : response.data.data;
        setMembers(fetchedMembers || []);
      } catch (error: unknown) {
        console.error("Error fetching members:", error);
        setError(
          "Failed to load team members. Please check your connection or try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      },
    },
  };

  if (loading) {
    return <LoadingSpinner message="Loading team members..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorDisplay
          message={error}
          // Provide a way to retry fetching
          onRetry={() => window.location.reload()} // Simple reload, or implement fetchMembers again
        />
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Team Members</h1>
        <Link
          to="/add-member"
          className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm" // Updated colors
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Link>
      </div>

      {members.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 text-center max-w-lg mx-auto border dark:border-gray-700" // Added border
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">No team members found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding your first team member.</p>
          <Link
            to="/add-member"
            className="inline-flex items-center justify-center py-3 px-6 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm" // Updated colors
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add First Member
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {members.map((member) => (
              <motion.div
                key={member._id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border dark:border-gray-700 group transition-shadow hover:shadow-lg" // Refined card style
                variants={itemVariants}
                transition={{ duration: 0.2 }}
              >
                <div className="relative overflow-hidden h-52 bg-gray-200 dark:bg-gray-700"> {/* Added background color */}
                  <img
                    // --- CORRECTED IMAGE SRC ---
                    // Use the absolute Blob URL directly if it exists, otherwise use placeholder
                    src={member.profileImage || '/placeholder.svg'}
                    alt={`${member.name}'s profile`}
                    className="w-full h-full object-cover object-center transition duration-300 group-hover:scale-105"
                    // onError handles cases where the Blob URL is broken/invalid
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                      (e.target as HTMLImageElement).alt = 'Placeholder Image';
                    }}
                    loading="lazy" // Added lazy loading
                  />
                  {/* Optional overlay removed for cleaner look, can be added back if desired */}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate" title={member.name}> {/* Added truncate */}
                    {member.name || "Unnamed Member"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 truncate" title={member.role}>{member.role || "No role specified"}</p>

                  {member.department && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 truncate" title={member.department}>
                      Dept: {member.department}
                    </p>
                  )}

                  <Link
                    to={`/member/${member._id}`}
                    className="block w-full text-center py-2 px-3 bg-gray-100 hover:bg-indigo-600 hover:text-white dark:bg-gray-700 dark:hover:bg-indigo-600 dark:text-gray-200 dark:hover:text-white rounded-md text-sm font-medium transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default ViewMembersPage;