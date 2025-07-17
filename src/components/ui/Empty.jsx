import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ title, description, actionText, onAction, icon = "ImagePlus" }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-background">
      <motion.div
        className="text-center max-w-md mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name={icon} className="w-12 h-12 text-primary" />
        </motion.div>
        
        <h3 className="text-2xl font-display font-semibold gradient-text mb-4">
          {title || "No images yet"}
        </h3>
        
        <p className="text-gray-600 font-body mb-6 leading-relaxed">
          {description || "Start building your mood board by adding your first image. Drag and drop files or click to browse."}
        </p>
        
        {onAction && (
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionText || "Add Image"}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default Empty;