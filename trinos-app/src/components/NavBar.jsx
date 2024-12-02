import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-white h-[10vh] w-[90%] text-black px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center justify-center mt-4">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dj3xwsle9/image/upload/v1732934248/trinos_yzi9rc.png"
            alt="Logo"
            className="w-40 cursor-pointer"
          />
        </Link>
      </div>

      {/* Links */}
      <ul className="flex space-x-6">
        <li>
          <Link
            to="/"
            className="hover:text-yellow-400 transition-colors duration-300"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/nosotros"
            className="hover:text-yellow-400 transition-colors duration-300"
          >
            Nosotros
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className="hover:text-yellow-400 transition-colors duration-300"
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
