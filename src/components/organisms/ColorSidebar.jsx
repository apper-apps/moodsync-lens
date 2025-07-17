import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import ColorPalette from "@/components/molecules/ColorPalette";

const ColorSidebar = ({ images, isOpen, onToggle }) => {
  // Extract all unique colors from images
  const allColors = images.reduce((colors, image) => {
    if (image.colors) {
      return [...colors, ...image.colors];
    }
    return colors;
  }, []);

  // Remove duplicates
  const uniqueColors = [...new Set(allColors)];

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed top-4 right-4 z-50 p-3 bg-white rounded-full shadow-floating border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ApperIcon name="Palette" className="w-5 h-5" />
      </motion.button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-40 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold gradient-text">
              Color Palette
            </h2>
            <button
              onClick={onToggle}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          
          <Card variant="gradient" className="p-6 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <ApperIcon name="Palette" className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">
                Live Color Extraction
              </h3>
              <p className="text-sm text-gray-600 font-body">
                Colors are automatically extracted from your images and updated in real-time
              </p>
            </div>
          </Card>
          
          <ColorPalette 
            colors={uniqueColors} 
            title={`Extracted Colors (${uniqueColors.length})`}
          />
          
          {images.length > 0 && (
            <div className="mt-8 space-y-6">
              <h3 className="text-sm font-medium text-gray-700 font-body">
                Colors by Image
              </h3>
              
              {images.map((image, index) => (
                <Card key={image.Id} variant="default" className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={image.url}
                      alt={`Image ${index + 1}`}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <span className="text-sm font-medium text-gray-700 font-body">
                      Image {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {image.colors?.map((color, colorIndex) => (
                      <div
                        key={`${image.Id}-${colorIndex}`}
                        className="w-6 h-6 rounded-full border border-gray-200 color-swatch"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default ColorSidebar;