import { Link } from "react-router-dom";
import {
  ArrowRight,
  Smartphone,
  UserCheck,
  CarFront,
  KeyRound,
  BadgeCheck,
  MessageCircle,
  CreditCard,
  Check,
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
  { use: "Groceries and a few errands", hours: 2 },
  { use: "Airport run with a wait", hours: 4 },
  { use: "Meetings across the city", hours: 5 },
  { use: "A wedding or a full day out", hours: 12 },
];

function Home() {
  return (
    <PageLayout>
      <section className="relative isolate overflow-hidden">
        <PhotoBackdrop src={images.taxi} position="35% center" />

        <div className="container-page grid gap-12 pt-28 pb-20 sm:pt-36 lg:min-h-[52rem] lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center lg:gap-16 lg:pb-24">
          <div>
            <h1 className="display text-4xl leading-tight sm:text-6xl lg:text-7xl lg:leading-[1.1]">
              Hire a driver
              <br />
              <span className="text-amber">by the hour.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-fog/80">
              A verified professional driver for errands, office days, weddings
              or a safe ride home after a late night. One flat fare, from 1 to
              24 hours.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#book" className="btn-primary px-7 py-3.5 lg:hidden">
                Book a driver
              </a>
              <a href="#how" className="btn-secondary bg-black/30 px-7 py-3.5">
                How it works
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-fog/80">
              {heroPoints.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <Check size={16} className="text-amber" />
                  {point}
                </li>
              ))}
            </ul>

            <dl className="mt-10 flex max-w-md gap-6 sm:gap-10 border-t border-white/10 pt-6">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-xl sm:text-2xl font-semibold text-white tabular-nums">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-xs text-mute">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <BookingForm />
        </div>
      </section>

      <section id="how" className="scroll-mt-16 bg-coal py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            title={
              <>
                From pickup to drop off,{" "}
                <span className="text-mute">you always know what&apos;s next.</span>
              </>
            }
            className="mb-14"
          />
          <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="relative">
                  {/* Desktop horizontal dashed line between 1-2, 2-3, 3-4 (never past 4) */}
                  {index < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-6 left-12 -right-8 hidden border-t-2 border-dashed border-amber/30 lg:block"
                    />
                  )}

                  {/* Tablet 2x2 horizontal connectors */}
                  {(index === 0 || index === 2) && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-6 left-12 -right-8 hidden border-t-2 border-dashed border-amber/30 sm:block lg:hidden"
                    />
                  )}
                  {/* Tablet 2x2 vertical connector from 1 to 3 */}
                  {index === 0 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-12 left-6 -bottom-10 w-0 -translate-x-1/2 border-l-2 border-dashed border-amber/30 hidden sm:block lg:hidden"
                    />
                  )}

                  {/* Mobile vertical dashed line between 1-2, 2-3, 3-4 */}
                  {index < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-12 left-6 -bottom-10 w-0 -translate-x-1/2 border-l-2 border-dashed border-amber/30 sm:hidden"
                    />
                  )}

                  <span
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border ${
                      index === steps.length - 1
                        ? "border-amber bg-amber text-black"
                        : "border-amber/40 bg-coal text-amber"
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <p className="mt-6 text-xs font-semibold tracking-wider text-dim tabular-nums">
                    STEP 0{index + 1}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            title={
              <>
                Built on trust, <span className="text-amber">not surge.</span>
              </>
            }
            className="mb-14"
          />

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl p-7 sm:p-9 lg:row-span-2">
              <img
                src={images.driver}
                alt="A driver at the wheel"
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/70 to-black/10" />
              <p className="text-5xl sm:text-6xl font-bold tracking-normal text-amber tabular-nums">
                {formatINR(HOURLY_RATE)}
                <span className="text-2xl font-medium text-white/70"> / hour</span>
              </p>
              <p className="mt-3 max-w-sm text-fog/85 leading-relaxed">
                That is the whole price list. No per kilometre charges, no night
                rates, no surge. Ever.
              </p>
            </div>

            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="surface p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/10 text-amber">
                    <Icon size={21} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-coal py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <SectionHeading
            title="Simple maths, worked out before you book."
            body={`Hours booked × ${formatINR(HOURLY_RATE)}. Traffic, distance or the time of day never change it.`}
          >
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#book" className="btn-primary px-7 py-3.5">
                Book now
              </a>
              <Link to="/services" className="btn-secondary px-7 py-3.5">
                See booking types
              </Link>
            </div>
          </SectionHeading>

          <div className="rounded-3xl border border-white/[0.08] bg-panel p-6 sm:p-8">
            <div className="flex items-center justify-between pb-5">
              <p className="text-lg font-semibold text-white">Fare card</p>
              <span className="rounded-full bg-amber px-3 py-1 text-xs font-bold text-black tabular-nums">
                {formatINR(HOURLY_RATE)}/hr
              </span>
            </div>
            <ul className="divide-y divide-dashed divide-white/10 border-y border-dashed border-white/10">
              {examples.map((row) => (
                <li
                  key={row.use}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <span>
                    <span className="block text-fog">{row.use}</span>
                    <span className="text-xs text-dim">{row.hours} hours</span>
                  </span>
                  <span className="text-lg font-semibold text-white tabular-nums">
                    {formatINR(row.hours * HOURLY_RATE)}
                  </span>
                </li>
              ))}
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
