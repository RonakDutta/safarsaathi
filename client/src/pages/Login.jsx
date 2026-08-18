import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const success = await login(email, password);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] font-['Poppins',sans-serif] p-4 bg-[linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url('https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2070&auto-format&fit=crop')] bg-cover bg-center bg-fixed">
      {/* Container */}
      <div className="relative bg-[#1e1e1e] px-8 py-10 md:px-12 md:py-12 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-full max-w-112.5 text-center border border-[#2a2a2a]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-transparent border-none text-[#888] text-xl cursor-pointer transition-all duration-300 p-2 hover:text-[#ffc107] hover:rotate-90 flex items-center justify-center"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-white text-3xl font-semibold mb-2 tracking-wide">
            Welcome Back
          </h2>
          <p className="text-[#e0e0e0] text-sm opacity-80">
            Please log in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Input */}
          <div className="relative group">
            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-[#888] transition-colors duration-300 group-focus-within:text-[#ffc107]"></i>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full py-3.5 pr-4 pl-11 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e0e0e0] text-base transition-all duration-300 placeholder:text-[#666] focus:outline-none focus:border-[#ffc107] focus:shadow-[0_0_0_3px_rgba(255,193,7,0.1)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-[#888] transition-colors duration-300 group-focus-within:text-[#ffc107]"></i>
            <input
              type="password"
              placeholder="Password"
              className="w-full py-3.5 pr-4 pl-11 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e0e0e0] text-base transition-all duration-300 placeholder:text-[#666] focus:outline-none focus:border-[#ffc107] focus:shadow-[0_0_0_3px_rgba(255,193,7,0.1)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 border-none rounded-lg bg-[#ffc107] text-black font-semibold text-base cursor-pointer transition-all duration-300 hover:bg-[#ffca2c] hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(255,193,7,0.2)] active:scale-95"
          >
            Login
          </button>
        </form>

        {/* Toggle Link */}
        <p className="mt-8 text-sm text-[#e0e0e0]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#ffc107] font-semibold cursor-pointer transition-colors duration-300 hover:text-[#ffca2c] ml-1 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
