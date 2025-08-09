import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import Footer from './Components/Footer/Footer';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import ForgotPassword from './Pages/forgotpassword/ForgotPassword';
import UserProfile from './Pages/userProfile/userProfile'; 
import About from './Pages/About/About';


import './App.css';
import SearchResults from './Pages/SearchResults/SearchResults';
import PropertyDetail from './Pages/propertyDetail/propertyDetail';
import SavedProperties from './Pages/SavedProperties/SavedProperties';
import ComparePage from './Pages/Compare/ComparePage';
import CompareBar from './Components/CompareBar/CompareBar';

const AppContent = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/about' element={<About/>}/>
        <Route path="/profile/*" element={<UserProfile />}/>
        <Route path="/search" element={<SearchResults />} />
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
