import { useState, useEffect } from "react";
import { useResetPasswordMutation } from "../../redux/api/userAPI"; 
import forgotPasswordImage from "../../assets/Images/forgotPassword/fimg.avif"; 
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation(); 

  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("❌ Passwords do not match.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        theme: "dark",
      });
      return;
    }

    try {
      const result = await resetPassword({ email, newPassword, confirmPassword }).unwrap(); 
      toast.success(result.message || "Your password has been reset successfully.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
      });
      navigate("/login"); 
    } catch (error) {
      toast.error(
        `❌ Failed to reset password: ${error.response?.data?.message || error.message}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          theme: "dark",
        }
      );
    }
  };

  return (
    <div className="login-page">
      <div className="image-container">
        <img src={forgotPasswordImage} alt="Forgot Password" />
      </div>
      <div className="form-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">New Password:</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="links">
          <Link to="/login">Back to Login</Link>
          <span> | </span>
          <Link to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
