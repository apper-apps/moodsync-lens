import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import { copyToClipboard, generateShareUrl } from "@/utils/helpers";

const ShareModal = ({ boardId, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = generateShareUrl(boardId);

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold gradient-text">
                Share Board
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-body mb-3">
                  Share this link with your team to collaborate in real-time
                </p>
                
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-gray-50 font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopyUrl}
                    variant={copied ? "accent" : "outline"}
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <ApperIcon 
                      name={copied ? "Check" : "Copy"} 
                      className="w-4 h-4" 
                    />
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600 font-body">
                  <ApperIcon name="Users" className="w-4 h-4" />
                  <span>Anyone with this link can view and edit</span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCopyUrl}
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-white"
                >
                  <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareModal;