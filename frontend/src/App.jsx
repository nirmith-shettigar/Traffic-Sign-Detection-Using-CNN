import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Zap,
  Brain,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Camera,
  Target,
  Shield,
  Navigation,
  MapPin,
  Route
} from "lucide-react";
import axios from "axios";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const loadingStages = [
    {
      text: "Connecting to Traffic AI...",
      icon: Route,
      color: "from-orange-400 to-red-500",
    },
    {
      text: "Capturing Image Data...",
      icon: Camera,
      color: "from-red-400 to-pink-500",
    },
    {
      text: "Detecting Sign Elements...",
      icon: Eye,
      color: "from-pink-400 to-purple-500",
    },
    {
      text: "Processing Traffic Rules...",
      icon: Navigation,
      color: "from-purple-400 to-blue-500",
    },
    {
      text: "Cross-referencing Database...",
      icon: MapPin,
      color: "from-blue-400 to-green-500",
    },
    {
      text: "Generating Results...",
      icon: Target,
      color: "from-green-400 to-emerald-500",
    },
  ];

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setError(null);
      setResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file");
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const predictImage = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentStageIndex(0);

    try {
      // Animate through loading stages
      for (let i = 0; i < loadingStages.length; i++) {
        setCurrentStageIndex(i);
        setLoadingStage(loadingStages[i].text);
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      const formData = new FormData();
      formData.append("file", selectedImage);

      const backendUrl =
        import.meta.env.VITE_BACK_END_URL || "http://localhost:8000";
      const response = await axios.post(`${backendUrl}/predict`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to predict. Please try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingStage("");
      setCurrentStageIndex(0);
    }
  };

  const resetApp = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setLoadingStage("");
    setCurrentStageIndex(0);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
      {/* Professional Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Grid Lines Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>

        {/* Subtle Moving Elements */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400/20 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-purple-400/20 rounded-full"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        ></motion.div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-6 border-b border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            {/* Professional Logo */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
            >
              {/* Main Logo Container */}
              <div className="relative w-24 h-24">
                {/* Outer Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-blue-500/30"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                ></motion.div>

                {/* Inner Glow */}
                <div className="absolute inset-2 rounded-full bg-linear-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/50"></div>

                {/* Logo Icon */}
                <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Shield className="w-8 h-8 text-blue-600" />
                  </motion.div>
                </div>

                {/* Corner Accent */}
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.div>
              </div>
            </motion.div>

            {/* Brand Name & Tagline */}
            <div className="text-center">
              <motion.h1
                className="text-6xl md:text-7xl font-black bg-linear-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent tracking-tight mb-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                SIGNIFY
              </motion.h1>

              {/* Elegant Underline */}
              <motion.div
                className="flex items-center justify-center gap-1 mb-6"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="w-8 h-px bg-blue-500"></div>
                <div className="w-4 h-1 bg-purple-500 rounded-full"></div>
                <div className="w-12 h-px bg-indigo-500"></div>
                <div className="w-4 h-1 bg-purple-500 rounded-full"></div>
                <div className="w-8 h-px bg-blue-500"></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-2"
              >
                <p className="text-gray-300 text-lg font-semibold">
                  AI-Powered Traffic Sign Recognition
                </p>
                <p className="text-gray-500 text-sm">
                  Advanced Computer Vision • Real-time Analysis • Professional
                  Grade
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Professional Upload Card */}
            <div className="relative">
              {/* Main Card */}
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl shadow-black/20 relative overflow-hidden">
                {/* Subtle Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Upload Image
                      </h2>
                      <p className="text-gray-400 font-medium">
                        Select or drop your traffic sign image
                      </p>
                    </div>
                  </div>

                  {/* Drag and Drop Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer ${
                      isDragging
                        ? "border-blue-500 bg-blue-500/10 scale-[1.02] shadow-xl shadow-blue-500/20"
                        : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {!imagePreview ? (
                      <div className="text-center py-12">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex justify-center mb-8"
                        >
                          <div className="relative">
                            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                              <ImageIcon className="w-10 h-10 text-white" />
                            </div>
                            <motion.div
                              className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Sparkles className="w-3 h-3 text-white" />
                            </motion.div>
                          </div>
                        </motion.div>
                        <p className="text-xl font-semibold mb-3 text-white">
                          {isDragging ? "Drop it here" : "Drag & Drop or Click"}
                        </p>
                        <p className="text-gray-400">
                          Upload a traffic sign image for analysis
                        </p>
                        <div className="flex justify-center gap-4 mt-6 text-xs text-gray-500">
                          <span className="px-2 py-1 bg-gray-800 rounded">
                            JPG
                          </span>
                          <span className="px-2 py-1 bg-gray-800 rounded">
                            PNG
                          </span>
                          <span className="px-2 py-1 bg-gray-800 rounded">
                            WebP
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <motion.img
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-72 object-contain rounded-xl shadow-lg"
                        />

                        {/* Elegant Scanning Effect */}
                        {isLoading && (
                          <div className="absolute inset-0 rounded-xl overflow-hidden">
                            {/* Simple Top to Bottom Scan */}
                            <motion.div
                              className="absolute inset-x-0 h-1 bg-blue-400/60 shadow-[0_0_20px_rgba(96,165,250,0.6)]"
                              animate={{ top: ["0%", "100%"] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            ></motion.div>

                            {/* Subtle overlay */}
                            <div className="absolute inset-0 bg-blue-500/5"></div>
                          </div>
                        )}

                        {!isLoading && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              resetApp();
                            }}
                            className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all z-20"
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Analyze Button */}
                  {imagePreview && !result && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={predictImage}
                      disabled={isLoading}
                      className="w-full mt-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Brain className="w-6 h-6" />
                            </motion.div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-6 h-6" />
                            Analyze Image
                          </>
                        )}
                      </span>
                    </motion.button>
                  )}

                  {/* Loading Stages */}
                  <AnimatePresence>
                    {isLoading && loadingStage && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-6 p-6 bg-gray-800/80 border border-gray-600 rounded-xl shadow-lg"
                      >
                        <div className="flex items-center gap-4">
                          {loadingStages.map((stage, idx) => {
                            const Icon = stage.icon;
                            return idx === currentStageIndex ? (
                              <motion.div
                                key={idx}
                                className={`p-3 rounded-full bg-linear-to-br ${stage.color} shadow-xl`}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 10, -10, 0],
                                }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                              >
                                <Icon className="w-7 h-7 text-white" />
                              </motion.div>
                            ) : null;
                          })}
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm mb-2">
                              {loadingStage}
                            </p>
                            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-linear-to-r ${loadingStages[currentStageIndex]?.color} rounded-full`}
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.7 }}
                              ></motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-start gap-3"
                      >
                        <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-300 font-medium">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl shadow-black/20 h-full relative overflow-hidden">
              {/* Subtle Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Detection Results
                    </h2>
                    <p className="text-gray-400 font-medium">
                      AI Analysis Output
                    </p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!result && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-80 text-gray-400"
                    >
                      <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="mb-8 relative"
                      >
                        <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center bg-gray-800/30">
                          <Brain className="w-16 h-16 text-gray-500" />
                        </div>
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        ></motion.div>
                      </motion.div>
                      <p className="text-xl font-semibold text-gray-300 mb-2">
                        Awaiting Analysis
                      </p>
                      <p className="text-gray-500 text-center">
                        Upload a traffic sign image to begin detection
                      </p>
                    </motion.div>
                  )}

                  {result && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="space-y-8"
                    >
                      {/* Success Animation */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="flex items-center justify-center gap-4 p-6 bg-green-900/30 border border-green-500/30 rounded-xl"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </motion.div>
                        <div>
                          <p className="text-white font-bold text-lg">
                            Detection Complete
                          </p>
                          <p className="text-green-400 text-sm">
                            AI has successfully identified the sign
                          </p>
                        </div>
                      </motion.div>

                      {/* Sign Title Card */}
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative overflow-hidden rounded-xl"
                      >
                        <div className="relative p-6 bg-gray-800/60 border border-gray-600/50 rounded-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-blue-400 text-xs uppercase tracking-widest font-semibold">
                              TRAFFIC SIGN IDENTIFIED
                            </h3>
                          </div>
                          <motion.p
                            className="text-2xl font-bold text-white leading-tight"
                            initial={{ x: -30 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            {result.title}
                          </motion.p>
                        </div>
                      </motion.div>

                      {/* Description Card */}
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative overflow-hidden rounded-xl"
                      >
                        <div className="relative p-6 bg-gray-800/60 border border-gray-600/50 rounded-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-purple-400 text-xs uppercase tracking-widest font-semibold">
                              DETAILED INFORMATION
                            </h3>
                          </div>
                          <motion.p
                            className="text-gray-300 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            {result.description}
                          </motion.p>
                        </div>
                      </motion.div>

                      {/* Try Again Button */}
                      <motion.button
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={resetApp}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-3"
                      >
                        <Sparkles className="w-5 h-5" />
                        Analyze Another Sign
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 py-8 px-6 mt-16"
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-16 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">
            Powered by Deep Learning | Built with React & Tailwind CSS
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Advanced AI-powered traffic sign recognition
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default App;
