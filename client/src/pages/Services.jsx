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
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import { PageHero, SectionHeading, ClosingCta } from "../components/Section";
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
      <PageHero
        image={images.interior}
        title={
          <>
            A driver on <span className="text-amber">your terms.</span>
          </>
        }
        body="Forget point A to point B rides. Book a verified professional driver for exactly as many hours as you need, and keep them for the whole time."
      >
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link to="/#book" className="btn-primary px-7 py-3.5">
            Book a driver
          </Link>
          <p className="text-sm text-mute">
            <span className="font-semibold text-white">
              {formatINR(HOURLY_RATE)}
            </span>{" "}
            per hour, every booking type
          </p>
        </div>
      </PageHero>

      <section className="container-page py-24">
        <SectionHeading
          title="Pick the kind of day you're having."
          body={`Every option is billed at ${formatINR(HOURLY_RATE)} an hour.`}
          className="mb-14"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {bookingTypes.map((type) => {
            const Icon = type.icon;
            return (
              <article
                key={type.name}
                className={`flex flex-col rounded-3xl p-7 sm:p-8 ${
                  type.popular
                    ? "bg-amber text-black"
                    : "border border-white/[0.07] bg-panel"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      type.popular ? "bg-black text-amber" : "bg-amber/10 text-amber"
                    }`}
                  >
                    <Icon size={22} />
                  </span>
                  {type.popular && (
                    <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-amber">
                      Most popular
                    </span>
                  )}
                </div>

                <h3
                  className={`mt-7 text-2xl font-bold tracking-normal ${type.popular ? "" : "text-white"}`}
                >
                  {type.name}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${type.popular ? "text-black/70" : "text-mute"}`}
                >
                  {type.description}
                </p>

                <ul className="mt-6 mb-6 space-y-2.5">
                  {type.included.map((item) => (
                    <li
                      key={item}
                      className={`flex items-center gap-2.5 text-sm ${type.popular ? "" : "text-fog"}`}
                    >
                      <Check
                        size={15}
                        className={`shrink-0 ${type.popular ? "" : "text-amber"}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-auto flex items-end justify-between gap-4 border-t pt-5 ${
                    type.popular ? "border-black/15" : "border-white/[0.06]"
                  }`}
                >
                  <div>
                    <p
                      className={`text-lg font-bold tabular-nums ${type.popular ? "" : "text-white"}`}
                    >
                      {formatINR(type.hours[0] * HOURLY_RATE)} –{" "}
                      {formatINR(type.hours[1] * HOURLY_RATE)}
                    </p>
                    <p
                      className={`mt-0.5 text-xs ${type.popular ? "text-black/60" : "text-mute"}`}
                    >
                      {type.hours[0]} to {type.hours[1]} hours
                    </p>
                  </div>
                  <Link
                    to={`/?hours=${type.hours[0]}#book`}
                    className={`btn px-5 py-2 ${
                      type.popular
                        ? "bg-black text-white hover:bg-coal"
                        : "bg-amber text-black hover:bg-amber-soft"
                    }`}
                  >
                    Book
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-coal py-24">
        <div className="container-page">
          <SectionHeading
            title="Included in every booking."
            body="No add-ons to choose and nothing extra at the end of the ride."
            className="mb-14"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {included.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="surface flex gap-5 p-7">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mute">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ClosingCta
        title="Ready when you are."
        body="Choose your pickup point and hours. You will see the exact fare before you confirm."
      />
    </PageLayout>
  );
}

export default Services;
