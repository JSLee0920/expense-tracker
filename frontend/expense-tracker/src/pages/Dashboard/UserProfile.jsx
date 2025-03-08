import React, { useContext, useState, useEffect } from 'react';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';
import { API_PATHS } from '../../utils/apiPaths';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const UserProfile = () => {
    useUserAuth();
  const { user, updateUser } = useContext(UserContext);
  
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!fullName) {
      setError("Please enter your full name");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let profileImageUrl = user?.profileImageUrl || "";

      // Upload new image if selected
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      // Only update if there are changes
      if (fullName !== user.fullName || profilePic) {
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER, {
          fullName,
          profileImageUrl
        });

        if (response.data.user) {
          // Update user context with new data
          updateUser(response.data.user);
          setSuccess("Profile updated successfully!");
        }
      } else {
        setSuccess("No changes detected.");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="User Profile">
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-black mb-2">Your Profile</h1>
        <p className="text-sm text-slate-700 mb-6">
          Update your personal information and profile picture
        </p>

        <form onSubmit={handleUpdateProfile}>
          <div className="mb-6 flex justify-center">
            {/* Using your existing ProfilePhotoSelector as is */}
            <ProfilePhotoSelector 
              image={profilePic} 
              setImage={setProfilePic} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input 
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Your Name"
              type="text"
            />
            <Input 
              value={email}
              onChange={() => {}} // Email is read-only
              label="Email Address"
              placeholder="your@email.com"
              type="text"
              disabled={true}
              helperText="Email cannot be changed"
            />
          </div>

          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          {success && <p className="text-green-500 text-xs mb-4">{success}</p>}
          
          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setFullName(user?.fullName || "");
                setProfilePic(null);
                setError("");
                setSuccess("");
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default UserProfile;