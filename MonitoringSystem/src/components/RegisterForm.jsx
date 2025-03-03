import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { notifyError, notifySuccess } from "../general/CustomToast";
import { Eye, EyeOff } from "lucide-react";
import "./RegisterForm.css";
import PropTypes from "prop-types";

export const RegisterForm = ({ fetchUsers }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    contact: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [emailExists, setEmailExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const validateName = (name, field) => {
    if (!name) return `${field} is required`;
    if (name.length < 2) return `${field} must be at least 2 characters`;
    return "";
  };

  const validateContact = (contact) => {
    const contactRegex = /^(09|\+639)\d{9}$/;
    if (!contact) return "Contact number is required";
    if (!contactRegex.test(contact)) return "Invalid contact number format (e.g., 09XXXXXXXXX or +639XXXXXXXXX)";
    return "";
  };

  const validateAddress = (address) => {
    if (!address) return "Address is required";
    if (address.length < 10) return "Please enter a complete address";
    return "";
  };

  const checkEmailExists = async (email) => {
    const auth = getAuth();
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailExists(false); 

    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      firstName: validateName(formData.firstName, "First name"),
      middleName: validateName(formData.middleName, "Middle name"),
      lastName: validateName(formData.lastName, "Last name"),
      contact: validateContact(formData.contact),
      address: validateAddress(formData.address),
      department: validateName(formData.department, "Department"),
    };

    const actualErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([value]) => value !== "")
    );

    setErrors(actualErrors);

    if (Object.keys(actualErrors).length > 0) {
      return;
    }

    try {
      
      const emailTaken = await checkEmailExists(formData.email);
      if (emailTaken) {
        setEmailExists(true);
        return;
      }

      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      
      const usersCollection = collection(db, "Users");
      await addDoc(usersCollection, {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        contact: formData.contact,
        address: formData.address,
        uid: user.uid, 
        role: "user", 
      });

      notifySuccess("Registration successful! Please log in.");
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        contact: "",
        address: "",
      });

      fetchUsers(); 
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setEmailExists(true);
      } else {
        notifyError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="register-form-container">
      <h2>Register</h2>
      {emailExists && <p className="error-message">Email already exists.</p>}
      {Object.keys(errors).length > 0 && (
        <div className="error-messages">
          {Object.values(errors).map((error, index) => (
            <p key={index} className="error-message">
              {error}
            </p>
          ))}
        </div>
      )}
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
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
          <label>Contact Number</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
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


RegisterForm.propTypes = {
  fetchUsers: PropTypes.func.isRequired,
};

export default RegisterForm;