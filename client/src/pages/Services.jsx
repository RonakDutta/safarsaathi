import { Link } from "react-router-dom";
import {
  Check,
  ShoppingBag,
  Briefcase,
  Moon,
  Hourglass,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import ClosingCta from "../components/ClosingCta";
import Reveal from "../components/Reveal";
import { PageHero, SectionHeading } from "../components/Section";
import { HOURLY_RATE, formatINR } from "../lib/pricing";
import { images } from "../lib/images";

const bookingTypes = [
  {
    icon: ShoppingBag,
    name: "Quick errands",
    hours: [1, 3],
    description:
      "Grocery runs, a handful of quick stops, or a meeting across town and back.",
    included: ["Multiple stops allowed", "Driver waits while you are inside"],
  },
  {
    icon: Briefcase,
    name: "Full day",
    hours: [8, 24],
    popular: true,
    description:
      "Keep a driver on standby all day for office events, weddings, hospital visits or a city tour.",
    included: ["Book up to 24 hours", "Same driver the whole day"],
  },
  {
    icon: Moon,
    name: "Night drives",
    hours: [3, 6],
    description:
      "Heading to a late event? Get there and back with a driver you know before pickup.",
    included: ["Verified driver details on WhatsApp", "Wait and return"],
  },
];

const included = [
  {
    icon: Hourglass,
    title: "Hourly, fixed fare",
    body: "Pick your hours and the fare is worked out on the spot. It never moves with traffic or distance.",
  },
  {
    icon: ShieldCheck,
    title: "Hand checked drivers",
    body: "Every driver is approved by our team after their licence and vehicle details are reviewed.",
  },
  {
    icon: CreditCard,
    title: "Pay online or in cash",
    body: "Prepay securely through Razorpay, or pay your driver in cash when the ride ends.",
  },
  {
    icon: MessageCircle,
    title: "Updates on WhatsApp",
    body: "Your confirmation, driver details and end of ride PIN all arrive on WhatsApp.",
  },
];

// 24 slots, the booking type's usual range lit up in amber
function HourBar({ from, to, popular }) {
  return (
    <div>
      <div className="flex gap-[3px]">
        {Array.from({ length: 24 }, (_, i) => {
          const on = i + 1 >= from && i + 1 <= to;
          return (
            <span
              key={i}
              className={`h-7 flex-1 rounded-[3px] transition-colors duration-500 ${
                on
                  ? popular
                    ? "bg-black"
                    : "bg-amber"
                  : popular
                    ? "bg-black/15"
                    : "bg-white/[0.06]"
              }`}
            />
          );
        })}
      </div>
      <div
        className={`mt-2 flex justify-between text-[11px] tabular-nums ${popular ? "text-black/60" : "text-dim"}`}
      >
        <span>1 hr</span>
        <span>12 hrs</span>
        <span>24 hrs</span>
      </div>
    </div>
  );
}

function Services() {
  return (
    <PageLayout>
      <PageHero
        title={
          <>
            A driver on <span className="text-amber">your terms.</span>
          </>
        }
        body="Forget point A to point B rides. Book a verified professional driver for exactly as many hours as you need, and keep them for the whole time."
      >
        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link to="/#book" className="btn-primary group px-7 py-4 text-base">
            Book a driver
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <p className="text-sm text-mute">
            <span className="text-2xl font-bold text-white tabular-nums">
              {formatINR(HOURLY_RATE)}
            </span>{" "}
            per hour, every booking type
          </p>
        </div>
      </PageHero>

      {/* Booking types */}
      <section className="container-page pb-20 lg:pb-32">
        <SectionHeading
          title="Pick the kind of day you're having."
          body={`Every option is billed at ${formatINR(HOURLY_RATE)} an hour. The bar shows the usual booking length.`}
          className="mb-12"
        />

        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {bookingTypes.map((type, index) => {
            const Icon = type.icon;
            const p = type.popular;
            return (
              <Reveal key={type.name} delay={index * 100}>
                <article
                  className={`group relative flex h-full flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${
                    p
                      ? "bg-amber text-black shadow-[0_30px_80px_-30px_rgb(255_193_7/0.6)]"
                      : "border border-white/[0.07] bg-panel"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        p ? "bg-black text-amber" : "bg-amber/10 text-amber"
                      }`}
                    >
                      <Icon size={26} />
                    </span>
                    {p && (
                      <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-amber">
                        Most popular
                      </span>
                    )}
                  </div>

                  <h3
                    className={`mt-8 text-2xl font-bold tracking-tight ${p ? "" : "text-white"}`}
                  >
                    {type.name}
                  </h3>
                  <p
                    className={`mt-3 leading-relaxed ${p ? "text-black/70" : "text-mute"}`}
                  >
                    {type.description}
                  </p>

                  <div className="mt-7">
                    <HourBar
                      from={type.hours[0]}
                      to={type.hours[1]}
                      popular={p}
                    />
                  </div>

                  <ul className="mt-7 space-y-3">
                    {type.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            p ? "bg-black text-amber" : "bg-amber/15 text-amber"
                          }`}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className={p ? "" : "text-fog"}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex-1" />
                  <div
                    className={`mt-8 flex items-end justify-between gap-4 border-t pt-6 ${p ? "border-black/15" : "border-white/[0.07]"}`}
                  >
                    <div>
                      <p
                        className={`text-xl font-bold tabular-nums ${p ? "" : "text-white"}`}
                      >
                        {formatINR(type.hours[0] * HOURLY_RATE)} to{" "}
                        {formatINR(type.hours[1] * HOURLY_RATE)}
                      </p>
                      <p
                        className={`mt-1 text-xs ${p ? "text-black/60" : "text-mute"}`}
                      >
                        For {type.hours[0]} to {type.hours[1]} hours
                      </p>
                    </div>
                    <Link
                      to={`/?hours=${type.hours[0]}#book`}
                      aria-label={`Book ${type.name}`}
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:-rotate-45 ${
                        p ? "bg-black text-amber" : "bg-amber text-black"
                      }`}
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Included */}
      <section className="border-y border-white/[0.06] bg-coal py-20 lg:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              title={
                <>
                  Included in <span className="text-amber">every booking.</span>
                </>
              }
              body="No add-ons to choose and nothing extra at the end of the ride."
            />
            <Reveal delay={120} className="mt-10">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-raise">
                <img
                  src={images.carInterior}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                  alt="Inside of a car seen from the back seat"
                  className="duotone aspect-[16/10] w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-5 left-5 text-lg font-semibold text-white">
                  You sit back. <span className="text-amber">We drive.</span>
                </p>
              </div>
            </Reveal>
          </div>

          <ol className="space-y-4">
            {included.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal as="li" key={item.title} delay={index * 80}>
                  <div className="group card card-hover flex gap-5 p-6 sm:gap-7 sm:p-8">
                    <span className="text-4xl font-extrabold tracking-tighter text-white/10 tabular-nums transition-colors duration-300 group-hover:text-amber sm:text-5xl">
                      0{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-amber" />
                        <h3 className="text-lg font-semibold text-white sm:text-xl">
                          {item.title}
                        </h3>
                      </div>
                      <p className="mt-2 leading-relaxed text-mute">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      <div className="pt-20 lg:pt-28">
        <ClosingCta
          title="Ready when you are."
          body="Choose your pickup point and hours. You will see the exact fare before you confirm."
        />
      </div>
    </PageLayout>
  );
}

export default Services;
