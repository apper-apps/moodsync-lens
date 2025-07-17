import boardsData from "@/services/mockData/boards.json";
import { generateId } from "@/utils/helpers";

let boards = [...boardsData];

export const boardService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...boards];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const board = boards.find(b => b.Id === parseInt(id));
    return board ? { ...board } : null;
  },

  async create(boardData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newBoard = {
      Id: generateId(boards),
      name: boardData.name || "Untitled Board",
      createdAt: new Date().toISOString(),
      shareUrl: `https://moodsync.app/board/${generateId(boards)}-${Math.random().toString(36).substr(2, 6)}`,
      activeUsers: []
    };
    boards.push(newBoard);
    return { ...newBoard };
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = boards.findIndex(b => b.Id === parseInt(id));
    if (index !== -1) {
      boards[index] = { ...boards[index], ...updates };
      return { ...boards[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = boards.findIndex(b => b.Id === parseInt(id));
    if (index !== -1) {
      boards.splice(index, 1);
      return true;
    }
    return false;
  },

  async joinBoard(boardId, user) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const board = boards.find(b => b.Id === parseInt(boardId));
    if (board) {
      const existingUserIndex = board.activeUsers.findIndex(u => u.id === user.id);
      if (existingUserIndex !== -1) {
        board.activeUsers[existingUserIndex] = { ...user, lastActive: new Date().toISOString() };
      } else {
        board.activeUsers.push({ ...user, lastActive: new Date().toISOString() });
      }
      return { ...board };
    }
    return null;
  },

  async leaveBoard(boardId, userId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const board = boards.find(b => b.Id === parseInt(boardId));
    if (board) {
      board.activeUsers = board.activeUsers.filter(u => u.id !== userId);
      return { ...board };
    }
    return null;
  }
};