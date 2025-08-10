import React, { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import "./ProfileDetails.css";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../../redux/api/userAPI";
import { UserContext } from "../../Context/UserContext";

const ProfileDetails = () => {
  const { user } = useSelector((state) => state.user);
  const { loginUser } = useContext(UserContext);
  const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updateUser] = useUpdateUserMutation();

  // Function to handle the file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Function to handle image upload
  const handleImageUpload = () => {
    if (selectedImage) {
      const cloudName = `${import.meta.env.VITE_CLOUD_NAME}`;
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", "IBM_Project");

      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Image uploaded successfully:", data.url);
          imageChange(data.url);
        })
        .catch((err) => {
          console.error("Error uploading image:", err);
          toast.error("Failed to upload image");
        });
    }
  };

  const imageChange = async (url) => {
    try {
      const formData = {
        name: user.name,
        email: user.email,
        photo: url,
      };

      const res = await updateUser(formData).unwrap();

      toast.success("Profile updated successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
      });
      console.log(res);
      loginUser(res.user, token);
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to update profile", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
      });
      console.error("Error updating profile:", error);
    } finally {
      setShowModal(false);
    }
  };

  // Function to handle password update
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    try {
      const formData = {
        password: newPassword,
      };

      const res = await updateUser(formData).unwrap();

      toast.success("Password updated successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
      });
      setShowPasswordModal(false);
    } catch (error) {
      toast.error("Failed to update password", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
      });
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Left Section: Profile Image and Add Button */}
        <div className="profile-image-section">
          <div className="image-container">
            <img src={user.photo} alt="Profile" className="round-img" />
            <button className="add-btn" onClick={() => setShowModal(true)}>
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Right Section: User Information */}
        <div className="profile-info-section">
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-role">{user.email}</p>
          <p className="profile-bio">
            Travel enthusiast with a passion for exploring new destinations. 
            Always on the lookout for the next adventure and unforgettable experiences.
          </p>

          <div className="profile-actions">
            <button
              className="follow-btn"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Image Upload */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Upload Profile Image</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div>
              <button onClick={handleImageUpload} disabled={!selectedImage}>
                Upload
              </button>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Password Change */}
      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Change Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div>
              <button
                onClick={handlePasswordChange}
                disabled={!newPassword || !currentPassword}
              >
                Update Password
              </button>
              <button onClick={() => setShowPasswordModal(false)} style={{backgroundColor:"red"}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
