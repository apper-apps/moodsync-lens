import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/api/userService";
import { throttle } from "@/utils/helpers";

export const useCollaboration = (boardId) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]);
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await userService.generateGuestUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to initialize user:", err);
      }
    };

    initializeUser();
  }, []);

  const updateCursor = useCallback(
    throttle((position) => {
      if (currentUser) {
        setCursors(prev => ({
          ...prev,
          [currentUser.id]: {
            ...currentUser,
            cursor: position,
            lastActive: new Date().toISOString()
          }
        }));
      }
    }, 100),
    [currentUser]
  );

  const broadcastCursor = useCallback((position) => {
    if (currentUser) {
      // In a real app, this would send to WebSocket server
      updateCursor(position);
    }
  }, [currentUser, updateCursor]);

  const simulateOtherUsers = useCallback(() => {
    if (!currentUser) return;

    // Simulate other users joining and moving cursors
    const mockUsers = [
      { id: "user2", name: "Alex Wilson", color: "#4ECDC4" },
      { id: "user3", name: "Sarah Kim", color: "#FFD93D" }
    ];

    const activeMockUsers = mockUsers.filter(() => Math.random() > 0.7);
    
    activeMockUsers.forEach(user => {
      const randomPosition = {
        x: Math.random() * (window.innerWidth - 200) + 100,
        y: Math.random() * (window.innerHeight - 200) + 100
      };

      setCursors(prev => ({
        ...prev,
        [user.id]: {
          ...user,
          cursor: randomPosition,
          lastActive: new Date().toISOString()
        }
      }));
    });
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(simulateOtherUsers, 5000);
    return () => clearInterval(interval);
  }, [simulateOtherUsers]);

  // Clean up old cursors
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      setCursors(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(userId => {
          const lastActive = new Date(updated[userId].lastActive);
          if (now - lastActive > 30000) { // 30 seconds
            delete updated[userId];
          }
        });
        return updated;
      });
    }, 10000);

    return () => clearInterval(cleanupInterval);
  }, []);

  const getOtherUsersCursors = () => {
    return Object.values(cursors).filter(user => user.id !== currentUser?.id);
  };

  return {
    currentUser,
    otherUsers,
    cursors: getOtherUsersCursors(),
    broadcastCursor,
    updateCursor
  };
};