import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth,  } from "../firebase"; // Import the firestore object from the firebase.js file
import "./RegisterForm.css"; // Import the CSS file
import { notifyError, notifySuccess } from "../general/CustomToast";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance
import { useState } from "react";

export const RegisterForm = ({ setChange, fetchUsers }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  const [error] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      notifyError("Passwords do not match");
      return;
    }
  
    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
  
      // Step 2: Save user data to Firestore
      const usersCollection = collection(db, "Users");
      const docRef = await addDoc(usersCollection, {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        uid: user.uid, // Save the user's UID for reference
      });
  
      console.log("User data saved to Firestore with ID:", docRef.id); // Debugging log
  
      notifySuccess("Registration successful!");
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
      });
      fetchUsers()
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
      notifyError("Failed to save user data.");
    }
  };

  return (
    <div className="register-form-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Middle Name</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
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
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;