import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import { boardService } from "@/services/api/boardService";
import { generateBoardId } from "@/utils/helpers";

const Home = () => {
  const [boardName, setBoardName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateBoard = async () => {
    if (!boardName.trim()) {
      toast.error("Please enter a board name");
      return;
    }

    setLoading(true);
    try {
      const newBoard = await boardService.create({ name: boardName });
      toast.success("Board created successfully!");
      navigate(`/board/${newBoard.Id}`);
    } catch (error) {
      toast.error("Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinBoard = () => {
    const boardId = prompt("Enter board ID or share URL:");
    if (boardId) {
      // Extract board ID from URL if needed
      const id = boardId.includes("/board/") 
        ? boardId.split("/board/")[1].split("-")[0]
        : boardId;
      navigate(`/board/${id}`);
    }
  };

  const features = [
    {
      icon: "Users",
      title: "Real-time Collaboration",
      description: "See team members' cursors and changes as they happen"
    },
    {
      icon: "Palette",
      title: "Color Extraction",
      description: "Automatically extract color palettes from your images"
    },
    {
      icon: "Move",
      title: "Flexible Canvas",
      description: "Drag, resize, and rotate images with precision"
    },
    {
      icon: "Share2",
      title: "Instant Sharing",
      description: "Share boards with a simple link - no accounts needed"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-6 px-4 bg-gradient-to-r from-primary/5 to-accent/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <ApperIcon name="Layout" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold gradient-text">
                MoodSync
              </h1>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-display font-bold text-gray-900 mb-6">
              Create Beautiful{" "}
              <span className="gradient-text">Mood Boards</span>
              <br />
              Together
            </h2>
            <p className="text-xl text-gray-600 font-body mb-8 max-w-2xl mx-auto">
              Collaborate in real-time with your team to collect, organize, and share visual inspiration. 
              No accounts needed - just create and share.
            </p>
          </motion.div>

          {/* Create Board Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="elevated" className="max-w-md mx-auto p-8 mb-8">
              <div className="space-y-4">
                <Input
                  label="Board Name"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="e.g., Spring 2024 Fashion Board"
                  className="text-center"
                />
                <Button
                  onClick={handleCreateBoard}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white py-3"
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                      Create Board
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleJoinBoard}
                  className="w-full"
                >
                  <ApperIcon name="LogIn" className="w-4 h-4 mr-2" />
                  Join Existing Board
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Everything You Need for{" "}
              <span className="gradient-text">Creative Collaboration</span>
            </h3>
            <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">
              Powerful features designed for design teams, creative professionals, and anyone who works with visual content.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card variant="gradient" className="p-6 text-center h-full">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                    <ApperIcon name={feature.icon} className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-display font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 font-body text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="text-3xl font-display font-bold text-gray-900 mb-6">
              Ready to Start Creating?
            </h3>
            <p className="text-lg text-gray-600 font-body mb-8">
              Join thousands of creative teams already using MoodSync to bring their ideas to life.
            </p>
            <Button
              onClick={() => document.querySelector('input').focus()}
              className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 text-lg"
            >
              <ApperIcon name="Sparkles" className="w-5 h-5 mr-2" />
              Create Your First Board
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;