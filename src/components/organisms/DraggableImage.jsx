import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { clamp } from "@/utils/helpers";

const DraggableImage = ({ 
  image, 
  onUpdate, 
  onDelete, 
  onDragStart, 
  onDragEnd,
  isDragging,
  isSelected,
  onClick,
  zoomLevel = 1
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const imageRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startPos: { x: 0, y: 0 } });

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    
    e.stopPropagation();
    onClick();
    
    if (e.target.classList.contains("resize-handle") || e.target.classList.contains("rotate-handle")) {
      return;
    }
    
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPos: { ...image.position }
    };
    
    onDragStart(image.Id);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;
    
    const deltaX = (e.clientX - dragRef.current.startX) / zoomLevel;
    const deltaY = (e.clientY - dragRef.current.startY) / zoomLevel;
    
    const newPosition = {
      x: dragRef.current.startPos.x + deltaX,
      y: dragRef.current.startPos.y + deltaY
    };
    
    onUpdate(image.Id, { position: newPosition });
  };

  const handleMouseUp = () => {
    if (dragRef.current.isDragging) {
      dragRef.current.isDragging = false;
      onDragEnd();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  };

  const handleResize = (e, direction) => {
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startSize = { ...image.size };
    const startPosition = { ...image.position };
    
    const handleResizeMove = (e) => {
      const deltaX = (e.clientX - startX) / zoomLevel;
      const deltaY = (e.clientY - startY) / zoomLevel;
      
      let newSize = { ...startSize };
      let newPosition = { ...startPosition };
      
      switch (direction) {
        case "se":
          newSize.width = Math.max(50, startSize.width + deltaX);
          newSize.height = Math.max(50, startSize.height + deltaY);
          break;
        case "sw":
          newSize.width = Math.max(50, startSize.width - deltaX);
          newSize.height = Math.max(50, startSize.height + deltaY);
          newPosition.x = startPosition.x + (startSize.width - newSize.width);
          break;
        case "ne":
          newSize.width = Math.max(50, startSize.width + deltaX);
          newSize.height = Math.max(50, startSize.height - deltaY);
          newPosition.y = startPosition.y + (startSize.height - newSize.height);
          break;
        case "nw":
          newSize.width = Math.max(50, startSize.width - deltaX);
          newSize.height = Math.max(50, startSize.height - deltaY);
          newPosition.x = startPosition.x + (startSize.width - newSize.width);
          newPosition.y = startPosition.y + (startSize.height - newSize.height);
          break;
      }
      
      onUpdate(image.Id, { size: newSize, position: newPosition });
    };
    
    const handleResizeEnd = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
    
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleRotate = (e) => {
    e.stopPropagation();
    setIsRotating(true);
    
    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const startRotation = image.rotation || 0;
    
    const handleRotateMove = (e) => {
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
      const newRotation = startRotation + deltaAngle;
      
      onUpdate(image.Id, { rotation: newRotation });
    };
    
    const handleRotateEnd = () => {
      setIsRotating(false);
      document.removeEventListener("mousemove", handleRotateMove);
      document.removeEventListener("mouseup", handleRotateEnd);
    };
    
    document.addEventListener("mousemove", handleRotateMove);
    document.addEventListener("mouseup", handleRotateEnd);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this image?")) {
      onDelete(image.Id);
      toast.success("Image deleted");
    }
  };

  const handleBringToFront = (e) => {
    e.stopPropagation();
    onUpdate(image.Id, { zIndex: Date.now() });
  };

  return (
    <motion.div
      ref={imageRef}
      className={`image-item absolute ${isDragging ? "dragging" : ""} ${isSelected ? "selected" : ""}`}
      style={{
        left: image.position.x,
        top: image.position.y,
        width: image.size.width,
        height: image.size.height,
        zIndex: image.zIndex || 1,
        transform: `rotate(${image.rotation || 0}deg)`,
        cursor: isDragging ? "grabbing" : "grab"
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <img
        src={image.url}
        alt="Mood board item"
        className="w-full h-full object-cover rounded-lg shadow-soft border-2 border-white"
        draggable={false}
      />
      
      {/* Controls */}
      {(isSelected || showControls) && (
        <>
          {/* Resize Handles */}
          <div
            className="resize-handle top-0 left-0 cursor-nw-resize"
            onMouseDown={(e) => handleResize(e, "nw")}
          />
          <div
            className="resize-handle top-0 right-0 cursor-ne-resize"
            onMouseDown={(e) => handleResize(e, "ne")}
          />
          <div
            className="resize-handle bottom-0 left-0 cursor-sw-resize"
            onMouseDown={(e) => handleResize(e, "sw")}
          />
          <div
            className="resize-handle bottom-0 right-0 cursor-se-resize"
            onMouseDown={(e) => handleResize(e, "se")}
          />
          
          {/* Rotate Handle */}
          <div
            className="rotate-handle -top-8 left-1/2 transform -translate-x-1/2"
            onMouseDown={handleRotate}
          >
            <ApperIcon name="RotateCw" className="w-3 h-3 text-white" />
          </div>
          
          {/* Action Buttons */}
          <div className="absolute -top-10 right-0 flex gap-1">
            <button
              onClick={handleBringToFront}
              className="p-1 bg-white rounded-full shadow-soft hover:bg-gray-50 transition-colors"
              title="Bring to Front"
            >
              <ApperIcon name="MoveUp" className="w-3 h-3 text-gray-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 bg-white rounded-full shadow-soft hover:bg-error/10 transition-colors"
              title="Delete"
            >
              <ApperIcon name="Trash2" className="w-3 h-3 text-error" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default DraggableImage;