import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { API_URL } from "@/constants";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";

// Define TypeScript interfaces
interface Member {
  _id: string;
  name: string;
  role: string;
  profileImage: string;
  department?: string;
  email: string;
}

const ViewMembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get secure API URL
  const getSecureUrl = useCallback((path: string) => {
    if (!path) return '';
    return path.startsWith('http:') ? path.replace('http:', 'https:') : path;
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/api/members`);
        setMembers(response.data);
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
          onRetry={() => window.location.reload()}
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
          className="inline-flex items-center px-4 py-2 rounded-md bg-team-indigo text-white hover:bg-team-purple transition-colors"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Link>
      </div>

      {members.length === 0 ? (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 text-center max-w-lg mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-200">No team members found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding your first team member.</p>
          <Link
            to="/add-member"
            className="inline-flex items-center justify-center py-3 px-6 rounded-md bg-team-blue text-white font-medium hover:bg-team-indigo transition-colors"
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
                className="team-card group dark:bg-gray-800 dark:border dark:border-gray-700"
                variants={itemVariants}
                // Removed whileHover prop
                transition={{ duration: 0.2 }}
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    // Corrected src: Directly combine API_URL and profileImage path
                    src={member.profileImage ? `${API_URL}${member.profileImage}` : '/placeholder.svg'}
                    alt={`${member.name}'s profile`}
                    className="w-full h-full object-cover object-center transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                      (e.target as HTMLImageElement).alt = 'Placeholder Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white group-hover:text-team-indigo transition-colors">
                    {member.name || "Unnamed Member"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{member.role || "No role specified"}</p>

                  {member.department && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Department: {member.department}
                    </p>
                  )}

                  <Link
                    to={`/member/${member._id}`}
                    className="inline-block w-full text-center py-2 px-3 bg-gray-100 hover:bg-team-indigo hover:text-white dark:bg-gray-700 dark:hover:bg-team-indigo dark:text-gray-200 rounded-md text-sm font-medium transition-colors"
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