import { useState, useEffect } from "react";
import { boardService } from "@/services/api/boardService";
import { toast } from "react-toastify";

export const useBoard = (boardId) => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBoard = async () => {
    try {
      setLoading(true);
      setError(null);
      const boardData = await boardService.getById(boardId);
      setBoard(boardData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load board");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      loadBoard();
    }
  }, [boardId]);

  const updateBoard = async (updates) => {
    try {
      const updatedBoard = await boardService.update(boardId, updates);
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (err) {
      toast.error("Failed to update board");
      throw err;
    }
  };

  const joinBoard = async (user) => {
    try {
      const updatedBoard = await boardService.joinBoard(boardId, user);
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (err) {
      toast.error("Failed to join board");
      throw err;
    }
  };

  const leaveBoard = async (userId) => {
    try {
      const updatedBoard = await boardService.leaveBoard(boardId, userId);
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (err) {
      toast.error("Failed to leave board");
      throw err;
    }
  };

  return {
    board,
    loading,
    error,
    loadBoard,
    updateBoard,
    joinBoard,
    leaveBoard
  };
};