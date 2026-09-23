import { useState } from "react";
import {
  Plus,
  FileText,
  UserSearch,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Lock,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import ClosingCta from "../components/ClosingCta";
import Reveal from "../components/Reveal";
import { images } from "../lib/images";

const journey = [
  {
    icon: FileText,
    title: "A driver applies",
    body: "Applicants share their phone number, car model and driving licence number. Nothing is approved automatically.",
  },
  {
    icon: UserSearch,
    title: "Our team reviews it",
    body: "Each application is checked by hand before the applicant is approved or turned down.",
  },
  {
    icon: UserCheck,
    title: "A person assigns your ride",
    body: "An admin picks an approved driver for you and sends their name, car, plate and number to your WhatsApp.",
  },
  {
    icon: KeyRound,
    title: "Your PIN ends the ride",
    body: "A 4-digit PIN is sent only to you. The driver cannot close the ride until you hand it over.",
  },
];

const details = [
  {
    icon: ShieldCheck,
    title: "No driver gets on the road without approval",
    body: "Applications land with our team, where the vehicle and licence number are reviewed before an account is upgraded. Rejected applications never see a booking.",
    image: images.vetting,
  },
  {
    icon: Lock,
    title: "Payments and messages you can trust",
    body: "Online payments run through Razorpay, so your card and UPI details never touch our servers. Booking and driver updates arrive on WhatsApp, so you can check them any time.",
    image: images.payments,
  },
];

const faqData = [
  {
    question: "How do I know my driver is safe?",
    answer:
      "Every driver on SafarSaathi is verified by hand by our team. We record their driving licence number and vehicle details before they can accept rides.",
  },
  {
    question: "Are my payments secure?",
    answer:
      "Yes. All online payments are processed by Razorpay. We never store your card or UPI details.",
  },
  {
    question: "How do I contact my driver?",
    answer:
      "As soon as a driver is assigned, you get a WhatsApp message with their name, car model, number plate and phone number.",
  },
  {
    question: "What is the 4-digit PIN for?",
    answer:
      "It confirms that you agree the ride is over. Only share it once you have reached your destination.",
  },
  {
    question: "Can a ride be cancelled?",
    answer:
      "If a driver runs into a problem, they can cancel from their dashboard. Your booking goes straight back to our queue so another driver can be assigned.",
  },
];

function FaqItem({ item, isOpen, onToggle, id }) {
  return (
    <div
      className={`rounded-2xl border transition-colors duration-300 ${
        isOpen
          ? "border-edge bg-raise"
          : "border-line bg-panel hover:border-edge"
      }`}
    >
      <h3>
        <button
          className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-medium text-white"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
        >
          {item.question}
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color] duration-300 ${
              isOpen ? "rotate-45 bg-amber text-black" : "bg-line text-amber"
            }`}
          >
            <Plus size={18} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 leading-relaxed text-mute">{item.answer}</p>
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
      <section className="bg-linear-to-b from-raise to-ink">
        <div className="container-page animate-rise py-20 text-center lg:py-28">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber/10 text-amber">
            <ShieldCheck size={30} />
          </div>
          <h1 className="mx-auto mt-8 max-w-3xl text-4xl leading-[1.1] font-bold text-white sm:text-5xl lg:text-6xl">
            Safety checked by <span className="text-amber">people</span>, not
            left to an algorithm
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fog/80">
            Every driver is vetted by hand, every ride is assigned by our team,
            and every trip ends only when you say so.
          </p>
        </div>
      </section>

      {/* Journey */}
      <section className="container-page pb-20 lg:pb-28">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {journey.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 90}>
                <div className="group card card-hover h-full p-6 sm:p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-line text-amber transition-colors duration-300 group-hover:bg-amber group-hover:text-black">
                    <Icon size={22} />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-white">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-mute">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Detail blocks */}
      <section className="bg-coal">
        <div className="container-page space-y-20 py-20 lg:space-y-28 lg:py-28">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            const flip = index % 2 === 1;
            return (
              <div
                key={detail.title}
                className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                <Reveal className={flip ? "md:order-last" : ""}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-raise text-amber">
                    <Icon size={22} />
                  </div>
                  <h2 className="mt-6 text-3xl leading-tight font-semibold text-white sm:text-4xl">
                    {detail.title}
                  </h2>
                  <p className="mt-5 leading-relaxed text-mute">
                    {detail.body}
                  </p>
                </Reveal>
                <Reveal delay={120}>
                  <div className="overflow-hidden rounded-2xl bg-raise">
                    <img
                      src={detail.image}
                      loading="lazy"
                      alt=""
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    />
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page grid gap-10 py-20 lg:grid-cols-[1fr_1.8fr] lg:gap-16 lg:py-28">
        <Reveal>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Questions we get asked
          </h2>
          <p className="mt-4 max-w-xs leading-relaxed text-mute">
            Anything else on your mind? Your driver details and booking updates
            are always on WhatsApp.
          </p>
        </Reveal>
        <Reveal delay={100} className="space-y-3">
          {faqData.map((item, index) => (
            <FaqItem
              key={item.question}
              id={`faq-${index}`}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </Reveal>
      </section>

      <ClosingCta
        title="Book with the details up front"
        body="Know exactly who is driving you before they arrive."
      />
    </PageLayout>
  );
}

export default SafetyPage;
