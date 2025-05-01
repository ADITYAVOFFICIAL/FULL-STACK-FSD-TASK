import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, Mail, Phone, CalendarDays, Building, BookOpen, GraduationCap, Award, Briefcase, Target, UserCircle } from "lucide-react";
import { API_URL } from "@/constants"; // Still needed for API calls
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define TypeScript interfaces
interface Member {
  _id: string;
  name: string;
  role: string;
  email: string;
  profileImage: string | null; // Allow null
  phone?: string;
  department?: string;
  rollNumber?: string;
  year?: string;
  joinDate?: string;
  hobbies?: string[];
  internship?: string;
  certificates?: string[];
  projects?: string[];
  aboutYou?: string;
  aim?: string;
}

// Helper component for info items in the grid
const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined | null }) => { // Allow null value
  if (!value) return null;
  return (
    <Card className="bg-card/50 dark:bg-card/30 border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 flex items-center space-x-3">
        <Icon className="h-5 w-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for section cards
const SectionCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <Card className="overflow-hidden border shadow-sm">
    <CardHeader className="flex flex-row items-center space-x-3 bg-muted/30 dark:bg-muted/20 p-4 border-b">
      <span className="bg-primary/10 p-1.5 rounded-md">
        <Icon className="h-5 w-5 text-primary" />
      </span>
      <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-5">
      {children}
    </CardContent>
  </Card>
);

const MemberDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!id) {
        setError("No member ID provided.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Member>(`${API_URL}/api/members/${id}`);
        setMember(response.data);
      } catch (err: unknown) {
        console.error("Error fetching member details:", err);
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 404) {
            setError(`Member with ID ${id} not found.`);
          } else {
             setError(`Error: ${err.response.data?.error || err.message}`);
          }
        } else {
          setError("Failed to load member details. Please check the connection or try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [id]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  // Helper to render badge list items
  const renderBadgeList = (items?: string[]) => {
    if (!items || items.length === 0) {
      return <div className="text-muted-foreground italic text-sm">N/A</div>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            {item}
          </Badge>
        ))}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading member details..." />;
  }

  if (error || !member) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/view-members")}
          className="inline-flex items-center mb-6 text-primary hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </button>
        <ErrorDisplay message={error || "Member data could not be loaded."} />
      </div>
    );
  }

  // --- CORRECTED IMAGE SRC (used directly below) ---
  // No need for a separate variable combining with API_URL

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <button
        onClick={() => navigate("/view-members")}
        className="inline-flex items-center mb-6 text-primary hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Members
      </button>

      <motion.div className="max-w-5xl mx-auto" variants={itemVariants}>
        <Card className="overflow-hidden shadow-lg border">
          {/* Header / Profile Banner */}
          <div className="relative h-48 md:h-56 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800">
            {/* Placeholder for banner content */}
          </div>

          {/* Profile Content */}
          <div className="relative px-4 md:px-8 pb-8">
            {/* Avatar */}
            <div className="absolute left-4 md:left-8 -top-12 md:-top-16 transform">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-lg">
                <AvatarImage
                  // --- CORRECTED IMAGE SRC ---
                  // Use the absolute Blob URL directly from member.profileImage
                  // AvatarImage/AvatarFallback handles null/undefined gracefully
                  src={member.profileImage ?? undefined} // Pass undefined if null
                  alt={`${member.name}'s profile`}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl md:text-4xl bg-primary text-primary-foreground">
                  {/* Display first initial of name */}
                  {member.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Basic Info */}
            <div className="pt-16 md:pt-4 md:ml-40 min-h-[8rem] flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{member.name}</h1>
              <p className="text-primary font-medium text-lg mt-1">{member.role || "Team Member"}</p>
            </div>

            {/* Contact & Basic Details Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
              variants={itemVariants}
            >
              <InfoItem icon={Mail} label="Email" value={member.email} />
              <InfoItem icon={Phone} label="Phone" value={member.phone} />
              <InfoItem icon={Building} label="Department" value={member.department} />
              <InfoItem icon={GraduationCap} label="Year / Batch" value={member.year} />
              <InfoItem icon={BookOpen} label="Roll Number" value={member.rollNumber} />
              {member.joinDate && (
                <InfoItem
                  icon={CalendarDays}
                  label="Join Date"
                  value={new Date(member.joinDate).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                />
              )}
            </motion.div>

            {/* Detailed Information */}
            <motion.div
              className="mt-10 space-y-6"
              variants={itemVariants}
            >
              {/* About */}
              {member.aboutYou && (
                <SectionCard icon={UserCircle} title="About">
                  <p className="text-foreground/90 dark:text-foreground/80 whitespace-pre-line text-sm leading-relaxed">
                    {member.aboutYou}
                  </p>
                </SectionCard>
              )}

              {/* Hobbies */}
              {member.hobbies && member.hobbies.length > 0 && (
                <SectionCard icon={Target} title="Hobbies">
                  {renderBadgeList(member.hobbies)}
                </SectionCard>
              )}

              {/* Projects */}
              {member.projects && member.projects.length > 0 && (
                <SectionCard icon={Briefcase} title="Projects">
                  {renderBadgeList(member.projects)}
                </SectionCard>
              )}

              {/* Certificates */}
              {member.certificates && member.certificates.length > 0 && (
                <SectionCard icon={Award} title="Certificates">
                  {renderBadgeList(member.certificates)}
                </SectionCard>
              )}

              {/* Internship */}
              {member.internship && (
                <SectionCard icon={Briefcase} title="Internship Experience">
                   <p className="text-foreground/90 dark:text-foreground/80 whitespace-pre-line text-sm leading-relaxed">
                    {member.internship}
                  </p>
                </SectionCard>
              )}

              {/* Aim / Goal */}
              {member.aim && (
                <SectionCard icon={Target} title="Aim / Goal">
                   <p className="text-foreground/90 dark:text-foreground/80 whitespace-pre-line text-sm leading-relaxed">
                    {member.aim}
                  </p>
                </SectionCard>
              )}
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MemberDetailsPage;