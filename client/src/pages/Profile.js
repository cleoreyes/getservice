import React, { useEffect, useState } from "react";
import Services from "../components/Services";

function Profile() {
  const [userIdentity, setUserIdentity] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Fetch user identity
  useEffect(() => {
    const fetchUserIdentity = async () => {
      try {
        const response = await fetch("/api/users/myIdentity");
        const data = await response.json();

        if (data.status === "loggedin") {
          setUserIdentity(data.userInfo);
          fetchProfilePicture(data.userInfo.useremail);
        } else {
          setUserIdentity(null);
        }
      } catch (error) {
        console.error("Error fetching user identity:", error);
      }
    };

    fetchUserIdentity();
  }, []);

  // Fetch profile picture
  const fetchProfilePicture = async (userEmail) => {
    if (!userEmail) return;

    try {
      const response = await fetch(
        `/api/users/profilePicture?email=${userEmail}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile picture");
      }

      const blob = await response.blob();
      setImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle image upload
  const handleUpload = async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");

    if (!fileInput.files.length) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
      const response = await fetch(
        `api/users/uploadProfilePicture?email=${userIdentity.useremail}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("Profile picture updated successfully!");
      fetchProfilePicture(userIdentity.useremail); // Refresh image
      setShowUploadForm(false); // Hide upload form after upload
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

  if (!userIdentity) {
    return (
      <div className="flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  const { name, useremail } = userIdentity;

  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="flex flex-row items-center justify-between border-b-2 pb-2 gap-16">
          <div className="w-full max-w-4xl text-center">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto"
              />
            ) : (
              <p>No profile picture available</p>
            )}

            {/* Change Profile Picture Button */}
            <button
              type="button"
              className="bg-blue-500 text-white text-sm px-2 py-1 rounded mt-2"
              onClick={() => setShowUploadForm(true)}
            >
              Change Picture
            </button>

            {/* Upload Form */}
            {showUploadForm && (
              <form onSubmit={handleUpload} className="mt-4">
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block mx-auto"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full mt-2 mx-auto"
                  />
                )}
                <button
                  type="submit"
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Upload
                </button>
              </form>
            )}
          </div>
          <div className="w-full max-w-4xl start-left">
            <h1 className="text-xl font-bold mb-2 py-4">{name}</h1>
            <p className="text-lg font-semibold text-gray-700">
              {useremail || "Unknown User"}
            </p>
          </div>
        </div>

        {/* User's Services */}
        <div className="mt-6 max-w-4xl">
          <Services userIdentity={useremail} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
