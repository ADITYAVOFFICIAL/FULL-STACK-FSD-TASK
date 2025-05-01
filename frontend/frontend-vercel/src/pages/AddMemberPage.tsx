import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { API_URL } from "@/constants";

// Define TypeScript interfaces
interface FormData {
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  rollNumber: string;
  year: string;
  hobbies: string;
  internship: string;
  certificates: string;
  projects: string;
  aboutYou: string;
  aim: string;
}

interface FormErrors {
  name?: string;
  role?: string;
  email?: string;
  profileImage?: string;
  phone?: string;
  submit?: string;
  [key: string]: string | undefined;
}

const AddMemberPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    role: "",
    email: "",
    phone: "",
    department: "",
    rollNumber: "",
    year: "",
    hobbies: "",
    internship: "",
    certificates: "",
    projects: "",
    aboutYou: "",
    aim: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = "Full Name is required";
    if (!formData.role.trim()) errors.role = "Role is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!profileImage) errors.profileImage = "Profile Image is required";

    // Optional: Add more specific validation if needed (e.g., phone format)

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // Clear general submit error on any change
    if (formErrors.submit) {
        setFormErrors(prev => ({ ...prev, submit: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormErrors(prev => ({ ...prev, profileImage: undefined, submit: undefined })); // Clear image and submit errors

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        setFormErrors(prev => ({ ...prev, profileImage: "Invalid file type. Please use PNG, JPG, or JPEG." }));
        setProfileImage(null);
        setImagePreview(null);
        e.target.value = ""; // Reset file input
        return;
      }

      if (file.size > maxSize) {
        setFormErrors(prev => ({ ...prev, profileImage: "Image size should not exceed 2MB" }));
        setProfileImage(null);
        setImagePreview(null);
        e.target.value = ""; // Reset file input
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(prev => ({ ...prev, submit: undefined })); // Clear previous submit error

    if (!validateForm()) {
      // Focus the first field with error
      const firstErrorKey = Object.keys(formErrors).find(key => formErrors[key]);
      if (firstErrorKey) {
        const errorElement = document.getElementById(firstErrorKey);
        errorElement?.focus();
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setFormErrors(prev => ({ ...prev, submit: "Please fix the errors above." }));
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();

      // Append form data - ensure empty strings are sent if optional fields are empty
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value || "");
      });

      if (profileImage) {
        submitData.append("profileImage", profileImage);
      } else {
        // This case should ideally be caught by validation, but as a safeguard:
        setFormErrors({ submit: "Profile image is missing." });
        setIsLoading(false);
        return;
      }

      await axios.post(`${API_URL}/api/members`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form state
      setFormData({
        name: "", role: "", email: "", phone: "", department: "",
        rollNumber: "", year: "", hobbies: "", internship: "",
        certificates: "", projects: "", aboutYou: "", aim: ""
      });
      setProfileImage(null);
      setImagePreview(null);
      setFormErrors({});

      // Reset the form's native state, including file input
      const form = document.getElementById('member-form') as HTMLFormElement;
      form?.reset();

      // Show success feedback (replace alert in real app)
      alert("Member added successfully!"); // Use a proper Toast notification library
      navigate("/view-members");

    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error)) {
        console.error("Error adding member (Axios):", error.response?.data || error.message);
        // Try to get specific error message from backend response
        errorMessage = error.response?.data?.error || `Network Error: ${error.message}`;
      } else if (error instanceof Error) {
        console.error("Error adding member (Generic):", error.message);
        errorMessage = error.message;
      } else {
        console.error("Error adding member (Unknown):", error);
      }
      setFormErrors({ submit: `Failed to add member: ${errorMessage}` });
      // Scroll to the submit error message
      document.getElementById('submit-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      setIsLoading(false);
    }
  };

  // Variants for animations
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5
      }
    }
  };

  // Helper for input classes with dark mode support
  const getInputClasses = (fieldName: string) => {
    const baseClasses = "form-input w-full rounded-md border bg-white dark:bg-gray-700 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 dark:text-white";
    const errorClasses = "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500";
    const normalClasses = "border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:border-team-blue focus:ring-team-blue";
    return `${baseClasses} ${formErrors[fieldName] ? errorClasses : normalClasses}`;
  };

  // Helper for label classes with dark mode support
  const getLabelClasses = (isRequired: boolean = false) => {
    const baseClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
    const requiredMarker = isRequired ? " after:content-['*'] after:ml-0.5 after:text-red-500" : "";
    return `${baseClasses}${requiredMarker}`;
  };

  // Helper for error message display
  const renderError = (fieldName: string) => {
    return formErrors[fieldName] ?
      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center">
        <AlertCircle className="w-3 h-3 mr-1" /> {formErrors[fieldName]}
      </p> : null;
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-10 max-w-4xl" // Increased vertical padding
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <motion.div variants={formVariants}> {/* Apply stagger effect to form itself */}
        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Add New Team Member</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Fill in the details below to add a new member to the team.</p>

        <form id="member-form" onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg space-y-8"> {/* Increased padding and spacing */}

          {/* Section 1: Basic Info & Image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Increased gap */}
            {/* Image Upload */}
            <div className="md:col-span-1 space-y-3 flex flex-col items-center"> {/* Increased spacing */}
              <label className={getLabelClasses(true)}>Profile Image</label>
              <div className="mt-1 w-full flex flex-col items-center">
                <div className="w-36 h-36 rounded-full bg-gray-100 dark:bg-gray-700 mb-3 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 overflow-hidden shadow-sm">
                  {imagePreview ? (
                    <motion.img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  ) : (
                    <UploadCloud size={48} /> // Slightly larger icon
                  )}
                </div>
                <label
                  htmlFor="profileImage"
                  className="relative cursor-pointer inline-flex justify-center items-center py-2 px-4 rounded-md bg-team-blue text-white hover:bg-team-indigo transition-colors w-full max-w-xs text-sm font-medium" // Added max-width
                >
                  <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
                  <input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    className="sr-only"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">PNG, JPG, JPEG up to 2MB</p>
                {renderError('profileImage')}
              </div>
            </div>

            {/* Basic Info Fields */}
            <div className="md:col-span-2 grid grid-cols-1 gap-y-6"> {/* Consistent gap */}
              <div>
                <label htmlFor="name" className={getLabelClasses(true)}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={getInputClasses('name')}
                  placeholder="e.g., Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? "name-error" : undefined}
                />
                {formErrors.name && <span id="name-error" className="sr-only">{formErrors.name}</span>}
                {renderError('name')}
              </div>

              <div>
                <label htmlFor="role" className={getLabelClasses(true)}>
                  Role / Position
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className={getInputClasses('role')}
                  placeholder="e.g., Software Engineer Lead"
                  value={formData.role}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!formErrors.role}
                  aria-describedby={formErrors.role ? "role-error" : undefined}
                />
                {formErrors.role && <span id="role-error" className="sr-only">{formErrors.role}</span>}
                {renderError('role')}
              </div>

              <div>
                <label htmlFor="email" className={getLabelClasses(true)}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={getInputClasses('email')}
                  placeholder="jane.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!formErrors.email}
                  aria-describedby={formErrors.email ? "email-error" : undefined}
                />
                {formErrors.email && <span id="email-error" className="sr-only">{formErrors.email}</span>}
                {renderError('email')}
              </div>
            </div>
          </div>

          {/* Section Divider */}
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Section 2: Contact & Academic Details */}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 -mb-4">Contact & Academic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="phone" className={getLabelClasses()}>
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={getInputClasses('phone')}
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={!!formErrors.phone}
                aria-describedby={formErrors.phone ? "phone-error" : undefined}
              />
              {formErrors.phone && <span id="phone-error" className="sr-only">{formErrors.phone}</span>}
              {renderError('phone')}
            </div>

            <div>
              <label htmlFor="department" className={getLabelClasses()}>
                Department (Optional)
              </label>
              <input
                type="text"
                id="department"
                name="department"
                className={getInputClasses('department')}
                placeholder="e.g., Computer Science"
                value={formData.department}
                onChange={handleChange}
              />
              {renderError('department')}
            </div>

            <div>
              <label htmlFor="rollNumber" className={getLabelClasses()}>
                Roll Number (Optional)
              </label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                className={getInputClasses('rollNumber')}
                placeholder="e.g., 21CS123"
                value={formData.rollNumber}
                onChange={handleChange}
              />
              {renderError('rollNumber')}
            </div>

            <div>
              <label htmlFor="year" className={getLabelClasses()}>
                Year / Batch (Optional)
              </label>
              <input
                type="text"
                id="year"
                name="year"
                className={getInputClasses('year')}
                placeholder="e.g., 3rd Year, Batch of 2025"
                value={formData.year}
                onChange={handleChange}
              />
              {renderError('year')}
            </div>
          </div>

          {/* Section Divider */}
          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Section 3: Additional Information */}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 -mb-4">Additional Information</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="hobbies" className={getLabelClasses()}>
                Hobbies (Optional, comma-separated)
              </label>
              <input
                type="text"
                id="hobbies"
                name="hobbies"
                className={getInputClasses('hobbies')}
                placeholder="e.g., Reading, Coding, Hiking, Photography"
                value={formData.hobbies}
                onChange={handleChange}
              />
              {renderError('hobbies')}
            </div>

            <div>
              <label htmlFor="internship" className={getLabelClasses()}>
                Internship Experience (Optional)
              </label>
              <textarea
                id="internship"
                name="internship"
                className={getInputClasses('internship')}
                placeholder="Describe relevant internship experiences..."
                value={formData.internship}
                onChange={handleChange}
                rows={3}
              />
              {renderError('internship')}
            </div>

            <div>
              <label htmlFor="certificates" className={getLabelClasses()}>
                Certificates (Optional, comma-separated)
              </label>
              <input
                type="text"
                id="certificates"
                name="certificates"
                className={getInputClasses('certificates')}
                placeholder="e.g., AWS Certified Developer, Google Cloud Certified"
                value={formData.certificates}
                onChange={handleChange}
              />
              {renderError('certificates')}
            </div>

            <div>
              <label htmlFor="projects" className={getLabelClasses()}>
                Key Projects (Optional, comma-separated titles)
              </label>
              <input
                type="text"
                id="projects"
                name="projects"
                className={getInputClasses('projects')}
                placeholder="e.g., Portfolio Website, Task Manager App, E-commerce Platform"
                value={formData.projects}
                onChange={handleChange}
              />
              {renderError('projects')}
            </div>

            <div>
              <label htmlFor="aboutYou" className={getLabelClasses()}>
                About You (Optional)
              </label>
              <textarea
                id="aboutYou"
                name="aboutYou"
                className={getInputClasses('aboutYou')}
                placeholder="Write a brief description about yourself, your skills, and interests..."
                value={formData.aboutYou}
                onChange={handleChange}
                rows={4}
              />
              {renderError('aboutYou')}
            </div>

            <div>
              <label htmlFor="aim" className={getLabelClasses()}>
                Aim / Goal (Optional)
              </label>
              <textarea
                id="aim"
                name="aim"
                className={getInputClasses('aim')}
                placeholder="What are your future aspirations or goals?"
                value={formData.aim}
                onChange={handleChange}
                rows={3}
              />
              {renderError('aim')}
            </div>
          </div>

          {/* Submit Button & Error Area */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col items-end">
            {/* General Submit Error */}
            <div id="submit-error" className="w-full mb-3 text-right">
              {renderError('submit')}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center py-2.5 px-6 rounded-md bg-team-indigo text-white font-medium hover:bg-team-purple transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed dark:disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Member...
                </>
              ) : (
                "Add Member"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddMemberPage;