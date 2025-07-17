import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const FloatingToolbar = ({ 
  onUpload, 
  onZoomIn, 
  onZoomOut, 
  onFitToScreen, 
  onShare,
  selectedCount = 0,
  onDeleteSelected,
  zoomLevel = 1
}) => {
  const tools = [
    {
      icon: "ImagePlus",
      label: "Add Image",
      onClick: onUpload,
      variant: "gradient"
    },
    {
      icon: "ZoomIn",
      label: "Zoom In",
      onClick: onZoomIn,
      disabled: zoomLevel >= 3
    },
    {
      icon: "ZoomOut",
      label: "Zoom Out",
      onClick: onZoomOut,
      disabled: zoomLevel <= 0.5
    },
    {
      icon: "Maximize",
      label: "Fit to Screen",
      onClick: onFitToScreen
    },
    {
      icon: "Share2",
      label: "Share",
      onClick: onShare,
      variant: "accent"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
    >
      <Card variant="glass" className="p-2">
        <div className="flex items-center gap-2">
          {tools.map((tool, index) => (
            <Button
              key={tool.icon}
              variant={tool.variant || "ghost"}
              size="icon"
              onClick={tool.onClick}
              disabled={tool.disabled}
              className={`relative ${
                tool.variant === "gradient" 
                  ? "bg-gradient-to-r from-primary to-accent text-white" 
                  : tool.variant === "accent"
                  ? "bg-accent text-white hover:bg-accent/90"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={tool.label}
            >
              <ApperIcon name={tool.icon} className="w-5 h-5" />
            </Button>
          ))}
          
          {selectedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200"
            >
              <span className="text-sm font-medium text-gray-700 font-body">
                {selectedCount} selected
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDeleteSelected}
                className="text-error hover:bg-error/10"
                title="Delete Selected"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default FloatingToolbar;