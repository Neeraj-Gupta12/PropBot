import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/slices/userSlice";
import { clearCompare } from "../../redux/slices/compareSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTimes, FaRegUser } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [width, setWidth] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const logoutUser = async () => {
    try {
      dispatch(clearUser());
      dispatch(clearCompare());
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleProfileRedirect = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const headerHeight = 300; // Approximate header height
      // If on search results page, always show scrolled navbar
      if (location.pathname.startsWith("/search")) {
        setIsScrolled(true);
        setIsHeaderVisible(false);
      } else {
        setIsScrolled(scrollPosition > 100);
        setIsHeaderVisible(scrollPosition < headerHeight);
      }
    };
    // Initial check
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 800) setWidth(true);
      else setWidth(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideMobileMenu = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMobileMenu);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideMobileMenu);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbars-logo">
          <Link to="/">
            <div className="navbar-logo-text">
              <FaRobot className="logo-icon" />
              <span>PropBot</span>
            </div>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/saved-properties" className="nav-link">Saved Properties</Link>
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-section" ref={dropdownRef}>
              <button className="user-button" onClick={toggleDropdown}>
                <FaRegUser />
                <span>{user.name}</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleProfileRedirect}>
                    My Profile
                  </button>
                  <button className="auth-logout-button" onClick={logoutUser}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Navigation items row - always visible on Saved Properties, Property Detail, else only when scrolled */}
      {(isScrolled || location.pathname === "/saved-properties" || location.pathname.startsWith("/property/") || location.pathname === "/compare") && (
        <div className="navbar-navigation">
          <h2 className="navbar-main-heading">Propbot: Your Real Estate Home Finder</h2>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="mobile-menu" ref={mobileMenuRef}>
          <Link to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>
            Home
          </Link>
          <Link to="/about" className="mobile-nav-link" onClick={toggleMobileMenu}>
            About
          </Link>
          <Link to="/saved-properties" className="mobile-nav-link" onClick={toggleMobileMenu}>
            Saved Properties
          </Link>
          {user ? (
            <>
              <button 
                className="mobile-nav-link" 
                onClick={() => {
                  handleProfileRedirect();
                  toggleMobileMenu();
                }}
              >
                My Profile
              </button>
              <button 
                className="mobile-nav-link" 
                onClick={() => {
                  logoutUser();
                  toggleMobileMenu();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={toggleMobileMenu}>
                Login
              </Link>
              <Link to="/signup" className="mobile-nav-link" onClick={toggleMobileMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
