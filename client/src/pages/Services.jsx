import { Check } from "lucide-react";
import PageLayout from "../components/PageLayout";
import ClosingCta from "../components/ClosingCta";
import { HOURLY_RATE, formatINR } from "../lib/pricing";
import { images } from "../lib/images";

const bookingTypes = [
  {
    name: "Quick errands",
    hours: [1, 3],
    description:
      "Grocery runs, a handful of quick stops, or a meeting across town and back.",
    included: ["Multiple stops allowed", "Driver waits while you're inside"],
  },
  {
    name: "Full day",
    hours: [8, 24],
    description:
      "Keep a driver on standby all day for corporate events, weddings, hospital visits or a city tour.",
    included: ["Book up to 24 hours", "Same driver for the whole day"],
  },
  {
    name: "Night drives",
    hours: [3, 6],
    description:
      "Going to a late-night event? Get there and back with a driver whose details you have before pickup.",
    included: ["Verified driver details on WhatsApp", "Wait-and-return"],
  },
];

const included = [
  {
    title: "Hourly, fixed fare",
    body: "Pick your hours and the fare is calculated on the spot. It doesn't move with traffic or distance.",
  },
  {
    title: "Manually vetted drivers",
    body: "Every driver is approved by our team after their licence and vehicle details are reviewed.",
  },
  {
    title: "Pay online or in cash",
    body: "Prepay securely through Razorpay, or pay your driver directly in cash when the ride ends.",
  },
  {
    title: "Updates on WhatsApp",
    body: "Your booking confirmation, driver details and end-of-ride PIN all arrive on WhatsApp.",
  },
];

function Services() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            Hire a driver by the hour, not by the trip.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute">
            Point-to-point rides don&apos;t fit days with several stops. Book a
            verified driver for exactly as many hours as you need, and keep
            them for the whole time.
          </p>
        </div>
        <div className="aspect-4/3 overflow-hidden rounded-xl border border-line">
          <img
            src={images.carInterior}
            alt="Interior of a car from the back seat"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Booking types */}
      <section className="container-page pb-24">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          How people use it
        </h2>

        <div className="mt-12 border-t border-line">
          {bookingTypes.map((type) => (
            <article
              key={type.name}
              className="grid gap-6 border-b border-line py-10 md:grid-cols-[13rem_1fr_11rem] md:gap-12"
            >
              <div>
                <h3 className="text-xl font-semibold text-white">{type.name}</h3>
                <p className="mt-1 text-sm text-mute">
                  Usually {type.hours[0]} to {type.hours[1]} hours
                </p>
              </div>

              <div>
                <p className="leading-relaxed text-fog">{type.description}</p>
                <ul className="mt-4 space-y-2">
                  {type.included.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-mute"
                    >
                      <Check size={16} className="shrink-0 text-amber" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:text-right">
                <p className="text-2xl font-semibold text-white tabular-nums">
                  {formatINR(type.hours[0] * HOURLY_RATE)} to{" "}
                  {formatINR(type.hours[1] * HOURLY_RATE)}
                </p>
                <p className="mt-1 text-sm text-mute">at {formatINR(HOURLY_RATE)}/hr</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Included */}
      <section className="border-t border-line bg-panel">
        <div className="container-page grid gap-12 py-24 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Included in every booking
          </h2>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {included.map((item) => (
              <div key={item.title} className="border-t-2 border-amber pt-6">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-mute">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta
        title="Ready when you are."
        body="Choose your pickup point and hours. You'll see the exact fare before you confirm."
      />
    </PageLayout>
  );
}

export default Services;
