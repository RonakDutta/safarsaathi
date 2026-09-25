import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Smartphone,
  UserCheck,
  CarFront,
  CarTaxiFront,
  KeyRound,
  BadgeCheck,
  MessageCircle,
  Check,
  CheckCheck,
  TrendingUp,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import BookingForm from "../components/BookingForm";
import Reveal from "../components/Reveal";
import Marquee from "../components/Marquee";
import RoadTimeline from "../components/RoadTimeline";
import { SectionHeading } from "../components/Section";
import { HOURLY_RATE, formatINR } from "../lib/pricing";
import { images } from "../lib/images";

const heroStats = [
  { value: formatINR(HOURLY_RATE), label: "flat per hour" },
  { value: "1 to 24", label: "hours per booking" },
  { value: "4-digit", label: "PIN to end ride" },
];

const ticker = [
  "Verified drivers",
  `${formatINR(HOURLY_RATE)} an hour`,
  "No surge pricing",
  "1 to 24 hours",
  "Pay online or cash",
  "Updates on WhatsApp",
  "PIN-secured drop off",
];

const steps = [
  {
    icon: Smartphone,
    title: "Book in seconds",
    body: "Add your pickup point, pick your hours and pay online or choose cash.",
  },
  {
    icon: UserCheck,
    title: "Meet your driver",
    body: "We assign a verified driver and send their name, car and number to your WhatsApp.",
  },
  {
    icon: CarFront,
    title: "Ride your way",
    body: "Your driver stays with you for the full booking. Stops and waiting are included.",
  },
  {
    icon: KeyRound,
    title: "End with your PIN",
    body: "Share the 4-digit PIN only when you are done. That is what closes the ride.",
  },
];

const examples = [
  { use: "Groceries and a few errands", hours: 2 },
  { use: "Meetings across the city", hours: 5 },
  { use: "Airport run with a wait", hours: 4 },
  { use: "A wedding or a full day out", hours: 12 },
];

const checks = ["Licence number", "Vehicle details", "Approved by our team"];

function HeroRoute() {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <path
        d="M-40 690 C 180 640, 260 470, 470 470 S 760 610, 900 420 S 1080 140, 1260 110"
        fill="none"
        stroke="rgb(255 255 255 / 0.05)"
        strokeWidth="46"
        strokeLinecap="round"
      />
      <path
        d="M-40 690 C 180 640, 260 470, 470 470 S 760 610, 900 420 S 1080 140, 1260 110"
        fill="none"
        stroke="#ffc107"
        strokeOpacity="0.55"
        strokeWidth="2.5"
        strokeDasharray="14 14"
        className="route-flow"
      />
      <circle cx="470" cy="470" r="7" fill="#ffc107" />
      <circle cx="470" cy="470" r="18" fill="#ffc107" fillOpacity="0.15" />
      <circle cx="900" cy="420" r="5" fill="#fff" fillOpacity="0.5" />
    </svg>
  );
}

function PinDemo() {
  return (
    <div className="flex gap-2">
      {["4", "8", "2", "9"].map((d, i) => (
        <span
          key={i}
          className="flex h-12 w-10 items-center justify-center rounded-xl border border-amber/30 bg-black text-xl font-bold text-amber tabular-nums sm:h-14 sm:w-12"
        >
          {d}
        </span>
      ))}
    </div>
  );
}

function ChatDemo() {
  return (
    <div className="space-y-2.5">
      <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white/[0.06] px-4 py-3 text-sm text-fog">
        <p className="font-semibold text-white">Booking confirmed</p>
        <p className="mt-0.5 text-mute">4 hours, pickup at your address</p>
      </div>
      <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white/[0.06] px-4 py-3 text-sm text-fog">
        <p className="font-semibold text-white">Your driver is assigned</p>
        <p className="mt-0.5 text-mute">Name, car, number plate and phone</p>
      </div>
      <div className="ml-auto flex max-w-[70%] items-end justify-end gap-1.5 rounded-2xl rounded-tr-md bg-amber px-4 py-3 text-sm font-medium text-black">
        Ride PIN received
        <CheckCheck size={16} />
      </div>
    </div>
  );
}

function SurgeDemo() {
  return (
    <svg viewBox="0 0 300 110" className="h-auto w-full" aria-hidden="true">
      <path
        d="M0 80 L30 70 L55 88 L80 40 L105 64 L130 22 L160 70 L185 34 L210 76 L240 18 L270 60 L300 44"
        fill="none"
        stroke="#3a3a3a"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M0 62 L300 62"
        fill="none"
        stroke="#ffc107"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text x="0" y="106" fill="#5c5c5c" fontSize="10">
        Surge fares
      </text>
      <text x="300" y="54" fill="#ffc107" fontSize="10" textAnchor="end">
        SafarSaathi
      </text>
    </svg>
  );
}

