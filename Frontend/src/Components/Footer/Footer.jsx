
import "./Footer.css";
import { FaRegEnvelope, FaFacebookF, FaTwitter, FaWhatsapp, FaPinterestP, FaMapMarkerAlt, FaPhone, FaInstagram, FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer chatbot-footer">
      <div className="footer-top-row chatbot-footer-top">
        <div className="footer-logo chatbot-footer-logo">
          <FaRobot className="footer-logo-icon" />
          <span className="footer-logo-text">PropBot</span>
        </div>
        <p className="footer-desc">
          <b>PropBot</b> is your AI-powered property assistant.<br />
          Instantly get details, compare, and ask anything about properties, locations, or real estate—all in one chat!<br />
          <span className="footer-highlight">Try asking: <i>&quot;Show me 3BHK apartments in Gurugram under 50L&quot;</i></span>
        </p>
        <div className="social-icon">
          <FaFacebookF/>
          <FaTwitter/>
          <FaInstagram/>
          <FaWhatsapp/>
          <FaPinterestP/>
        </div>
      </div>

      <div className="footer-mid-row chatbot-footer-mid">
        <div className="f-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">Properties</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </ul>
        </div>
        <div className="f-col">
          <h3>Why PropBot?</h3>
          <ul>
            <li className="footer-service-item">AI Chat for instant property info</li>
            <li className="footer-service-item">Compare, filter, and shortlist easily</li>
            <li className="footer-service-item">24/7 property Q&A</li>
            <li className="footer-service-item">No agent spam, just answers</li>
          </ul>
        </div>
        <div className="f-col">
          <h3>Contact</h3>
          <div className="footer-contact-info">
            <p><FaMapMarkerAlt /> 123 PropBot Lane, Realty City</p>
            <p>India</p>
            <p className="email-id"><FaRegEnvelope /> propbot@support.com</p>
            <h4><FaPhone /> +91-9999999999</h4>
          </div>
        </div>
      </div>

      <hr />
      <div className="footer-bottom chatbot-footer-bottom">
        <p>&copy; 2025 PropBot. All rights reserved.</p>
        <p>Made with by <b>Neeraj</b></p>
      </div>
    </footer>
  );
};

export default Footer;
