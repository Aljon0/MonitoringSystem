import { auth, signInWithEmailAndPassword } from "../firebase";
import { useState } from "react";
import { notifySuccess, notifyError } from "../general/CustomToast.js";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css"; 

export const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

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
      console.log("User logged in:", userCredential.user);
      notifySuccess("Login successful!");
      // Clear form after submission
      setLoginData({ email: "", password: "" });
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific Firebase errors
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
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;