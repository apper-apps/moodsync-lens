import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const UserAvatars = ({ users, currentUser, onInvite }) => {
  const maxVisibleUsers = 5;
  const visibleUsers = users.slice(0, maxVisibleUsers);
  const remainingCount = users.length - maxVisibleUsers;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-4 z-40 flex items-center gap-3"
    >
      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-floating border border-gray-200">
        <AnimatePresence>
          {visibleUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
            >
              <Avatar
                name={user.name}
                color={user.color}
                size="default"
                className="ring-2 ring-white"
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {remainingCount > 0 && (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
            +{remainingCount}
          </div>
        )}
        
        {currentUser && (
          <div className="ml-2 pl-2 border-l border-gray-200">
            <span className="text-sm font-medium text-gray-700 font-body">
              {currentUser.name}
            </span>
          </div>
        )}
      </div>
      
      <Button
        onClick={onInvite}
        variant="ghost"
        size="icon"
        className="bg-white shadow-floating border border-gray-200 hover:bg-gray-50"
      >
        <ApperIcon name="UserPlus" className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default UserAvatars;