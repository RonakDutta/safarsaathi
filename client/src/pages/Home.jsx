import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowDown,
  Smartphone,
  UserCheck,
  CarFront,
  KeyRound,
  BadgeCheck,
  MessageCircle,
  CreditCard,
  Check,
  ShoppingBag,
  Plane,
  Briefcase,
  PartyPopper,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import BookingForm from "../components/BookingForm";
import {
  PhotoBackdrop,
  SectionHeading,
  ClosingCta,
} from "../components/Section";
import { HOURLY_RATE, formatINR } from "../lib/pricing";
import { images } from "../lib/images";

const heroPoints = [
  "Checked by our team",
  "No surge pricing",
  "PIN-secured drop off",
];

const heroStats = [
  { value: formatINR(HOURLY_RATE), label: "flat per hour" },
  { value: "1–24", label: "hours per booking" },
  { value: "4-digit", label: "PIN to end ride" },
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

const features = [
  {
    icon: BadgeCheck,
    title: "Checked by a real person",
    body: "Every driver's licence and vehicle are reviewed by our team before their first ride.",
  },
  {
    icon: KeyRound,
    title: "Your PIN ends the ride",
    body: "The driver can't close the trip until you share the code sent only to you.",
  },
  {
    icon: MessageCircle,
    title: "Everything on WhatsApp",
    body: "Confirmation, driver details and your PIN arrive in one chat.",
  },
  {
    icon: CreditCard,
    title: "Pay online or in cash",
    body: "Prepay securely through Razorpay, or pay your driver when the ride ends.",
  },
];

const examples = [
  { use: "Groceries and a few errands", hours: 2, icon: ShoppingBag },
  { use: "Airport run with a wait", hours: 4, icon: Plane },
  { use: "Meetings across the city", hours: 5, icon: Briefcase },
  { use: "A wedding or a full day out", hours: 12, icon: PartyPopper },
];

function Home() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <PhotoBackdrop src={images.taxi} position="35% center" />

        <div className="container-page grid gap-10 pt-28 pb-16 sm:pt-36 sm:pb-20 lg:min-h-[50rem] lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center lg:gap-16 lg:pb-24">
          <div>
            <h1 className="display text-[2.75rem] leading-[1.08] sm:text-6xl lg:text-7xl lg:leading-[1.05]">
              Hire a driver
              <br />
              <span className="text-amber">by the hour.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-fog/80 sm:text-lg">
              A verified professional driver for errands, office days, weddings
              or a safe ride home after a late night. One flat fare, from 1 to
              24 hours.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#book" className="btn-primary px-7 py-3.5 lg:hidden">
                Book a driver
              </a>
              <a
                href="#how"
                className="btn-secondary group bg-black/30 px-7 py-3.5 backdrop-blur-sm"
              >
                How it works
                <ArrowDown
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                />
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5 text-sm text-fog/80">
              {heroPoints.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber/15 text-amber">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse justify-end px-3 py-4 sm:px-5"
                >
                  <dt className="mt-1 text-[11px] leading-snug text-mute sm:text-xs">
                    {stat.label}
                  </dt>
                  <dd className="text-lg font-semibold text-white tabular-nums sm:text-2xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-amber/10 blur-3xl"
            />
            <BookingForm />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="relative isolate scroll-mt-16 overflow-hidden bg-coal py-20 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="bg-dots pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
        />
        <div className="container-page">
          <SectionHeading
            title={
              <>
                From pickup to drop off,{" "}
                <span className="text-mute">
                  you always know what&apos;s next.
                </span>
              </>
            }
            className="mb-12 sm:mb-16"
          />

          <ol className="grid lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              return (
                <li
                  key={step.title}
                  className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-x-5 pb-10 last:pb-0 sm:gap-x-6 lg:block lg:pb-0"
                >
                  {/* Connector: runs down the icon column on small screens,
                      across to the next icon on large screens. */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-14 bottom-2 left-6 w-0 -translate-x-1/2 border-l-2 border-dashed border-amber/25 lg:top-6 lg:-right-6 lg:bottom-auto lg:left-16 lg:h-0 lg:w-auto lg:translate-x-0 lg:border-t-2 lg:border-l-0"
                    />
                  )}

                  <span
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border ${
                      isLast
                        ? "border-amber bg-amber text-black shadow-[0_0_0_6px_rgba(255,193,7,0.12)]"
                        : "border-amber/40 bg-coal text-amber"
                    }`}
                  >
                    <Icon size={20} />
                  </span>

                  <div className="pt-1 lg:pt-0">
                    <p className="text-xs font-semibold tracking-wider text-dim tabular-nums lg:mt-6">
                      STEP 0{index + 1}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-mute">
                      {step.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            title={
              <>
                Built on trust, <span className="text-amber">not surge.</span>
              </>
            }
            className="mb-12 sm:mb-14"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative isolate flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-3xl p-7 sm:col-span-2 sm:p-9 lg:col-span-1 lg:row-span-2">
              <img
                src={images.driver}
                alt="A driver at the wheel"
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/70 to-black/10" />
              <p className="text-5xl font-bold tracking-normal text-amber tabular-nums sm:text-6xl">
                {formatINR(HOURLY_RATE)}
                <span className="text-2xl font-medium text-white/70">
                  {" "}
                  / hour
                </span>
              </p>
              <p className="mt-3 max-w-sm leading-relaxed text-fog/85">
                That is the whole price list. No per kilometre charges, no night
                rates, no surge. Ever.
              </p>
            </div>

            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="surface lift group flex gap-4 p-5 sm:block sm:p-7"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber transition-colors duration-300 group-hover:bg-amber group-hover:text-black">
                    <Icon size={21} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white sm:mt-6 sm:text-lg">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mute sm:mt-2">
                      {feature.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative isolate overflow-hidden bg-coal py-20 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-0 -z-10 hidden h-[28rem] w-[28rem] translate-x-1/3 -translate-y-1/2 rounded-full bg-amber/[0.07] blur-3xl lg:block"
        />
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <SectionHeading
            title="Simple maths, worked out before you book."
            body={`Hours booked × ${formatINR(HOURLY_RATE)}. Traffic, distance or the time of day never change it.`}
          >
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#book" className="btn-primary px-7 py-3.5">
                Book now
              </a>
              <Link to="/services" className="btn-secondary group px-7 py-3.5">
                See booking types
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </SectionHeading>

          <div className="rounded-3xl border border-white/[0.08] bg-panel p-5 shadow-2xl shadow-black/60 sm:p-8">
            <div className="flex items-center justify-between pb-5">
              <p className="text-lg font-semibold text-white">Fare card</p>
              <span className="rounded-full bg-amber px-3 py-1 text-xs font-bold text-black tabular-nums">
                {formatINR(HOURLY_RATE)}/hr
              </span>
            </div>
            <ul className="divide-y divide-dashed divide-white/10 border-y border-dashed border-white/10">
              {examples.map((row) => {
                const Icon = row.icon;
                return (
                  <li key={row.use} className="flex items-center gap-4 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-fog/80">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-fog sm:text-base">
                        {row.use}
                      </span>
                      <span className="text-xs text-dim">
                        {row.hours} hours × {formatINR(HOURLY_RATE)}
                      </span>
                    </span>
                    <span className="shrink-0 text-lg font-semibold text-white tabular-nums">
                      {formatINR(row.hours * HOURLY_RATE)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between pt-5">
              <span className="text-mute">Surge charges</span>
              <span className="text-lg font-bold text-amber">₹0</span>
            </div>
          </div>
        </div>
      </section>

      <ClosingCta
        title="Good driver with some free hours?"
        body="Apply once, get verified by our team and start receiving bookings on your own driver dashboard."
        to="/drive"
        action="Apply to drive"
      />
    </PageLayout>
  );
}

export default Home;
