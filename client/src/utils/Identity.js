import { useState, useEffect } from "react";

export default function useUserIdentity() {
  const [userIdentity, setUserIdentity] = useState(null);

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const response = await fetch("/api/users/myIdentity");
        if (!response.ok) {
          throw new Error("Failed to load identity");
        }
        const data = await response.json();
        console.log("User Identity:", data);

        if (data.status === "loggedin" && data.userInfo?.useremail) {
          setUserIdentity(data.userInfo.useremail);
        } else {
          setUserIdentity(null);
        }
      } catch (err) {
        console.error("Error fetching identity:", err);
      } finally {
      }
    };

    fetchIdentity();
  }, []);

  return { userIdentity };
}
