import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  LoaderCircle,
  User,
  Mail,
  Phone,
  CarFront,
  IdCard,
  ClipboardCheck,
  BadgeCheck,
  CalendarClock,
  Hourglass,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../api/axios";
import { AuthContext } from "../context/authContext";
import PageLayout from "../components/PageLayout";
import Reveal from "../components/Reveal";
import { PageHero, SectionHeading } from "../components/Section";

const requirements = [
  "A SafarSaathi account",
  "A working email and phone number",
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
    body: "Once approved, you log in as usual and get a driver dashboard.",
  },
  {
    icon: CalendarClock,
    title: "Rides are assigned to you",
    body: "Bookings show up on your dashboard with the pickup, hours and customer number.",
  },
];

const fields = [
  {
    name: "name",
    label: "Full name",
    type: "text",
    autoComplete: "name",
    icon: User,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    icon: Mail,
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    autoComplete: "tel",
    icon: Phone,
  },
  {
    name: "carModel",
    label: "Car model",
    type: "text",
    placeholder: "Maruti Swift 2020",
    icon: CarFront,
  },
  {
    name: "licenseNumber",
    label: "Driving licence number",
    type: "text",
    placeholder: "MH12 20190012345",
    icon: IdCard,
  },
];

function StatusPanel({ icon, title, body, children }) {
  const Icon = icon;
  return (
    <PageLayout>
      <section className="relative isolate overflow-hidden">
        <div className="bg-grid mask-fade absolute inset-0 -z-10" />
        <div className="absolute top-1/3 left-1/2 -z-10 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-amber/15 blur-[120px]" />
        <div className="container-page flex justify-center pt-36 pb-24 lg:pt-44 lg:pb-32">
          <div className="animate-pop relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/[0.08] bg-panel p-8 text-center sm:p-12">
            <div className="checker absolute inset-x-0 top-0 h-2 [--sq:4px]" />
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber text-black shadow-[0_20px_50px_-15px_rgb(255_193_7/0.6)]">
              <Icon size={34} />
            </div>
            <h1 className="mt-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
            <p className="mt-4 leading-relaxed text-mute">{body}</p>
            <div className="mt-9">{children}</div>
          </div>
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink text-amber">
        <LoaderCircle size={32} className="animate-spin" />
        <p className="text-sm text-mute">Checking your application</p>
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
        <Link to="/driver" className="btn-primary group px-6 py-3.5">
          Go to my rides
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
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
        <Link to="/" className="btn-secondary px-6 py-3">
          Back to home
        </Link>
      </StatusPanel>
    );
  }

  const form = user ? (
    <form
      id="apply"
      onSubmit={handleSubmit}
      className="relative scroll-mt-28 overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-panel/90 shadow-[0_40px_120px_-30px_rgb(0_0_0/1)] backdrop-blur-xl"
    >
      <div className="checker absolute inset-x-6 top-0 h-1.5 rounded-b-md [--sq:3px]" />
      <div className="px-5 pt-8 sm:px-7">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Driver application
        </h2>
        {appStatus === "rejected" ? (
          <p className="mt-3 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-fog">
            Your last application was not approved. Check your details and
            feel free to apply again.
          </p>
        ) : (
          <p className="mt-1 text-sm text-mute">Takes about two minutes.</p>
        )}
      </div>

      <div className="space-y-4 px-5 py-7 sm:px-7">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.name}>
              <label htmlFor={`apply-${field.name}`} className="field-label">
                {field.label}
              </label>
              <div className="group relative">
                <Icon
                  size={17}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-dim transition-colors duration-200 group-focus-within:text-amber"
                />
                <input
                  id={`apply-${field.name}`}
                  type={field.type}
                  name={field.name}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="field pl-11"
                  required
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/[0.06] bg-black/40 px-5 py-6 sm:px-7">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary group w-full py-4 text-base"
        >
          {isSubmitting && <LoaderCircle size={18} className="animate-spin" />}
          Submit application
          {!isSubmitting && (
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
        </button>
      </div>
    </form>
  ) : (
    <div
      id="apply"
      className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-panel p-7 sm:p-9"
    >
      <div className="checker absolute inset-x-6 top-0 h-1.5 rounded-b-md [--sq:3px]" />
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber text-black">
        <User size={24} />
      </span>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
        Start with an account
      </h2>
      <p className="mt-3 leading-relaxed text-mute">
        Applications are linked to your SafarSaathi account, so we can upgrade
        it once you are approved.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link to="/signup" className="btn-primary py-4 text-base">
          Create an account
        </Link>
        <Link to="/login" className="btn-secondary py-4 text-base">
          I already have an account
        </Link>
      </div>
    </div>
  );

  return (
    <PageLayout>
      <PageHero
        title={
          <>
            Drive with us, <span className="text-amber">on your schedule.</span>
          </>
        }
        body="Customers book drivers by the hour, so there is no chasing short trips. Apply once, get verified and take the rides assigned to you."
        aside={form}
      >
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {requirements.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 text-sm text-fog"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber text-black">
                <Check size={14} strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="container-page pb-20 lg:pb-32">
        <SectionHeading
          title="What happens after you apply."
          className="mb-12"
        />
        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {afterApplying.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 90}>
                <div className="group card card-hover relative h-full overflow-hidden p-6 sm:p-8">
                  <span className="absolute top-5 right-6 text-6xl leading-none font-extrabold tracking-tighter text-white/[0.06] tabular-nums">
                    {index + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber/10 text-amber transition-colors duration-300 group-hover:bg-amber group-hover:text-black">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-white sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-mute">{step.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </PageLayout>
  );
}

export default DrivePage;
