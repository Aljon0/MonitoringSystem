import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; 
import { notifySuccess, notifyError } from "../general/CustomToast.js";
import { Eye, EyeOff } from 'lucide-react';
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css";

export const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const user = userCredential.user;

      
      const usersRef = collection(db, "Users"); 
      const q = query(usersRef, where("email", "==", loginData.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        notifyError("Incorrect email/password.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.role === "admin") {
        notifySuccess("Login Successfully!");
        navigate("/requirements"); 
      } else if (userData.role === "user") {
        notifySuccess("Login Successfully!");
        navigate("/users");
      } else {
        notifyError("Invalid account type. Please contact support.");
      }

      
      setLoginData({ email: "", password: "" });
    } catch (error) {
      console.error("Login error:", error);

      
      if (error.code === "auth/invalid-credential") {
        notifyError("Incorrect email/password.");
      } else if (error.code === "auth/too-many-requests") {
        notifyError(
          "Your account has been temporarily disabled due to too many failed login attempts."
        );
      } else {
        notifyError("Login failed. Please try again.");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!loginData.email) {
      notifyError("Please enter your email address first.");
      return;
    }

    try {
      const usersRef = collection(db, "Users"); 
      const q = query(usersRef, where("email", "==", loginData.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        notifyError("No user found with this email.");
        return;
      }

      await sendPasswordResetEmail(auth, loginData.email);
      notifySuccess("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Password reset error:", error);
      notifyError("Failed to send password reset email. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
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
              value={loginData.password}
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
        <button type="submit" className="submit-button">
          Login
        </button>
        <button
          type="button"
          className="forgot-password-button"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
};

export default LoginForm;