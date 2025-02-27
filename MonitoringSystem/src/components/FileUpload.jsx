import { useState } from "react";
import { uploadToCloudinary } from "../cloudinaryconfig"; // Import the Cloudinary upload functions
import "./FileUpload.css"; // Optional: For styling

const FileUpload = ({ onFileUpload }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    // Reset progress when new files are selected
    setUploadProgress({});
  };

  // Handle file upload
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    setUploading(true);

    try {
      const urls = [];
      
      // Upload files sequentially for better progress tracking
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update progress for this file
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: {
            status: 'uploading',
            progress: 0
          }
        }));
        
        // Upload to Cloudinary
        const url = await uploadToCloudinary(file);
        urls.push(url);
        
        // Mark this file as complete
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: {
            status: 'complete',
            progress: 100
          }
        }));
      }

      console.log("Uploaded files:", urls);
      setUploadedUrls(urls);
      onFileUpload(urls[0]); // Pass the first uploaded URL to the parent component
      alert("Files uploaded successfully!");
      setFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.pdf,.xlsx"
        multiple
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button 
        onClick={handleUpload} 
        disabled={uploading || files.length === 0}
        className={uploading ? "uploading-button" : "upload-button"}
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>

      {/* Display selected files with progress */}
      {files.length > 0 && (
        <div className="selected-files">
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name}
                {uploadProgress[file.name] && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress[file.name].progress}%` }}
                    ></div>
                    <span>{uploadProgress[file.name].status === 'complete' ? 'Complete' : 'Uploading...'}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;