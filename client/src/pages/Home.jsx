import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageLayout from "../components/PageLayout";
import BookingForm from "../components/BookingForm";
import { HOURLY_RATE, formatINR } from "../lib/pricing";
import { images } from "../lib/images";

const examples = [
  { use: "Groceries and a couple of errands", hours: 2 },
  { use: "Client meetings across the city", hours: 5 },
  { use: "Wedding, event or a full day out", hours: 12 },
];

const steps = [
  {
    title: "Book",
    body: "Tell us where to pick you up and how many hours you need. Pay online now, or choose cash.",
  },
  {
    title: "Get your driver's details",
    body: "Our team assigns a verified driver. Their name, car, number plate and phone number arrive on your WhatsApp.",
  },
  {
    title: "Ride for as long as you booked",
    body: "Your driver stays with you for the whole booking. Multiple stops and waiting time are part of it.",
  },
  {
    title: "Close the ride with your PIN",
    body: "Along with the driver details you get a 4-digit PIN. Share it only when you're done, because that's what ends the ride.",
  },
];

const reasons = [
  {
    title: "Checked by a person",
    body: "Driver sign-ups are never automatic. Our team reviews each applicant's licence and vehicle before they can take a ride.",
  },
  {
    title: "You know who's coming",
    body: "No anonymous pickups. You have your driver's name, car and phone number before they reach your door.",
  },
  {
    title: "Nothing extra on the bill",
    body: "No surge, no per-kilometre charges. The fare you see before confirming is the fare you pay.",
  },
];

function Home() {
  return (
    <PageLayout>
      {/* Hero + booking */}
      <section className="container-page grid gap-12 pt-10 pb-20 lg:grid-cols-[minmax(0,1fr)_27rem] lg:gap-16 lg:pt-16 lg:pb-28">
        <div className="flex flex-col">
          <h1 className="max-w-xl text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
            A professional driver, for as long as you need one.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute">
            Book a verified driver by the hour for errands, meetings, events,
            or getting home safely after a late night. {formatINR(HOURLY_RATE)}
            &nbsp;an hour, from one hour up to a full day.
          </p>

          <div className="relative mt-10 hidden flex-1 overflow-hidden rounded-xl border border-line lg:block">
            <img
              src={images.hero}
              alt="City road at night seen through a car windscreen"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="lg:pt-2">
          <BookingForm />
        </div>
      </section>

      {/* Pricing */}
      <section className="border-y border-line bg-panel">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              One hourly rate. That&apos;s the whole price list.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-mute">
              Your fare is the number of hours you book multiplied by{" "}
              {formatINR(HOURLY_RATE)}. It doesn&apos;t change with traffic,
              distance or time of day.
            </p>
            <p className="mt-10 flex items-baseline gap-3">
              <span className="text-6xl font-semibold tracking-tight text-amber sm:text-7xl">
                {formatINR(HOURLY_RATE)}
              </span>
              <span className="text-mute">per hour</span>
            </p>
          </div>

          <div className="self-end">
            <table className="w-full text-left">
              <caption className="sr-only">Example fares</caption>
              <thead>
                <tr className="border-b border-line text-sm text-mute">
                  <th className="pb-3 font-normal">Typical booking</th>
                  <th className="pb-3 text-right font-normal">Hours</th>
                  <th className="pb-3 text-right font-normal">Fare</th>
                </tr>
              </thead>
              <tbody>
                {examples.map((row) => (
                  <tr key={row.use} className="border-b border-line">
                    <td className="py-5 pr-4 text-fog">{row.use}</td>
                    <td className="py-5 text-right text-mute tabular-nums">
                      {row.hours}
                    </td>
                    <td className="py-5 pl-4 text-right font-semibold text-white tabular-nums">
                      {formatINR(row.hours * HOURLY_RATE)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link
              to="/services"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber hover:text-amber-soft"
            >
              See what each booking type includes
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            From booking to drop‑off
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-mute">
            Every booking goes through the same four steps, and you&apos;re
            kept in the loop on WhatsApp the whole way.
          </p>
        </div>

        <ol className="border-t border-line">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-8 sm:grid-cols-[4rem_1fr]"
            >
              <span className="text-lg font-semibold text-amber tabular-nums">
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 max-w-lg leading-relaxed text-mute">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Why */}
      <section className="border-t border-line bg-coal">
        <div className="container-page py-24">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Why people book with SafarSaathi
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {reasons.map((reason) => (
              <div key={reason.title} className="border-t-2 border-amber pt-6">
                <h3 className="text-lg font-semibold text-white">
                  {reason.title}
                </h3>
                <p className="mt-3 leading-relaxed text-mute">{reason.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Driver recruitment */}
      <section className="container-page py-20">
        <div className="flex flex-col gap-8 rounded-xl bg-amber p-8 text-black sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Have a car and some free hours?
            </h2>
            <p className="mt-3 leading-relaxed text-black/70">
              Apply once, get verified by our team, and receive bookings
              straight to your driver dashboard.
            </p>
          </div>
          <Link
            to="/drive"
            className="btn shrink-0 bg-black px-6 py-3.5 text-white hover:bg-raise"
          >
            Apply to drive
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

export default Home;
