import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Check, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";

const requirements = [
  "A SafarSaathi account",
  "A working email and phone number",
  "A registered car you'll drive",
  "A valid government driving licence",
];

const afterApplying = [
  {
    title: "We review your details",
    body: "Our team checks your licence number and vehicle by hand.",
  },
  {
    title: "Your account is upgraded",
    body: "Once approved, you log in as usual and get a driver dashboard.",
  },
  {
    title: "Rides are assigned to you",
    body: "Bookings appear on your dashboard with the pickup, hours and customer's number.",
  },
];

const fields = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  {
    name: "carModel",
    label: "Car model",
    type: "text",
    placeholder: "e.g. Maruti Swift 2020",
  },
  {
    name: "licenseNumber",
    label: "Driving licence number",
    type: "text",
    placeholder: "e.g. MH12 20190012345",
  },
];

function StatusPanel({ title, body, children }) {
  return (
    <PageLayout>
      <section className="container-page py-24 lg:py-32">
        <div className="max-w-xl border-l-2 border-amber pl-8">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-mute">{body}</p>
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
    email: user?.email || "",
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
          const res = await axios.get("/api/driver/my-application-status");
          if (res.data) setAppStatus(res.data.status); // 'pending', 'rejected', or null
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
    setIsSubmitting(true);
    try {
      await axios.post("/api/driver-apply", formData);
      toast.success("Application sent. We'll be in touch.");
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
        <LoaderCircle size={32} className="animate-spin" />
      </div>
    );
  }

  if (appStatus === "already_driver") {
    return (
      <StatusPanel
        title="You're already driving with us."
        body="Your account is approved. Open your dashboard to see the rides assigned to you."
      >
        <Link to="/driver" className="btn-primary px-6 py-3.5">
          Go to my rides
        </Link>
      </StatusPanel>
    );
  }

  if (appStatus === "pending") {
    return (
      <StatusPanel
        title="Your application is being reviewed."
        body="Our team is checking your vehicle details and licence. Your account will be upgraded as soon as you're approved — just log in again to see your driver dashboard."
      >
        <Link to="/" className="link">
          Back to home
        </Link>
      </StatusPanel>
    );
  }

  return (
    <PageLayout>
      <section className="container-page grid gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_27rem] lg:gap-20 lg:py-24">
        <div>
          <h1 className="max-w-xl text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            Drive with SafarSaathi, on your own schedule.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute">
            Customers book drivers by the hour, so there&apos;s no chasing
            short trips. Apply once, get verified, and take the rides that are
            assigned to you.
          </p>

          <div className="mt-14 grid gap-12 sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-white">
                What you&apos;ll need
              </h2>
              <ul className="mt-5 space-y-3">
                {requirements.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-fog">
                    <Check size={18} className="mt-0.5 shrink-0 text-amber" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                After you apply
              </h2>
              <ol className="mt-5 space-y-5">
                {afterApplying.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[1.5rem_1fr]">
                    <span className="font-semibold text-amber tabular-nums">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-mute">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div id="apply">
          {user ? (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-line bg-panel"
            >
              <div className="border-b border-line px-6 py-5">
                <h2 className="text-lg font-semibold text-white">
                  Driver application
                </h2>
                {appStatus === "rejected" && (
                  <p className="mt-2 text-sm text-mute">
                    Your last application wasn&apos;t approved. Check your
                    details and feel free to apply again.
                  </p>
                )}
              </div>

              <div className="space-y-5 px-6 py-6">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label htmlFor={`apply-${field.name}`} className="field-label">
                      {field.label}
                    </label>
                    <input
                      id={`apply-${field.name}`}
                      type={field.type}
                      name={field.name}
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="field"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="border-t border-line px-6 py-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3.5 text-base"
                >
                  {isSubmitting && (
                    <LoaderCircle size={18} className="animate-spin" />
                  )}
                  Submit application
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-line bg-panel p-8">
              <h2 className="text-xl font-semibold text-white">
                Start with an account
              </h2>
              <p className="mt-3 leading-relaxed text-mute">
                Applications are linked to your SafarSaathi account, so we can
                upgrade it once you&apos;re approved.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Link to="/signup" className="btn-primary py-3.5">
                  Create an account
                </Link>
                <Link to="/login" className="btn-secondary py-3.5">
                  I already have one — log in
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

export default DrivePage;
