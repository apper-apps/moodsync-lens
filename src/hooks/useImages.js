import { useState, useEffect } from "react";
import { imageService } from "@/services/api/imageService";
import { toast } from "react-toastify";

export const useImages = (boardId) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const imagesData = await imageService.getByBoardId(boardId);
      setImages(imagesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      loadImages();
    }
  }, [boardId]);

  const addImage = async (imageData) => {
    try {
      const newImage = await imageService.create({ ...imageData, boardId });
      setImages(prev => [...prev, newImage]);
      toast.success("Image added successfully");
      return newImage;
    } catch (err) {
      toast.error("Failed to add image");
      throw err;
    }
  };

  const updateImage = async (imageId, updates) => {
    try {
      const updatedImage = await imageService.update(imageId, updates);
      setImages(prev => prev.map(img => img.Id === imageId ? updatedImage : img));
      return updatedImage;
    } catch (err) {
      toast.error("Failed to update image");
      throw err;
    }
  };

  const deleteImage = async (imageId) => {
    try {
      await imageService.delete(imageId);
      setImages(prev => prev.filter(img => img.Id !== imageId));
      toast.success("Image deleted");
    } catch (err) {
      toast.error("Failed to delete image");
      throw err;
    }
  };

  const extractColors = async (imageUrl) => {
    try {
      const colors = await imageService.extractColors(imageUrl);
      return colors;
    } catch (err) {
      toast.error("Failed to extract colors");
      throw err;
    }
  };

  return {
    images,
    loading,
    error,
    loadImages,
    addImage,
    updateImage,
    deleteImage,
    extractColors
  };
};