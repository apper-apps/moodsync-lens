export const generateId = (items) => {
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map(item => item.Id)) + 1;
};

export const generateBoardId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const distance = (point1, point2) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const isValidImageUrl = (url) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext)) || url.includes("unsplash") || url.includes("images");
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
};

export const generateShareUrl = (boardId) => {
  return `${window.location.origin}/board/${boardId}`;
};

export const extractColorsFromImage = (imageUrl) => {
  // Simulate color extraction - in real app would use canvas and image processing
  const colorPalettes = [
    ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
    ["#5B4CFF", "#FF6B6B", "#4ECDC4", "#FFD93D"],
    ["#E74C3C", "#F39C12", "#27AE60", "#3498DB"],
    ["#9B59B6", "#E67E22", "#1ABC9C", "#F1C40F"],
    ["#34495E", "#E74C3C", "#ECF0F1", "#95A5A6"]
  ];
  return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
};