function Home() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="bg-grid mask-fade-b absolute inset-0" />
          <div className="absolute top-[-10rem] left-[-10rem] h-[34rem] w-[34rem] rounded-full bg-amber/[0.12] blur-[140px]" />
          <div className="absolute right-[-8rem] bottom-0 h-[26rem] w-[26rem] rounded-full bg-amber/[0.07] blur-[140px]" />
          <HeroRoute />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-ink" />
        </div>

        <div className="container-page grid gap-12 pt-32 pb-16 sm:pt-40 lg:grid-cols-[minmax(0,1fr)_30rem] lg:gap-16 lg:pb-24 xl:gap-24">
          <div className="animate-rise lg:sticky lg:top-32 lg:self-start">
            <h1 className="display text-[2.9rem] leading-[0.98] sm:text-7xl xl:text-[5.5rem]">
              Hire a driver
              <br />
              <span className="relative inline-block text-amber">
                by the hour.
                <span className="lane absolute -bottom-2 left-0 h-[5px] w-full rounded-full opacity-80 sm:-bottom-3" />
              </span>
            </h1>

            <p className="mt-9 max-w-lg text-base leading-relaxed text-fog/75 sm:text-lg">
              A verified professional driver for errands, office days, weddings
              or a safe ride home after a late night. One flat fare, from 1 to
              24 hours.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:hidden">
              <a href="#book" className="btn-primary py-4 text-base">
                Book a driver
                <ArrowDown size={18} />
              </a>
              <a href="#how" className="btn-secondary py-4 text-base">
                How it works
              </a>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              {heroStats.map((stat) => (
                <div key={stat.label} className="px-3 py-4 sm:px-5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-lg font-bold tracking-tight text-white tabular-nums sm:text-2xl">
                    {stat.value}
                  </dd>
                  <dd className="mt-0.5 text-[11px] leading-tight text-mute sm:text-xs">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>

            <a
              href="#how"
              className="group mt-10 hidden items-center gap-3 text-sm font-medium text-mute transition-colors hover:text-white lg:inline-flex"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-amber group-hover:text-amber">
                <ArrowDown size={16} />
              </span>
              See how a ride works
            </a>
          </div>

          <div className="animate-rise [animation-delay:150ms]">
            <BookingForm />
          </div>
        </div>
      </section>

      <Marquee items={ticker} />

      {/* How it works */}
      <section id="how" className="container-page scroll-mt-24 py-20 lg:py-32">
        <SectionHeading
          title={
            <>
              From pickup to drop off,{" "}
              <span className="text-mute">you always know what&apos;s next.</span>
            </>
          }
          className="mb-12 lg:mb-16"
        />
        <RoadTimeline steps={steps} />
      </section>

      {/* Why us: bento */}
      <section className="container-page pb-20 lg:pb-32">
        <SectionHeading
          title={
            <>
              Built on trust, <span className="text-amber">not surge.</span>
            </>
          }
          className="mb-12 lg:mb-16"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {/* Price tile */}
          <Reveal className="sm:col-span-2 lg:col-span-4">
            <div className="group relative isolate flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl border border-white/[0.07] p-6 sm:p-9">
              <img
                src={images.whyUs}
                loading="lazy"
                alt=""
                className="duotone absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/70 to-amber/10" />
              <span className="chip absolute top-6 left-6 sm:top-8 sm:left-9">
                <CarTaxiFront size={14} className="text-amber" />
                All inclusive
              </span>
              <p className="text-6xl font-extrabold tracking-tighter text-amber tabular-nums sm:text-8xl">
                {formatINR(HOURLY_RATE)}
                <span className="text-2xl font-semibold tracking-tight text-white/60 sm:text-3xl">
                  {" "}
                  / hour
                </span>
              </p>
              <p className="mt-3 max-w-md text-fog/80 sm:text-lg">
                That is the whole price list. No per kilometre charges, no
                night rates, no surprises.
              </p>
            </div>
          </Reveal>

          {/* Verification tile */}
          <Reveal delay={80} className="lg:col-span-2">
            <div className="surface flex h-full flex-col p-6 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber text-black">
                <BadgeCheck size={22} />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-white">
                Checked by a real person
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Every driver is reviewed by our team before they get a single
                ride.
              </p>
              <ul className="mt-auto space-y-2 pt-6">
                {checks.map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/40 px-3.5 py-2.5 text-sm text-fog"
                  >
                    {item}
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ok/15 text-ok">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* PIN tile */}
          <Reveal delay={0} className="lg:col-span-2">
            <div className="surface flex h-full flex-col p-6 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-amber">
                <KeyRound size={22} />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-white">
                Your PIN ends the ride
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                The driver can&apos;t close the trip until you share the code
                sent only to you.
              </p>
              <div className="mt-auto pt-6">
                <PinDemo />
              </div>
            </div>
          </Reveal>

          {/* WhatsApp tile */}
          <Reveal delay={80} className="lg:col-span-2">
            <div className="surface flex h-full flex-col p-6 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-amber">
                <MessageCircle size={22} />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-white">
                Everything on WhatsApp
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Confirmation, driver details and your PIN in one chat.
              </p>
              <div className="mt-auto pt-6">
                <ChatDemo />
              </div>
            </div>
          </Reveal>

          {/* No surge tile */}
          <Reveal delay={160} className="sm:col-span-2 lg:col-span-2">
            <div className="surface flex h-full flex-col p-6 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-amber">
                <TrendingUp size={22} />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-white">
                No surge. Ever.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Rain, traffic or rush hour, the fare stays the same flat line.
              </p>
              <div className="mt-auto pt-6">
                <SurgeDemo />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fare card */}
      <section className="relative overflow-hidden border-y border-white/[0.06] bg-coal py-20 lg:py-32">
        <div className="bg-grid mask-fade absolute inset-0 opacity-60" />
        <div className="container-page relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <SectionHeading
            title="Simple maths, worked out before you book."
            body={`Hours booked × ${formatINR(HOURLY_RATE)}. Traffic, distance or the time of day never change it.`}
          >
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#book" className="btn-primary group py-4">
                Book now
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <Link to="/services" className="btn-secondary py-4">
                See booking types
              </Link>
            </div>
          </SectionHeading>

          <Reveal delay={120}>
            <div className="relative mx-auto max-w-lg -rotate-1 transition-transform duration-500 hover:rotate-0">
              <div className="rounded-t-3xl border border-b-0 border-white/[0.08] bg-panel px-6 pt-7 pb-4 sm:px-8">
                <div className="flex items-center justify-between border-b border-dashed border-edge pb-5">
                  <p className="font-semibold text-white">Fare card</p>
                  <span className="rounded-full bg-amber px-3 py-1 text-xs font-bold text-black tabular-nums">
                    {formatINR(HOURLY_RATE)}/hr
                  </span>
                </div>
                <ul>
                  {examples.map((row) => (
                    <li
                      key={row.use}
                      className="flex items-baseline gap-3 py-4 text-sm sm:text-base"
                    >
                      <span className="min-w-0 text-fog">
                        {row.use}
                        <span className="ml-2 text-xs text-dim tabular-nums">
                          {row.hours} hrs
                        </span>
                      </span>
                      <span className="mb-1 flex-1 border-b border-dotted border-edge" />
                      <span className="font-semibold text-white tabular-nums">
                        {formatINR(row.hours * HOURLY_RATE)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex items-center justify-between border-t border-dashed border-edge pt-5 pb-2">
                  <span className="text-sm text-mute">Surge charges</span>
                  <span className="font-bold text-amber tabular-nums">₹0</span>
                </div>
              </div>
              {/* torn edge */}
              <div
                className="h-4 bg-panel"
                style={{
                  mask: "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 20px 100%",
                  WebkitMask:
                    "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 20px 100%",
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Driver recruitment */}
      <section className="container-page py-20 lg:py-28">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-amber text-black">
            <div className="checker absolute inset-x-0 top-0 h-3 [--sq:6px]" />
            <div className="checker absolute inset-x-0 bottom-0 h-3 [--sq:6px]" />
            <CarTaxiFront
              size={340}
              strokeWidth={0.75}
              className="pointer-events-none absolute -right-16 -bottom-20 -z-10 text-black/[0.08] sm:-right-6"
            />
            <div className="flex flex-col gap-8 px-6 py-14 sm:px-12 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:px-16 lg:py-20">
              <div className="max-w-2xl">
                <h2 className="text-4xl leading-[1.02] font-extrabold tracking-tighter sm:text-6xl">
                  Good driver with some free hours?
                </h2>
                <p className="mt-5 max-w-lg leading-relaxed text-black/70 sm:text-lg">
                  Apply once, get verified by our team and start receiving
                  bookings on your own driver dashboard.
                </p>
              </div>
              <Link
                to="/drive"
                className="btn group shrink-0 bg-black px-8 py-4 text-base text-white hover:-translate-y-0.5 hover:bg-coal"
              >
                <ShieldCheck size={18} className="text-amber" />
                Apply to drive
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </PageLayout>
  );
}

export default Home;
