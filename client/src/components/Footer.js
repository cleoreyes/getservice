import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="text-center text-xs p-3 w-full">
      <p>
        © 2025 • GetService •{" "}
        <NavLink to="/credit" className="text-purple-500">
          Created with love by us
        </NavLink>
      </p>
    </footer>
  );
}
