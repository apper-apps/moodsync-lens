import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { isValidImageUrl } from "@/utils/helpers";

const ImageUpload = ({ onImageUpload, className }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith("image/");
      if (!isValid) {
        toast.error(`${file.name} is not a valid image file`);
      }
      return isValid;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of validFiles) {
        // Simulate file upload - in real app would upload to server
        const imageUrl = URL.createObjectURL(file);
        await onImageUpload({
          url: imageUrl,
          name: file.name
        });
      }
      
      toast.success(`${validFiles.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlUpload = async () => {
    const url = prompt("Enter image URL:");
    if (!url) return;

    if (!isValidImageUrl(url)) {
      toast.error("Please enter a valid image URL");
      return;
    }

    setUploading(true);
    
    try {
      await onImageUpload({
        url: url,
        name: "External Image"
      });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <motion.div
        className={`upload-zone border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragOver ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <ApperIcon 
              name={uploading ? "Loader2" : "ImagePlus"} 
              className={`w-8 h-8 text-primary ${uploading ? "animate-spin" : ""}`} 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
              {uploading ? "Uploading..." : "Add Images"}
            </h3>
            <p className="text-gray-600 font-body">
              Drag and drop images here, or click to browse
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gradient-to-r from-primary to-accent text-white"
            >
              <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
              Browse Files
            </Button>
            
            <Button
              variant="outline"
              onClick={handleUrlUpload}
              disabled={uploading}
            >
              <ApperIcon name="Link" className="w-4 h-4 mr-2" />
              From URL
            </Button>
          </div>
        </div>
      </motion.div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;