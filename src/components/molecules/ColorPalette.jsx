import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { copyToClipboard } from "@/utils/helpers";

const ColorPalette = ({ colors, title = "Color Palette" }) => {
  const handleColorClick = async (color) => {
    const success = await copyToClipboard(color);
    if (success) {
      toast.success(`Color ${color} copied to clipboard!`);
    }
  };

  if (!colors || colors.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <ApperIcon name="Palette" className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No colors extracted yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 font-body px-4">
        {title}
      </h3>
      
      <div className="space-y-2 px-4">
        {colors.map((color, index) => (
          <motion.div
            key={`${color}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleColorClick(color)}
          >
            <div
              className="w-6 h-6 rounded-full color-swatch border border-gray-200"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-mono text-gray-600 font-body">
              {color}
            </span>
            <ApperIcon 
              name="Copy" 
              className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;