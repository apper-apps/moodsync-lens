import usersData from "@/services/mockData/users.json";
import { generateId } from "@/utils/helpers";

let users = [...usersData];

export const userService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...users];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = users.find(u => u.Id === parseInt(id));
    return user ? { ...user } : null;
  },

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const colors = ["#FF6B6B", "#4ECDC4", "#5B4CFF", "#FFD93D", "#51CF66", "#FF8E8E", "#74C0FC"];
    const newUser = {
      Id: generateId(users),
      name: userData.name || `User ${generateId(users)}`,
      color: userData.color || colors[Math.floor(Math.random() * colors.length)],
      cursor: { x: 0, y: 0 },
      lastActive: new Date().toISOString()
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return { ...users[index] };
    }
    return null;
  },

  async updateCursor(id, cursor) {
    await new Promise(resolve => setTimeout(resolve, 50));
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index !== -1) {
      users[index].cursor = cursor;
      users[index].lastActive = new Date().toISOString();
      return { ...users[index] };
    }
    return null;
  },

  async generateGuestUser() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const adjectives = ["Creative", "Artistic", "Inspired", "Brilliant", "Visionary", "Talented"];
    const nouns = ["Designer", "Artist", "Curator", "Maker", "Creator", "Innovator"];
    const colors = ["#FF6B6B", "#4ECDC4", "#5B4CFF", "#FFD93D", "#51CF66", "#FF8E8E", "#74C0FC"];
    
    return {
      id: `guest_${Date.now()}`,
      name: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      cursor: { x: 0, y: 0 },
      lastActive: new Date().toISOString()
    };
  }
};