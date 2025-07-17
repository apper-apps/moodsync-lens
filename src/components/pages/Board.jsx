import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Canvas from "@/components/organisms/Canvas";
import FloatingToolbar from "@/components/organisms/FloatingToolbar";
import ColorSidebar from "@/components/organisms/ColorSidebar";
import UserAvatars from "@/components/organisms/UserAvatars";
import ShareModal from "@/components/molecules/ShareModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useBoard } from "@/hooks/useBoard";
import { useImages } from "@/hooks/useImages";
import { useCollaboration } from "@/hooks/useCollaboration";
import { extractColorsFromImage } from "@/utils/helpers";

const Board = () => {
  const { boardId } = useParams();
  const { board, loading: boardLoading, error: boardError, loadBoard } = useBoard(boardId);
  const { images, loading: imagesLoading, error: imagesError, loadImages, addImage, updateImage, deleteImage } = useImages(boardId);
  const { currentUser, cursors, broadcastCursor } = useCollaboration(boardId);
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showColorSidebar, setShowColorSidebar] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const loading = boardLoading || imagesLoading;
  const error = boardError || imagesError;

  const handleImageAdd = async (imageData) => {
    try {
      const colors = extractColorsFromImage(imageData.url);
      const newImage = await addImage({
        ...imageData,
        colors: colors
      });
      
      // Auto-extract colors after a delay to simulate processing
      setTimeout(async () => {
        const extractedColors = extractColorsFromImage(imageData.url);
        await updateImage(newImage.Id, { colors: extractedColors });
      }, 1000);
    } catch (error) {
      toast.error("Failed to add image");
    }
  };

  const handleImageUpdate = async (imageId, updates) => {
    try {
      await updateImage(imageId, updates);
    } catch (error) {
      toast.error("Failed to update image");
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      await deleteImage(imageId);
      setSelectedImages(prev => prev.filter(id => id !== imageId));
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleImageSelect = (imageIds) => {
    setSelectedImages(imageIds);
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) return;
    
    if (window.confirm(`Delete ${selectedImages.length} selected image(s)?`)) {
      try {
        await Promise.all(selectedImages.map(id => deleteImage(id)));
        setSelectedImages([]);
        toast.success(`${selectedImages.length} image(s) deleted`);
      } catch (error) {
        toast.error("Failed to delete images");
      }
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleFitToScreen = () => {
    setZoomLevel(1);
  };

  const handleCursorMove = (position) => {
    broadcastCursor(position);
  };

  const handleUpload = () => {
    // Trigger file input or show upload modal
    document.getElementById("hidden-file-input")?.click();
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleInvite = () => {
    setShowShareModal(true);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBoard} />;

  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      {/* User Avatars */}
      <UserAvatars 
        users={board?.activeUsers || []}
        currentUser={currentUser}
        onInvite={handleInvite}
      />

      {/* Main Canvas */}
      <Canvas
        images={images}
        onImageAdd={handleImageAdd}
        onImageUpdate={handleImageUpdate}
        onImageDelete={handleImageDelete}
        currentUser={currentUser}
        otherUsers={cursors}
        onCursorMove={handleCursorMove}
        onImageSelect={handleImageSelect}
        selectedImages={selectedImages}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
      />

      {/* Floating Toolbar */}
      <FloatingToolbar
        onUpload={handleUpload}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToScreen={handleFitToScreen}
        onShare={handleShare}
        selectedCount={selectedImages.length}
        onDeleteSelected={handleDeleteSelected}
        zoomLevel={zoomLevel}
      />

      {/* Color Sidebar */}
      <ColorSidebar
        images={images}
        isOpen={showColorSidebar}
        onToggle={() => setShowColorSidebar(!showColorSidebar)}
      />

      {/* Share Modal */}
      <ShareModal
        boardId={boardId}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Hidden file input for uploads */}
      <input
        id="hidden-file-input"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files);
          for (const file of files) {
            const imageUrl = URL.createObjectURL(file);
            await handleImageAdd({
              url: imageUrl,
              name: file.name
            });
          }
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default Board;