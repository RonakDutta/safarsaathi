import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Wallet,
  Smartphone,
  UserCheck,
  CarFront,
  KeyRound,
  BadgeCheck,
  IndianRupee,
  MessageCircle,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import BookingForm from "../components/BookingForm";
import Reveal from "../components/Reveal";
import { HOURLY_RATE, formatINR } from "../lib/pricing";
import { images } from "../lib/images";

const highlights = [
  { icon: ShieldCheck, label: "Verified drivers" },
  { icon: Clock, label: "1 to 24 hours" },
  { icon: Wallet, label: "Online or cash" },
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

const reasons = [
  {
    icon: BadgeCheck,
    title: "Checked by a real person",
    body: "Every driver's licence and vehicle is reviewed by our team before they get a single ride.",
  },
  {
    icon: IndianRupee,
    title: "One fixed hourly price",
    body: "No surge and no per kilometre charges. The fare you see is the fare you pay.",
  },
  {
    icon: MessageCircle,
    title: "Everything on WhatsApp",
    body: "Booking confirmation, driver details and your ride PIN, all in one chat.",
  },
];

const examples = [
  { use: "Groceries and a few errands", hours: 2 },
  { use: "Meetings across the city", hours: 5 },
  { use: "A wedding or a full day out", hours: 12 },
];

function Home() {
  return (
    <PageLayout overlay>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={images.hero}
            alt=""
            className="animate-slow-zoom h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-ink" />
        </div>

        <div className="container-page grid items-center gap-12 pt-28 pb-12 md:pt-36 lg:grid-cols-[minmax(0,1fr)_29rem] lg:gap-14 lg:pb-28">
          <div className="animate-rise">
            <h1 className="max-w-xl text-[2.6rem] leading-[1.1] font-bold text-white sm:text-5xl lg:text-[3.6rem]">
              Book your ride,{" "}
              <span className="text-amber">anytime, anywhere.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-fog/85">
              Hire a verified professional driver by the hour for errands,
              office days, weddings or a safe ride home after a late night.
            </p>

            <ul className="mt-9 flex flex-wrap gap-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-fog backdrop-blur-sm"
                  >
                    <Icon size={16} className="text-amber" />
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="animate-rise [animation-delay:150ms]">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page pt-12 pb-20 lg:pt-20 lg:pb-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-mute">
            From booking to drop off, you always know what happens next.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 90}>
                <div className="group card card-hover flex h-full gap-5 p-6 sm:block sm:p-7">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-line text-amber transition-colors duration-300 group-hover:bg-amber group-hover:text-black sm:h-14 sm:w-14">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white sm:mt-6">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mute sm:mt-2">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-coal py-20 lg:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={images.whyUs}
                loading="lazy"
                alt="A modern car on the road"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 left-6 rounded-2xl border border-line bg-panel px-6 py-4 shadow-2xl sm:left-auto sm:-right-6">
              <p className="text-3xl font-bold text-amber tabular-nums">
                {formatINR(HOURLY_RATE)}
              </p>
              <p className="text-sm text-mute">per hour, all inclusive</p>
            </div>
          </Reveal>

          <div className="pt-6 lg:pt-0">
            <Reveal>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Why ride with <span className="text-amber">SafarSaathi</span>
              </h2>
            </Reveal>

            <ul className="mt-10 space-y-4">
              {reasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <Reveal as="li" key={reason.title} delay={index * 90}>
                    <div className="group flex items-start gap-5 rounded-2xl p-4 transition-colors duration-300 hover:bg-panel sm:-mx-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-raise text-amber transition-colors duration-300 group-hover:bg-amber group-hover:text-black">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {reason.title}
                        </h3>
                        <p className="mt-1 leading-relaxed text-mute">
                          {reason.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container-page py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Simple pricing, worked out before you book
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-mute">
              Hours booked times {formatINR(HOURLY_RATE)}. Traffic, distance or
              the time of day never change it.
            </p>
            <Link
              to="/services"
              className="group mt-8 inline-flex items-center gap-2 font-medium text-amber"
            >
              See all booking types
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="card overflow-hidden">
              {examples.map((row) => (
                <div
                  key={row.use}
                  className="flex items-center justify-between gap-4 border-b border-line px-6 py-5 transition-colors duration-200 last:border-b-0 hover:bg-white/[0.03]"
                >
                  <div>
                    <p className="font-medium text-white">{row.use}</p>
                    <p className="mt-0.5 text-sm text-mute">
                      {row.hours} hours
                    </p>
                  </div>
                  <p className="text-xl font-semibold text-amber tabular-nums">
                    {formatINR(row.hours * HOURLY_RATE)}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Driver recruitment */}
      <section className="container-page pb-20 lg:pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-amber px-7 py-10 text-black sm:px-12 sm:py-14">
            <CarFront
              size={220}
              strokeWidth={1}
              className="pointer-events-none absolute -right-8 -bottom-10 text-black/10"
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Good driver with some free hours?
                </h2>
                <p className="mt-3 leading-relaxed text-black/70">
                  Apply once, get verified by our team and start receiving
                  bookings on your own driver dashboard.
                </p>
              </div>
              <Link
                to="/drive"
                className="btn group shrink-0 bg-black px-7 py-3.5 text-white hover:-translate-y-0.5 hover:bg-raise"
              >
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
