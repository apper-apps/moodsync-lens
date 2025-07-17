import imagesData from "@/services/mockData/images.json";
import { generateId } from "@/utils/helpers";

let images = [...imagesData];

export const imageService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...images];
  },

  async getByBoardId(boardId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return images.filter(img => img.boardId === parseInt(boardId)).map(img => ({ ...img }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const image = images.find(img => img.Id === parseInt(id));
    return image ? { ...image } : null;
  },

  async create(imageData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newImage = {
      Id: generateId(images),
      url: imageData.url,
      position: imageData.position || { x: 100, y: 100 },
      size: imageData.size || { width: 280, height: 200 },
      rotation: imageData.rotation || 0,
      zIndex: imageData.zIndex || 1,
      uploadedBy: imageData.uploadedBy,
      boardId: parseInt(imageData.boardId),
      colors: imageData.colors || []
    };
    images.push(newImage);
    return { ...newImage };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = images.findIndex(img => img.Id === parseInt(id));
    if (index !== -1) {
      images[index] = { ...images[index], ...updates };
      return { ...images[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = images.findIndex(img => img.Id === parseInt(id));
    if (index !== -1) {
      images.splice(index, 1);
      return true;
    }
    return false;
  },

  async extractColors(imageUrl) {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate color extraction - in real app would use a library like colorthief
    const colorPalettes = [
      ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
      ["#5B4CFF", "#FF6B6B", "#4ECDC4", "#FFD93D"],
      ["#E74C3C", "#F39C12", "#27AE60", "#3498DB"],
      ["#9B59B6", "#E67E22", "#1ABC9C", "#F1C40F"],
      ["#34495E", "#E74C3C", "#ECF0F1", "#95A5A6"]
    ];
    return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  }
};