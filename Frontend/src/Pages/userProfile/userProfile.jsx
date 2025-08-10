
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../redux/slices/userSlice";
import { useNavigate, NavLink, Routes, Route } from "react-router-dom";
import ProfileDetails from "../../Components/user/ProfileDetails";
import SavedProperties from "../SavedProperties/SavedProperties";
import "./userProfile.css";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  if (!user) {
    return <p>No user data available. Please log in.</p>;
  }

  return (
    <div className="user-profile">
      <div className="navigation-strip">
        <ul>
          <li>
            <NavLink to="/profile/details" className={({ isActive }) => (isActive ? "active" : "")}>Profile</NavLink>
          </li>
          <li>
            <NavLink to="/profile/saved" className={({ isActive }) => (isActive ? "active" : "")}>Saved Properties</NavLink>
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <div className="content">
        <Routes>
          <Route path="/details" element={<ProfileDetails />} />
          <Route path="/saved" element={<SavedProperties profileView={true} />} />
          <Route path="*" element={<ProfileDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserProfile;
