import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import DraggableImage from "@/components/organisms/DraggableImage";
import ImageUpload from "@/components/molecules/ImageUpload";
import UserCursors from "@/components/molecules/UserCursors";
import Empty from "@/components/ui/Empty";
import { clamp } from "@/utils/helpers";

const Canvas = ({ 
  images, 
  onImageAdd, 
  onImageUpdate, 
  onImageDelete, 
  currentUser, 
  otherUsers, 
  onCursorMove,
  onImageSelect,
  selectedImages = [],
  zoomLevel = 1,
  onZoomChange
}) => {
  const [draggedImage, setDraggedImage] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Handle mouse movement for cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        onCursorMove({ x, y });
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
      return () => canvas.removeEventListener("mousemove", handleMouseMove);
    }
  }, [onCursorMove]);

  // Handle wheel zoom
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = clamp(zoomLevel + delta, 0.5, 3);
        onZoomChange(newZoom);
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => canvas.removeEventListener("wheel", handleWheel);
    }
  }, [zoomLevel, onZoomChange]);

  const handleImageUpload = async (imageData) => {
    try {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      const position = {
        x: Math.random() * (canvasRect?.width - 300) + 100,
        y: Math.random() * (canvasRect?.height - 200) + 100
      };

      await onImageAdd({
        ...imageData,
        position,
        uploadedBy: currentUser?.id || "unknown"
      });
    } catch (error) {
      toast.error("Failed to add image");
    }
  };

  const handleImageDragStart = (imageId) => {
    setDraggedImage(imageId);
  };

  const handleImageDragEnd = () => {
    setDraggedImage(null);
  };

  const handleSelectionStart = (e) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      
      setSelectionBox({
        startX,
        startY,
        endX: startX,
        endY: startY
      });
    }
  };

  const handleSelectionMove = (e) => {
    if (selectionBox) {
      const rect = canvasRef.current.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      
      setSelectionBox(prev => ({
        ...prev,
        endX,
        endY
      }));
    }
  };

  const handleSelectionEnd = () => {
    if (selectionBox) {
      // Calculate selection area and select images within it
      const { startX, startY, endX, endY } = selectionBox;
      const left = Math.min(startX, endX);
      const right = Math.max(startX, endX);
      const top = Math.min(startY, endY);
      const bottom = Math.max(startY, endY);
      
      const selectedIds = images.filter(image => {
        const imgLeft = image.position.x;
        const imgRight = image.position.x + image.size.width;
        const imgTop = image.position.y;
        const imgBottom = image.position.y + image.size.height;
        
        return imgLeft < right && imgRight > left && imgTop < bottom && imgBottom > top;
      }).map(img => img.Id);
      
      onImageSelect(selectedIds);
      setSelectionBox(null);
    }
  };

  const handlePanStart = (e) => {
    if (e.target === canvasRef.current && !selectionBox) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y
      });
    }
  };

  const handlePanMove = (e) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left click
      if (e.shiftKey) {
        handleSelectionStart(e);
      } else {
        handlePanStart(e);
      }
    }
  };

  const handleMouseMove = (e) => {
    handleSelectionMove(e);
    handlePanMove(e);
  };

  const handleMouseUp = () => {
    handleSelectionEnd();
    handlePanEnd();
  };

  if (images.length === 0) {
    return (
      <div className="canvas-container h-screen w-full relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageUpload 
            onImageUpload={handleImageUpload}
            className="max-w-md"
          />
        </div>
        <UserCursors cursors={otherUsers} />
      </div>
    );
  }

  return (
    <div 
      ref={canvasRef}
      className="canvas-container h-screen w-full relative cursor-crosshair select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        transform: `scale(${zoomLevel})`,
        transformOrigin: "center center"
      }}
    >
      {/* Canvas Content */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
        }}
      >
        <AnimatePresence>
          {images.map((image) => (
            <DraggableImage
              key={image.Id}
              image={image}
              onUpdate={onImageUpdate}
              onDelete={onImageDelete}
              onDragStart={handleImageDragStart}
              onDragEnd={handleImageDragEnd}
              isDragging={draggedImage === image.Id}
              isSelected={selectedImages.includes(image.Id)}
              onClick={() => onImageSelect([image.Id])}
              zoomLevel={zoomLevel}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Selection Box */}
      {selectionBox && (
        <div
          className="selection-box"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY)
          }}
        />
      )}

      {/* User Cursors */}
      <UserCursors cursors={otherUsers} />
    </div>
  );
};

export default Canvas;