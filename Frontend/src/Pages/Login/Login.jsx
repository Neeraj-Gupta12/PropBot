import { useState, useEffect } from "react";
import { useLoginUserMutation, useGoogleLoginMutation } from "../../redux/api/userAPI.js";
import loginImage from "../../assets/Images/login/img.png";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../../redux/slices/userSlice";
import { auth, googleProvider } from "./Firebase.jsx";
import { signInWithPopup } from "firebase/auth";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const [googleLogin, { isLoading: isGoogleLoggingIn }] = useGoogleLoginMutation();

  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      const result = await loginUser({ email, password }).unwrap();
      if (result.success) {
        const { token, user } = result;

        dispatch(setUser({ user, token }));

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          draggable: true,
          theme: "dark",
        });

        navigate("/");
      }
    } catch (error) {
      toast.error(
        `❌ Login failed: ${error.response?.data?.message || error.message}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          theme: "dark",
        }
      );
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken(); 
  
      const response = await googleLogin({
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        firebaseToken: token,
      }).unwrap();
  
      if (response.success) {
        dispatch(setUser({ user: response.user, token: response.token }));
  
        toast.success("Login successful with Google!", {
          position: "top-center",
          autoClose: 5000,
          draggable: true,
          theme: "dark",
        });
        
        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(`❌ Google login failed: ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
        theme: "dark",
      });
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-image-container">
        <img src={loginImage} alt="Login" />
      </div>
      <div className="login-form-container">
        <h2>Login to PropBot</h2>
        <div className="login-form-container-inner">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-buttons">
          <button className="login-button" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
          <button className="google-login" onClick={handleGoogleLogin} type="button" disabled={isGoogleLoggingIn}>
            <FcGoogle /> <span>{isGoogleLoggingIn ? "Signing in..." : "Sign in with Google"}</span>
          </button>
          </div>
        </form>
        <div className="links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <span> | </span>
          <Link to="/signup">Signup</Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
