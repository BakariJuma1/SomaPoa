import{ useState } from "react";
import { useAuth } from "../context/AuthProvider";
import "../assets/styles/profile.css"; // Assuming you're putting styles here

const Profile = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setShowModal(true);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setError("");
    setSuccess("");
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = async () => {
    setError("");
    setSuccess("");

    if (newPwd !== confirmPwd) {
      setError("New passwords do not match.");
      return;
    }

    if (newPwd.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://somapoa.onrender.com/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: currentPwd,
          newPassword: newPwd,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password.");

      setSuccess("Password changed successfully.");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setTimeout(closeModal, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.username) {
    return (
      <div className="application-details-container loading-screen">
        <div className="spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="application-details-container">
      <h2>Your Profile</h2>
      <div className="application-details-card">
        <div><strong>Username:</strong> {user.username}</div>
        <div><strong>Email:</strong> {user.email || "N/A"}</div>
        <div><strong>Role:</strong> {user.role}</div>
      </div>

      <button className="edit-btn" onClick={openModal}>
        Change Password
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Change Password</h3>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="info-msg">{success}</div>}

            <label>Current Password</label>
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              required
            />

            <label>New Password</label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              required
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
            />

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="save-btn" onClick={handlePasswordChange} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
