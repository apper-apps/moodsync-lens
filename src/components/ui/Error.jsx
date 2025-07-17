import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        className="text-center max-w-md mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-error to-secondary rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name="AlertCircle" className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
          Something went wrong
        </h2>
        
        <p className="text-gray-600 font-body mb-6 leading-relaxed">
          {message || "We encountered an error while loading your mood board. Please try again."}
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
            className="w-full text-gray-600 hover:text-gray-900"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Error;