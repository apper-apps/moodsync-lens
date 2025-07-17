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
  zoomLevel = 1,
  drawingMode = false,
  onDrawingModeToggle,
  currentTool = 'pen',
  onToolChange,
  brushSize = 3,
  onBrushSizeChange,
  brushStyle = 'solid',
  onBrushStyleChange,
  brushColor = '#5B4CFF',
  onBrushColorChange
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

  const drawingTools = [
    {
      icon: "Pen",
      label: "Pen",
      tool: "pen",
      active: currentTool === 'pen' && drawingMode
    },
    {
      icon: "Pencil",
      label: "Pencil", 
      tool: "pencil",
      active: currentTool === 'pencil' && drawingMode
    },
    {
      icon: "Brush",
      label: "Brush",
      tool: "brush", 
      active: currentTool === 'brush' && drawingMode
    }
  ];

  const brushStyles = [
    { id: 'solid', label: 'Solid', preview: '━━━━━' },
    { id: 'pencil', label: 'Pencil', preview: '┈┈┈┈┈' },
    { id: 'brush', label: 'Brush', preview: '▬▬▬▬▬' }
  ];

  const handleToolClick = (tool) => {
    if (currentTool === tool && drawingMode) {
      onDrawingModeToggle(false);
    } else {
      onToolChange(tool);
      onDrawingModeToggle(true);
    }
  };

  const showBrushPanel = drawingMode && (currentTool === 'brush' || currentTool === 'pen');

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="flex flex-col items-center gap-3">
        {/* Brush Customization Panel */}
        {showBrushPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Card variant="glass" className="p-4 min-w-[280px]">
              <div className="space-y-4">
                {/* Brush Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Size: {brushSize}px
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">1</span>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-xs text-gray-500">20</span>
                  </div>
                </div>

                {/* Brush Style */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Style</label>
                  <div className="flex gap-2">
                    {brushStyles.map((style) => (
                      <Button
                        key={style.id}
                        variant={brushStyle === style.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onBrushStyleChange(style.id)}
                        className={`px-3 py-1 text-xs ${
                          brushStyle === style.id 
                            ? "bg-primary text-white" 
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        title={style.label}
                      >
                        <span className="font-mono">{style.preview}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => onBrushColorChange(e.target.value)}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <div className="flex gap-1">
                      {['#5B4CFF', '#FF6B6B', '#4ECDC4', '#51CF66', '#FFD93D', '#000000'].map((color) => (
                        <button
                          key={color}
                          onClick={() => onBrushColorChange(color)}
                          className={`w-6 h-6 rounded border-2 cursor-pointer ${
                            brushColor === color ? 'border-gray-400' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Main Toolbar */}
        <Card variant="glass" className="p-2">
          <div className="flex items-center gap-2">
            {/* Regular Tools */}
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

            {/* Drawing Tools */}
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
              {drawingTools.map((tool) => (
                <Button
                  key={tool.tool}
                  variant={tool.active ? "default" : "ghost"}
                  size="icon"
                  onClick={() => handleToolClick(tool.tool)}
                  className={`relative ${
                    tool.active
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={tool.label}
                >
                  <ApperIcon name={tool.icon} className="w-4 h-4" />
                </Button>
              ))}
            </div>
            
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
      </div>
    </motion.div>
  );
};

export default FloatingToolbar;