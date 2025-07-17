import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";

const UserCursors = ({ cursors }) => {
  return (
    <AnimatePresence>
      {cursors.map((user) => (
        <motion.div
          key={user.id}
          className="user-cursor"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: user.cursor.x,
            y: user.cursor.y
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            opacity: { duration: 0.2 }
          }}
        >
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-floating border border-gray-200">
            <Avatar
              name={user.name}
              color={user.color}
              size="sm"
            />
            <span className="text-xs font-medium text-gray-700 font-body">
              {user.name}
            </span>
          </div>
          
          {/* Cursor pointer */}
          <div
            className="absolute top-0 left-0 w-3 h-3 rounded-full border-2 border-white shadow-soft transform -translate-x-1 -translate-y-1"
            style={{ backgroundColor: user.color }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default UserCursors;