import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance
import "./RequirementManagement.css"; // Optional: For styling

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
  });

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save the new requirement to Firestore
      const requirementsCollection = collection(db, "Requirements");
      const docRef = await addDoc(requirementsCollection, formData);

      console.log("Requirement saved with ID:", docRef.id); // Debugging log

      // Add the new requirement to the local state
      setRequirements([...requirements, { id: docRef.id, ...formData }]);

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
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error saving requirement:", error);
    }
  };

  return (
    <div className="requirement-management-container">
      <h2>Requirement Management</h2>

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
                  <label>Document Reference</label>
                  <input
                    type="text"
                    name="documentReference"
                    value={formData.documentReference}
                    onChange={handleChange}
                    required
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequirementManagement;