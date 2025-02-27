import { useState } from "react";
import { uploadToCloudinary } from "../cloudinaryconfig"; // Import the Cloudinary upload functions
import "./FileUpload.css"; // Optional: For styling

const FileUpload = () => {
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
      <h2>Upload Files</h2>
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
          <h3>Selected Files:</h3>
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

      {/* Display uploaded media */}
      {uploadedUrls.length > 0 && (
        <div className="uploaded-media">
          <h3>Uploaded Media:</h3>
          <div className="media-grid">
            {uploadedUrls.map((url, index) => {
              const fileType = url.split(".").pop().toLowerCase();
              
              if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
                return (
                  <div key={index} className="media-item">
                    <img 
                      src={url} 
                      alt={`Uploaded image ${index}`} 
                      loading="lazy"
                    />
                    <a href={url} target="_blank" rel="noopener noreferrer" className="download-link">
                      View Full Size
                    </a>
                  </div>
                );
              } else if (["mp4", "webm"].includes(fileType)) {
                return (
                  <div key={index} className="media-item">
                    <video controls>
                      <source src={url} type={`video/${fileType}`} />
                      Your browser does not support the video tag.
                    </video>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="download-link">
                      Download Video
                    </a>
                  </div>
                );
              } else {
                // For documents like PDF, Excel, etc.
                return (
                  <div key={index} className="media-item document">
                    <div className="document-icon">
                      {fileType.toUpperCase()}
                    </div>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="download-link">
                      Download {fileType.toUpperCase()}
                    </a>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;