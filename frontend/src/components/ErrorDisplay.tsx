
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => {
  return (
    <motion.div
      className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-100 p-2 rounded-full">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
      </div>
      
      <p className="mb-6 text-gray-600">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorDisplay;
