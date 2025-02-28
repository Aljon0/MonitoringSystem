import { useState } from "react";
import { uploadToCloudinary } from "../cloudinaryConfig"; // Import the Cloudinary upload function
import "./FileUpload.css"; // Optional: For styling

const FileUpload = ({ onFileUpload, documentReference }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setUploadProgress({});
  };

  // Rename the file
  const renameFile = (file, newName) => {
    console.log(new File([file], newName, { type: file.type }))
    return new File([file], newName, { type: file.type });
  };

  // Handle file upload
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Rename the file using the documentReference
        const renamedFile = renameFile(file, `${documentReference}.${file.name.split('.').pop()}`);

        // Update progress for this file
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: { status: "uploading", progress: 0 },
        }));

        // Upload the renamed file to Cloudinary
        const url = await uploadToCloudinary(renamedFile);

        // Pass the uploaded URL to the parent component
        onFileUpload(url);

        // Mark this file as complete
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: { status: "complete", progress: 100 },
        }));
      }

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
                    <span>
                      {uploadProgress[file.name].status === "complete"
                        ? "Complete"
                        : "Uploading..."}
                    </span>
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