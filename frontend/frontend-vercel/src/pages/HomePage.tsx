
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserPlus, ArrowRight, Star, CheckCircle, ShieldCheck } from "lucide-react";
import { TEAM_NAME } from "@/constants";

const HomePage = () => {
  // Animation variants for staggered animations - toned down
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] // Custom easings for more natural feel
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-br from-team-blue to-team-indigo dark:from-indigo-900 dark:to-purple-900 py-16 md:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="space-y-6"
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                variants={item}
              >
                Manage Your Team with Ease
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed"
                variants={item}
              >
                Welcome to <span className="font-semibold">{TEAM_NAME}</span> – the modern solution for team member management.
                Add, view, and manage your team members all in one place.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={item}
              >
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link 
                    to="/add-member" 
                    // Use inline-flex consistently, adjust padding/margins for spacing
                    className="btn-gradient inline-flex items-center justify-center px-6 py-3" 
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    <span>Add New Member</span>
                    {/* Keep the motion div for animation, adjust margin if needed */}
                    <motion.div
                      className="ml-2" // Adjusted margin, removed translate
                      whileHover={{ 
                        translateX: 3, // Slightly increase translation on hover
                        transition: { duration: 0.2, ease: "easeInOut" }
                      }}
                      // Added initial state to avoid layout shift on load
                      initial={{ translateX: 0 }} 
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link 
                    to="/view-members" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-team-blue dark:bg-indigo-950 dark:text-indigo-300 font-medium rounded-md hover:bg-gray-100 dark:hover:bg-indigo-900 transition-colors shadow-md"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    <span>View All Members</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100"
              variants={fadeInUp}
            >
              Features & Benefits
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Easy Member Management",
                  description: "Add, view and manage your team members with an intuitive interface.",
                  icon: <Users className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
                },
                {
                  title: "Detailed Profiles",
                  description: "Create comprehensive profiles with all the important information.",
                  icon: <Star className="h-8 w-8 text-amber-500 dark:text-amber-400" />,
                },
                {
                  title: "Modern Interface",
                  description: "Beautiful and responsive design that works on all devices.",
                  icon: <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400" />,
                },
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={fadeInUp}
                  whileHover={{ 
                    y: -5,
                    transition: { type: "spring", stiffness: 300, damping: 15 }
                  }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-16 text-center"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/add-member"
                  className="inline-flex items-center justify-center px-6 py-3 bg-team-indigo text-white font-medium rounded-md hover:bg-team-purple transition-colors shadow-md"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
