import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AddService from "./pages/AddService";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";
import useUserIdentity from "./utils/Identity";
import Credit from "./pages/Credit";
import Footer from "./components/Footer";
import OtherProfile from "./pages/OtherProfile";

function App() {
  const { userIdentity } = useUserIdentity();

  return (
    <div className="app">
      <NavBar />
      <div>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/credit" element={<Credit />} />
          <Route path="/addservice" element={<AddService />} />
          <Route
            path="/profile"
            element={<Profile userIdentity={userIdentity} />}
          />
          <Route path="/otherprofile" element={<OtherProfile />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
