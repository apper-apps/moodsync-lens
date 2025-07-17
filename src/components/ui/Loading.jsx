import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-display font-semibold gradient-text">
            Loading MoodSync
          </h2>
          <p className="text-gray-600 font-body">
            Setting up your collaborative canvas...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;