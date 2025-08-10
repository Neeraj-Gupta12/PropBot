import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import Footer from './Components/Footer/Footer';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import ForgotPassword from './Pages/forgotpassword/ForgotPassword';
import { useSelector } from 'react-redux';
import UserProfile from './Pages/userProfile/userProfile'; 
import About from './Pages/About/About';


import './App.css';
import PropertyDetail from './Pages/propertyDetail/propertyDetail';
import SavedProperties from './Pages/SavedProperties/SavedProperties';
import ComparePage from './Pages/Compare/ComparePage';
import CompareBar from './Components/CompareBar/CompareBar';


// Route protection wrapper for auth pages
const AuthRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);
  return user ? null : children;
};

const AppContent = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        } />
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/forgot-password" element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        } />
        <Route path='/about' element={<About/>}/>
        <Route path="/profile/*" element={<UserProfile />}/>
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/saved-properties" element={<SavedProperties />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
      <CompareBar />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
