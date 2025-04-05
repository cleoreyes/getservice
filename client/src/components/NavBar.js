import React from "react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHouse,
  FaUser,
  FaCirclePlus,
  FaArrowRightFromBracket,
  FaArrowRightToBracket,
  FaArrowLeft,
} from "react-icons/fa6";

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/users/myIdentity")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "loggedin") {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      });
  }, []);

  return (
    <nav className="bg-white flex flex-row justify-between items-center py-4 px-6 md:px-20 lg:px-60 sticky top-0 z-50">
      <strong className="text-2xl">
        <NavLink to="/home">GetService</NavLink>
      </strong>
      <div className="flex flex-row text-base gap-10 items-center">
        <NavLink
          className="flex flex-col items-center justify-centern gap-1"
          to="/home"
        >
          <FaHouse className="text-2xl" />
          <span className="text-xs">Home</span>
        </NavLink>
        {loggedIn ? (
          <>
            <NavLink
              className="flex flex-col items-center justify-center gap-1"
              to="/addservice"
            >
              <FaCirclePlus className="text-2xl" />
              <span className="text-xs">Add Service</span>
            </NavLink>
            <NavLink
              className="flex flex-col items-center justify-center gap-1"
              to="/profile"
            >
              <FaUser className="text-2xl" />
              <span className="text-xs">Profile</span>
            </NavLink>
          </>
        ) : (
          <></>
        )}
        {loggedIn ? (
          <a
            className="bg-blue-600 rounded-xl px-4 py-1 text-white justify-center gap-1 items-center flex flex-col-reverse"
            href="https://get-service-ten.vercel.app//signout"
          >
            <p className="text-xs">Log out</p>
            <FaArrowRightFromBracket className="text-lg" />
          </a>
        ) : (
          <a
            className="bg-blue-600 rounded-xl px-4 py-1 text-white flex flex-row justify-center gap-2 items-center flex flex-col-reverse"
            href="https://get-service-ten.vercel.app//signin"
          >
            <p className="text-xs">Log in</p>
            <FaArrowRightToBracket className="text-lg" />
          </a>
        )}
      </div>
    </nav>
  );
}
