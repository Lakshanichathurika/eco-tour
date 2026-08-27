import { useEffect, useRef, useState } from "react";
import heroImg from "../assets/hero.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile, changePassword as changePasswordRequest } from "../lib/api";

const MAX_PICTURE_BYTES = 1_000_000;

const inputClass =
  "w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white placeholder-gray-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40";
const textareaClass =
  "w-full rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-white placeholder-gray-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40";

function Profile() {
  const { token, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!token) return;
    getProfile(token)
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
        setProfilePicture(data.profilePicture || "");
      })
      .catch(() => setLoadError("Couldn't load your profile. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  const handlePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PICTURE_BYTES) {
      setProfileError("Profile picture is too large (max 1MB).");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileError(null);
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!name.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await updateProfile({ name, email, phone, bio, profilePicture }, token);
      updateUser(updated);
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      await changePasswordRequest({ currentPassword, newPassword }, token);
      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="min-h-screen bg-black/60">
        <Navbar />

        <div className="flex flex-col items-center px-5 py-20 gap-10">
          <h1 className="text-white text-4xl font-serif text-center">Edit Profile</h1>

          {loading ? (
            <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl p-10 text-center text-gray-300">
              Loading your profile...
            </div>
          ) : loadError ? (
            <div className="w-full max-w-md bg-red-950/40 border border-red-400/30 rounded-3xl p-10 text-center text-red-300">
              {loadError}
            </div>
          ) : (
            <>
              {/* Profile form */}
              <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl p-10">
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="h-24 w-24 rounded-full bg-white/10 border border-white/30 bg-cover bg-center cursor-pointer"
                      style={profilePicture ? { backgroundImage: `url(${profilePicture})` } : undefined}
                      onClick={() => fileInputRef.current?.click()}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-yellow-400 hover:underline text-sm"
                    >
                      Change photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePictureChange}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2" htmlFor="profile-name">
                      Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2" htmlFor="profile-email">
                      Email
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2" htmlFor="profile-phone">
                      Phone
                    </label>
                    <input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2" htmlFor="profile-bio">
                      Bio
                    </label>
                    <textarea
                      id="profile-bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={textareaClass}
                      placeholder="Tell us a bit about yourself"
                    />
                  </div>

                  {profileError && <p className="text-red-400 text-sm text-center">{profileError}</p>}
                  {profileSuccess && (
                    <p className="text-green-400 text-sm text-center">{profileSuccess}</p>
                  )}

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full text-lg font-semibold transition disabled:opacity-50"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>

              {/* Change password */}
              <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl p-10">
                <h2 className="text-white text-2xl font-serif text-center mb-6">Change Password</h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-200 mb-2" htmlFor="current-password">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2" htmlFor="new-password">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2" htmlFor="confirm-new-password">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-new-password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                  </div>

                  {passwordError && <p className="text-red-400 text-sm text-center">{passwordError}</p>}
                  {passwordSuccess && (
                    <p className="text-green-400 text-sm text-center">{passwordSuccess}</p>
                  )}

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full text-lg font-semibold transition disabled:opacity-50"
                  >
                    {changingPassword ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Profile;
