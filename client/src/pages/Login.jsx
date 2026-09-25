import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
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
    const loggedIn = await login(email, password);
    setIsSubmitting(false);

    if (loggedIn) {
      const home = { admin: "/admin", driver: "/driver" };
      navigate(home[loggedIn.role] || "/");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Good to see you again. Log in to continue."
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
          <div className="group relative">
            <Mail
              size={17}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-dim transition-colors duration-200 group-focus-within:text-amber"
            />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="field pl-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
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
          className="btn-primary mt-4 w-full py-4 text-base"
        >
          {isSubmitting && <LoaderCircle size={18} className="animate-spin" />}
          Log in
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;
