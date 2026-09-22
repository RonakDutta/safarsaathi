import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import PageLayout from "../components/PageLayout";
import ClosingCta from "../components/ClosingCta";
import { images } from "../lib/images";

const journey = [
  {
    title: "A driver applies",
    body: "Applicants submit their phone number, car model and government licence number. There is no automatic approval.",
  },
  {
    title: "Our team reviews it",
    body: "Each application is checked by hand in our admin dashboard before the applicant is approved or rejected.",
  },
  {
    title: "A person assigns your ride",
    body: "When you book, an admin picks an approved driver for you. Their name, car, plate and phone number go to your WhatsApp.",
  },
  {
    title: "Your PIN ends the ride",
    body: "A 4-digit PIN is sent only to you. The driver can't mark the ride complete until you hand it over.",
  },
];

const faqData = [
  {
    question: "How do I know my driver is safe?",
    answer:
      "Every driver on SafarSaathi goes through a manual verification by our admin team. We record their government-issued licence number and vehicle details before they can accept rides.",
  },
  {
    question: "Are my payments secure?",
    answer:
      "Yes. All online payments are processed by Razorpay. We never store your card or UPI details on our servers.",
  },
  {
    question: "How do I contact my driver?",
    answer:
      "As soon as a driver is assigned, you'll receive a WhatsApp message with their name, car model, number plate and direct phone number.",
  },
  {
    question: "What is the 4-digit PIN for?",
    answer:
      "It confirms that you, not just the driver, agree the ride is over. Only share it once you've reached your destination.",
  },
  {
    question: "Can a ride be cancelled?",
    answer:
      "If a driver runs into an issue, they can cancel from their dashboard. Your booking goes straight back to our pending queue so another driver can be assigned.",
  },
];

function FaqItem({ item, isOpen, onToggle, id }) {
  return (
    <div className="border-b border-line">
      <h3>
        <button
          className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium text-white"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
        >
          {item.question}
          <span className="shrink-0 text-amber">
            {isOpen ? <Minus size={20} /> : <Plus size={20} />}
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 leading-relaxed text-mute">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function SafetyPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="container-page py-16 lg:py-24">
        <h1 className="max-w-3xl text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
          Safety that&apos;s checked by people, not left to an algorithm.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mute">
          Every driver is vetted by hand, every ride is assigned by our team,
          and every trip ends only when you say so.
        </p>
      </section>

      {/* Journey */}
      <section className="container-page pb-24">
        <ol className="grid border-t border-line md:grid-cols-2 lg:grid-cols-4">
          {journey.map((step, index) => (
            <li
              key={step.title}
              className="border-b border-line py-8 md:pr-8 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <span className="text-sm font-semibold text-amber tabular-nums">
                Step {index + 1}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-white">
                {step.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Detail blocks */}
      <section className="border-t border-line bg-panel">
        <div className="container-page space-y-24 py-24">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                No driver gets on the road without approval
              </h2>
              <p className="mt-5 leading-relaxed text-mute">
                Driver applications land in our admin dashboard, where the
                vehicle model and licence number are reviewed before an account
                is upgraded. Rejected applications never get access to
                bookings.
              </p>
            </div>
            <div className="aspect-4/3 overflow-hidden rounded-xl border border-line">
              <img
                src={images.vetting}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="aspect-4/3 overflow-hidden rounded-xl border border-line md:order-first">
              <img
                src={images.payments}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="order-first md:order-last">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Payments and messages you can trust
              </h2>
              <p className="mt-5 leading-relaxed text-mute">
                Online payments run through Razorpay&apos;s gateway, so your
                card and UPI details never touch our servers. Booking and
                driver updates arrive as WhatsApp messages you can refer back
                to at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page grid gap-12 py-24 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Questions we get asked
        </h2>
        <div className="border-t border-line">
          {faqData.map((item, index) => (
            <FaqItem
              key={item.question}
              id={`faq-${index}`}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </section>

      <ClosingCta
        title="Book with the details up front."
        body="Know exactly who is driving you before they arrive."
      />
    </PageLayout>
  );
}

export default SafetyPage;
