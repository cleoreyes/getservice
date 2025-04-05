import React, { useEffect, useState } from "react";
import Services from "../components/Services";
import { useLocation } from "react-router-dom";

function OtherProfile() {
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    const email = params.get("userEmail");
    const name = params.get("userName");
    setUserEmail(email);
    setUserName(name);

    if (email) {
      fetchProfilePicture(email);
    }
  }, [location.search]);

  const fetchProfilePicture = async (userEmail) => {
    try {
      const response = await fetch(
        `/api/users/profilePicture?email=${userEmail}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile picture");
      }
      const blob = await response.blob();
      setProfilePicture(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  if (!userEmail) {
    return (
      <div className="flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="flex flex-row items-center justify-between border-b-2 pb-2 gap-16">
          <div className="w-full max-w-4xl text-center">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto"
              />
            ) : (
              <p>No profile picture available</p>
            )}
          </div>
          <div className="w-full max-w-4xl start-left">
            <h1 className="text-xl font-bold mb-2 py-4">{userName}</h1>
            <p className="text-lg font-semibold text-gray-700">
              {userEmail || "Unknown User"}
            </p>
          </div>
        </div>
        <div className="mt-6 max-w-4xl">
          <Services userIdentity={userEmail} />
        </div>
      </div>
    </div>
  );
}

export default OtherProfile;
