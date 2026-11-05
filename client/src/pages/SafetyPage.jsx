import { useState } from "react";
import {
  Plus,
  Minus,
  FileText,
  UserSearch,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Lock,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import { PageHero, SectionHeading, ClosingCta } from "../components/Section";
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
  },
  {
    icon: Lock,
    title: "Payments and messages you can trust",
    body: "Online payments run through Razorpay, so your card and UPI details never touch our servers. Booking and driver updates arrive on WhatsApp, so you can check them any time.",
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

function SafetyPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <PageLayout>
      <PageHero
        image={images.driver}
        title={
          <>
            Checked by <span className="text-amber">people.</span> Not left to
            an algorithm.
          </>
        }
        body="Every driver is vetted by hand, every ride is assigned by our team, and every trip ends only when you say so."
      />

      <section className="container-page py-24">
        <SectionHeading
          title="Four checkpoints on every ride."
          body="Here is who touches your booking, from the moment a driver signs up to the moment you step out."
          className="mb-14"
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="surface p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/10 text-amber">
                    <Icon size={21} />
                  </span>
                  <span className="text-3xl font-bold text-white/10 tabular-nums">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="bg-coal py-24">
        <div className="container-page grid gap-4 md:grid-cols-2">
          {details.map((detail) => {
            const Icon = detail.icon;
            return (
              <div key={detail.title} className="surface p-8 sm:p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber text-black">
                  <Icon size={22} />
                </span>
                <h2 className="mt-7 text-2xl font-bold tracking-tight text-white">
                  {detail.title}
                </h2>
                <p className="mt-3 leading-relaxed text-mute">{detail.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <SectionHeading title="Questions we get asked." />
          <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.question}>
                  <button
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium text-white"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    {item.question}
                    {isOpen ? (
                      <Minus size={18} className="shrink-0 text-amber" />
                    ) : (
                      <Plus size={18} className="shrink-0 text-mute" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="animate-fade pb-5 leading-relaxed text-mute">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ClosingCta
        title="Know who's driving before they arrive."
        body="Book with the details up front and a PIN that only you hold."
      />
    </PageLayout>
  );
}

export default SafetyPage;
