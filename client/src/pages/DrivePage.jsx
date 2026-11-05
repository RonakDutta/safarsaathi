import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  LoaderCircle,
  ClipboardCheck,
  BadgeCheck,
  CalendarClock,
  Hourglass,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../api/axios";
import { AuthContext } from "../context/authContext";
import PageLayout from "../components/PageLayout";
import { PageHero, SectionHeading } from "../components/Section";
import { images } from "../lib/images";

const requirements = [
  "A SafarSaathi account",
  "A working phone number",
  "A registered car you will drive",
  "A valid government driving licence",
];

const afterApplying = [
  {
    icon: ClipboardCheck,
    title: "We review your details",
    body: "Our team checks your licence number and vehicle by hand.",
  },
  {
    icon: BadgeCheck,
    title: "Your account is upgraded",
    body: "Once approved, log in again and you get a driver dashboard.",
  },
  {
    icon: CalendarClock,
    title: "Rides are assigned to you",
    body: "Bookings show up on your dashboard with the pickup, hours and customer number.",
  },
];

function StatusPanel({ icon, title, body, children }) {
  const Icon = icon;
  return (
    <PageLayout>
      <section className="container-page flex justify-center pt-36 pb-28">
        <div className="surface w-full max-w-md p-8 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber/10 text-amber">
            <Icon size={26} />
          </span>
          <h1 className="mt-6 text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-3 leading-relaxed text-mute">{body}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </PageLayout>
  );
}

function DrivePage() {
  const { user } = useContext(AuthContext);
  const [appStatus, setAppStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.full_name || user?.name || "",
    phone: "",
    carModel: "",
    licenseNumber: "",
  });

  useEffect(() => {
    const checkStatus = async () => {
      if (user?.role === "driver") {
        setAppStatus("already_driver");
        setIsLoading(false);
        return;
      }

      if (user) {
        try {
          const res = await axios.get(
            "/api/driver-apply/my-application-status",
          );
          setAppStatus(res.data.status);
        } catch (err) {
          console.error("Error checking status", err);
        }
      }
      setIsLoading(false);
    };

    checkStatus();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/driver-apply", formData);
      toast.success("Application sent. We will be in touch.");
      setAppStatus("pending");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to send application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-amber">
        <LoaderCircle size={28} className="animate-spin" />
      </div>
    );
  }

  if (appStatus === "already_driver") {
    return (
      <StatusPanel
        icon={BadgeCheck}
        title="You are already driving with us"
        body="Your account is approved. Open your dashboard to see the rides assigned to you."
      >
        <Link to="/driver" className="btn-primary">
          Go to my rides
        </Link>
      </StatusPanel>
    );
  }

  if (appStatus === "pending") {
    return (
      <StatusPanel
        icon={Hourglass}
        title="Your application is being reviewed"
        body="Our team is checking your vehicle details and licence. Once you are approved, log in again to see your driver dashboard."
      >
        <Link to="/" className="btn-secondary">
          Back to home
        </Link>
      </StatusPanel>
    );
  }

  const form = user ? (
    <form
      id="apply"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-panel/95 p-5 shadow-2xl shadow-black/60 backdrop-blur sm:p-7"
    >
      <h2 className="text-lg font-semibold text-white">Driver application</h2>
      {appStatus === "rejected" ? (
        <p className="mt-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-fog">
          Your last application was not approved. Check your details and feel
          free to apply again.
        </p>
      ) : (
        <p className="mt-1 text-sm text-mute">
          Linked to {user.email || "your account"}.
        </p>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="apply-name" className="field-label">
            Full name
          </label>
          <input
            id="apply-name"
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            className="field"
            required
          />
        </div>

        <div>
          <label htmlFor="apply-phone" className="field-label">
            Phone number
          </label>
          <div className="field-group">
            <span className="flex items-center pl-4 text-sm text-mute">
              +91
            </span>
            <input
              id="apply-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10 digits"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
              className="w-full min-w-0 bg-transparent px-3 py-3 text-sm text-white tabular-nums placeholder:text-dim"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="apply-carModel" className="field-label">
            Car model
          </label>
          <input
            id="apply-carModel"
            name="carModel"
            type="text"
            placeholder="Maruti Swift 2020"
            value={formData.carModel}
            onChange={handleChange}
            className="field"
            required
          />
        </div>

        <div>
          <label htmlFor="apply-licenseNumber" className="field-label">
            Driving licence number
          </label>
          <input
            id="apply-licenseNumber"
            name="licenseNumber"
            type="text"
            placeholder="MH12 20190012345"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="field"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-6 w-full py-3.5"
      >
        {isSubmitting && <LoaderCircle size={18} className="animate-spin" />}
        Submit application
      </button>
    </form>
  ) : (
    <div
      id="apply"
      className="rounded-3xl border border-white/10 bg-panel/95 p-6 shadow-2xl shadow-black/60 backdrop-blur sm:p-8"
    >
      <h2 className="text-xl font-semibold text-white">
        Start with an account
      </h2>
      <p className="mt-3 leading-relaxed text-mute">
        Applications are linked to your SafarSaathi account, so we can upgrade
        it once you are approved.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Link to="/signup" className="btn-primary">
          Create an account
        </Link>
        <Link to="/login" className="btn-secondary">
          I already have an account
        </Link>
      </div>
    </div>
  );

  return (
    <PageLayout>
      <PageHero
        image={images.taxi}
        title={
          <>
            Drive with us, <span className="text-amber">on your schedule.</span>
          </>
        }
        body="Customers book drivers by the hour, so there is no chasing short trips. Apply once, get verified and take the rides assigned to you."
        aside={form}
      >
        <ul className="mt-8 space-y-3">
          {requirements.map((item) => (
            <li key={item} className="flex items-center gap-3 text-fog">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber">
                <Check size={12} strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="bg-coal py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            title="What happens after you apply."
            className="mb-14"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {afterApplying.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="surface lift p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/10 text-amber">
                      <Icon size={21} />
                    </span>
                    <span className="text-3xl font-bold text-white/10 tabular-nums">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default DrivePage;
