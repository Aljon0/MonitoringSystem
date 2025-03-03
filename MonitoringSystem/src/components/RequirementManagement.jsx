import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance
import GenerateReport from "./GenerateReports";
import "./RequirementManagement.css"; // Optional: For styling
import { uploadToCloudinary } from "../cloudinaryConfig"; // Import the Cloudinary upload function
import RegisterForm from "./RegisterForm";
import { sendExpirationNotificationEmail } from "../utils/emailService"; // Import the email service

const RequirementManagement = () => {
  const [requirements, setRequirements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    complianceList: "",
    department: "",
    entity: "",
    frequencyOfCompliance: "",
    typeOfCompliance: "",
    dateSubmitted: "",
    expiration: "",
    renewal: "",
    personInCharge: "",
    status: "",
    documentReference: "",
    uploadedFileUrl: "", // New field for uploaded file URL
  });
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file

  // Function to generate a random token
  const generateToken = (department) => {
    const year = new Date().getFullYear();
    const randomKey = Math.random().toString(36).substring(2, 6).toUpperCase();
    const departmentPrefix = department.substring(0, 2).toUpperCase(); // Get first 2 letters of the department
    return `${departmentPrefix}-${year}-${randomKey}`;
  };

  // Fetch requirements from Firestore
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const requirementsCollection = collection(db, "Requirements");
        const querySnapshot = await getDocs(requirementsCollection);

        const requirementsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRequirements(requirementsList);
      } catch (error) {
        console.error("Error fetching requirements:", error);
      }
    };

    fetchRequirements();
  }, []);

  useEffect(() => {
    const checkExpirations = () => {
      const today = new Date();
      const notificationThreshold = 7; // Notify 7 days before expiration

      requirements.forEach((requirement) => {
        const expirationDate = new Date(requirement.expiration);
        const timeDifference = expirationDate - today;
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        // Check if the requirement is expiring within the threshold
        if (daysDifference <= notificationThreshold && daysDifference >= 0) {
          // Ensure the personInCharge field contains a valid email
          if (requirement.personInCharge && typeof requirement.personInCharge === "string") {
            sendExpirationNotificationEmail(
              requirement.personInCharge, // Real email from personInCharge
              requirement.complianceList, // Real compliance name
              requirement.expiration // Real expiration date
            );
          } else {
            console.error("Invalid or missing email address in personInCharge:", requirement.personInCharge);
          }
        }
      });
    };

    checkExpirations();
  }, [requirements]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Generate token based on the department
      const token = generateToken(formData.department);

      // Upload the file to Cloudinary (if a file is selected)
      let fileUrl = "";
      if (selectedFile) {
        const renamedFile = new File([selectedFile], `${token}.${selectedFile.name.split('.').pop()}`, {
          type: selectedFile.type,
        });
        fileUrl = await uploadToCloudinary(renamedFile);
      }

      // Prepare the data to save to Firestore
      const updatedFormData = {
        ...formData,
        documentReference: token, // Set the token as the document reference
        uploadedFileUrl: fileUrl, // Set the uploaded file URL
      };

      // Save the new requirement to Firestore
      const requirementsCollection = collection(db, "Requirements");
      const docRef = await addDoc(requirementsCollection, updatedFormData);

      console.log("Requirement saved with ID:", docRef.id); // Debugging log

      // Add the new requirement to the local state
      setRequirements([...requirements, { id: docRef.id, ...updatedFormData }]);

      // Clear the form and hide it
      setFormData({
        complianceList: "",
        department: "",
        entity: "",
        frequencyOfCompliance: "",
        typeOfCompliance: "",
        dateSubmitted: "",
        expiration: "",
        renewal: "",
        personInCharge: "",
        status: "",
        documentReference: "",
        uploadedFileUrl: "",
      });
      setSelectedFile(null); // Clear the selected file
      setShowForm(false);
    } catch (error) {
      console.error("Error saving requirement:", error);
    }
  };

  // Handle viewing the document
  const handleViewDocument = (fileUrl) => {
    window.open(fileUrl, "_blank"); // Open the file in a new tab
  };

  // Handle downloading the document
  const handleDownloadDocument = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName; // Set the file name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="requirement-management-container">
      <h2>Requirement Management</h2>

      {/* Generate Report Button */}
      <GenerateReport requirements={requirements} />

      {/* Add Requirement Button */}
      <button className="add-requirement-button" onClick={() => setShowForm(true)}>
        Add Requirement
      </button>

      {/* Overlay Form */}
      {showForm && (
        <div className="overlay">
          <div className="form-container">
            <h3>Add New Requirement</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Compliance List</label>
                  <input
                    type="text"
                    name="complianceList"
                    value={formData.complianceList}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Entity</label>
                  <input
                    type="text"
                    name="entity"
                    value={formData.entity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Frequency of Compliance</label>
                  <input
                    type="text"
                    name="frequencyOfCompliance"
                    value={formData.frequencyOfCompliance}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type of Compliance</label>
                  <input
                    type="text"
                    name="typeOfCompliance"
                    value={formData.typeOfCompliance}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date Submitted</label>
                  <input
                    type="date"
                    name="dateSubmitted"
                    value={formData.dateSubmitted}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Expiration</label>
                  <input
                    type="date"
                    name="expiration"
                    value={formData.expiration}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Renewal</label>
                  <input
                    type="date"
                    name="renewal"
                    value={formData.renewal}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Person in Charge</label>
                  <input
                    type="text"
                    name="personInCharge"
                    value={formData.personInCharge}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Upload Document</label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.xlsx"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Add Requirement
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requirements Table */}
      <table className="requirements-table">
        <thead>
          <tr>
            <th>Compliance List</th>
            <th>Department</th>
            <th>Entity</th>
            <th>Frequency of Compliance</th>
            <th>Type of Compliance</th>
            <th>Date Submitted</th>
            <th>Expiration</th>
            <th>Renewal</th>
            <th>Person in Charge</th>
            <th>Status</th>
            <th>Document Reference</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map((requirement) => (
            <tr key={requirement.id}>
              <td>{requirement.complianceList}</td>
              <td>{requirement.department}</td>
              <td>{requirement.entity}</td>
              <td>{requirement.frequencyOfCompliance}</td>
              <td>{requirement.typeOfCompliance}</td>
              <td>{requirement.dateSubmitted}</td>
              <td>{requirement.expiration}</td>
              <td>{requirement.renewal}</td>
              <td>{requirement.personInCharge}</td>
              <td>{requirement.status}</td>
              <td>{requirement.documentReference}</td>
              <td>
                {requirement.uploadedFileUrl && (
                  <>
                    <button
                      className="view-button"
                      onClick={() => handleViewDocument(requirement.uploadedFileUrl)}
                    >
                      View Document
                    </button>
                    <button
                      className="download-button"
                      onClick={() =>
                        handleDownloadDocument(
                          requirement.uploadedFileUrl,
                          requirement.documentReference
                        )
                      }
                    >
                      Download Document
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h2>Register New User</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RequirementManagement;