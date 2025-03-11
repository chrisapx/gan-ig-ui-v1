import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".zip",
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
  });

  

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("files", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.download_url) {
        setTimeout(() => {
          setDownloadUrl(response.data.download_url);
          setIsUploading(false);
        }, 3000);
      } else {
        console.log("An error occured");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <nav className="w-full flex justify-between items-center px-[8vw] bg-gray-100 border-b">
        <div className="px-4 py-2">
            <img src="favicons/favicon.ico" alt="Logo" className="" />
        </div>
        <a
          href={downloadUrl}
          download
          className={`px-4 py-2 font-medium rounded-lg border ${
            downloadUrl ? "bg-black text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          aria-disabled={!downloadUrl}
        >
          Download
        </a>
      </nav>

      <div className="text-center my-8 px-[8vw]">
        <h1 className="text-[2rem] font-bold mb-4 text-gray-800">AI-Powered Image Dataset Generator</h1>
        <p className="text-gray-600 text-[1.2rem]">
          Upload a **ZIP file** with images, and our AI will generate enhanced images for you to supliment your existing insuficient dataset pool. Once done, download the 
          processed ZIP file.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div
          {...getRootProps()}
          className="w-[90vw] md:w-[50vw] border-2 border-dashed py-16 rounded-lg cursor-pointer bg-white text-center shadow-sm"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500 text-md font-medium">Drop the ZIP file here...</p>
          ) : (
            <p className="text-gray-600 text-md">Drag & drop a ZIP file here, or click to select</p>
          )}
        </div>

        {selectedFile && (
          <p className="mt-2 text-sm text-gray-700 font-medium">Selected: {selectedFile.name}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={`mt-4 px-4 py-2 rounded-lg ${
            selectedFile && !isUploading ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isUploading ? "Generating..." : "Upload & Generate"}
        </button>
      </div>

      <div className="mt-16 flex justify-center items-center space-x-3 text-xs text-gray-600">
        <span className="flex items-center">
          <span className="bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-sm">1</span>
          <span className="ml-1">Upload ZIP</span>
        </span>
        <span className="text-gray-400">→</span>
        <span className="flex items-center">
          <span className="bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-sm">2</span>
          <span className="ml-1">AI Processes</span>
        </span>
        <span className="text-gray-400">→</span>
        <span className="flex items-center">
          <span className="bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-sm">3</span>
          <span className="ml-1">Download ZIP</span>
        </span>
      </div>
    </div>
  );
};

export default Home;