import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../feature/authSlice";
import "../index.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .then((response) => {
        if (response.type === "auth/login/fulfilled") {
          navigate("/home"); // Redirect to /home if login is successful
        }
      });
  };

  return (
    <div className="grid grid-cols-4 h-screen bg-black text-white">
      {/* Left 3/4ths */}
      <div className="col-span-3"></div>

      {/* Right 1/4th */}
      <div className="flex items-center justify-center mr-8">
        <form
          onSubmit={handleSubmit}
          className="bg-[#D4D5D4] p-4 rounded-lg shadow-lg w-[400px] max-w-full h-[400px] flex flex-col"
        >
           <h2 className="login-heading mb-10 text-center text-[#272627]">
            Login
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 mb-6 bg-[#E6E6E6] text-[#272627] rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 mb-6 bg-[#E6E6E6] text-[#272627] rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          {/* Login Button at the bottom */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 bg-black rounded text-white font-bold mt-auto ${
              loading
                ? "cursor-not-allowed bg-gray-500"
                : "hover:bg-gray-800"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
