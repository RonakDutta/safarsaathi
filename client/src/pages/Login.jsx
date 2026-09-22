import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      navigate("/");
    }
  };

  return (
    <AuthLayout
      title="Log in"
      description="Welcome back. Pick up where you left off."
      footer={
        <>
          New to SafarSaathi?{" "}
          <Link to="/signup" className="link">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="field-label">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="login-password" className="field-label">
            Password
          </label>
          <PasswordField
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary mt-3 w-full py-3.5 text-base"
        >
          {isSubmitting && <LoaderCircle size={18} className="animate-spin" />}
          Log in
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
