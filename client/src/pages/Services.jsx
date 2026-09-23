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

function Services() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-linear-to-b from-raise to-ink">
        <div className="container-page animate-rise py-20 text-center lg:py-28">
          <h1 className="mx-auto max-w-3xl text-4xl leading-[1.1] font-bold text-white sm:text-5xl lg:text-6xl">
            Hire a driver <span className="text-amber">on your terms</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fog/80">
            Forget point A to point B rides. Book a verified professional driver
            for exactly as many hours as you need, and keep them for the whole
            time.
          </p>
        </div>
      </section>

      {/* Booking types */}
      <section className="container-page pb-20 lg:pb-28">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Flexible booking options
          </h2>
          <p className="mt-4 text-mute">
            Every option is billed at {formatINR(HOURLY_RATE)} an hour.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:items-stretch lg:gap-6">
          {bookingTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <Reveal key={type.name} delay={index * 100}>
                <article
                  className={`group card card-hover relative flex h-full flex-col p-7 lg:p-8 ${
                    type.popular
                      ? "border-amber/60 md:-translate-y-3 md:hover:-translate-y-5"
                      : ""
                  }`}
                >
                  {type.popular && (
                    <span className="absolute top-6 right-6 rounded-full bg-amber px-3 py-1 text-xs font-semibold text-black">
                      Most popular
                    </span>
                  )}
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-300 ${
                      type.popular
                        ? "bg-amber text-black"
                        : "bg-line text-amber group-hover:bg-amber group-hover:text-black"
                    }`}
                  >
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold text-white">
                    {type.name}
                  </h3>
                  <p className="mt-1 text-sm text-mute">
                    Usually {type.hours[0]} to {type.hours[1]} hours
                  </p>
                  <p className="mt-4 leading-relaxed text-fog/80">
                    {type.description}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {type.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm text-fog"
                      >
                        <Check size={16} className="shrink-0 text-amber" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <div className="border-t border-line pt-5">
                      <p className="text-xl font-semibold text-white tabular-nums">
                        {formatINR(type.hours[0] * HOURLY_RATE)} to{" "}
                        {formatINR(type.hours[1] * HOURLY_RATE)}
                      </p>
                      <Link
                        to={`/?hours=${type.hours[0]}#book`}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-amber"
                      >
                        Book this
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Included */}
      <section className="bg-coal py-20 lg:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 className="text-3xl leading-tight font-semibold text-white sm:text-4xl">
                Included in <span className="text-amber">every booking</span>
              </h2>
            </Reveal>

            <ul className="mt-10 space-y-3">
              {included.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal as="li" key={item.title} delay={index * 80}>
                    <div className="group flex items-start gap-5 rounded-2xl p-4 transition-colors duration-300 hover:bg-panel sm:-mx-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-raise text-amber transition-colors duration-300 group-hover:bg-amber group-hover:text-black">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 leading-relaxed text-mute">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          <Reveal delay={120} className="order-first lg:order-last">
            <div className="overflow-hidden rounded-2xl bg-raise">
              <img
                src={images.carInterior}
                loading="lazy"
                alt="Inside of a car seen from the back seat"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out hover:scale-105 lg:aspect-[4/5]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="pt-20 lg:pt-28">
        <ClosingCta
          title="Ready when you are"
          body="Choose your pickup point and hours. You will see the exact fare before you confirm."
        />
      </div>
    </PageLayout>
  );
}

export default Services;
