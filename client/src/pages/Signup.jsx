import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    const created = await register(name, email, password, "customer");
    setIsSubmitting(false);

    if (created) {
      navigate("/");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="You need one to book a ride or apply to drive."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="link">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="signup-name" className="field-label">
            Full name
          </label>
          <div className="group relative">
            <User
              size={17}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute transition-colors duration-200 group-focus-within:text-amber"
            />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className="field pl-11"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="field-label">
            Email
          </label>
          <div className="group relative">
            <Mail
              size={17}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute transition-colors duration-200 group-focus-within:text-amber"
            />
            <input
              id="signup-email"
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
          <label htmlFor="signup-password" className="field-label">
            Password
          </label>
          <PasswordField
            id="signup-password"
            autoComplete="new-password"
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
          Create account
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
