import { useState } from "react";
import {
  Plus,
  FileText,
  UserSearch,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Lock,
  MessageCircle,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import ClosingCta from "../components/ClosingCta";
import Reveal from "../components/Reveal";
import { PageHero, SectionHeading } from "../components/Section";
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
      className={`rounded-3xl border transition-colors duration-300 ${
        isOpen
          ? "border-amber/30 bg-panel"
          : "border-white/[0.07] bg-transparent hover:border-white/15"
      }`}
    >
      <h3>
        <button
          className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left font-semibold text-white sm:px-7 sm:py-6 sm:text-lg"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
        >
          {item.question}
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color] duration-300 ${
              isOpen
                ? "rotate-45 bg-amber text-black"
                : "bg-white/[0.06] text-amber"
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
          <p className="px-5 pb-6 leading-relaxed text-mute sm:px-7">
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
      <PageHero
        title={
          <>
            Checked by <span className="text-amber">people.</span>
            <br className="hidden sm:block" /> Not left to an algorithm.
          </>
        }
        body="Every driver is vetted by hand, every ride is assigned by our team, and every trip ends only when you say so."
      />

      {/* Journey */}
      <section className="container-page pb-20 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            title="Four checkpoints on every ride."
            body="Here is who touches your booking, from the moment a driver signs up to the moment you step out."
            className="lg:sticky lg:top-32 lg:self-start"
          />

          <ol className="relative">
            <span className="absolute top-6 bottom-6 left-[1.6rem] w-px bg-linear-to-b from-amber via-amber/40 to-transparent sm:left-8" />
            {journey.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal
                  as="li"
                  key={step.title}
                  delay={index * 90}
                  className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7"
                >
                  <span className="relative z-10 flex h-[3.2rem] w-[3.2rem] shrink-0 items-center justify-center rounded-2xl border border-amber/30 bg-black text-amber sm:h-16 sm:w-16">
                    <Icon size={22} />
                  </span>
                  <div className="card flex-1 p-5 sm:p-7">
                    <h3 className="text-lg font-semibold text-white sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-mute sm:text-base">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Detail tiles */}
      <section className="border-y border-white/[0.06] bg-coal py-20 lg:py-28">
        <div className="container-page grid gap-4 md:grid-cols-2 lg:gap-5">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <Reveal key={detail.title} delay={index * 120}>
                <article className="group surface flex h-full flex-col overflow-hidden">
                  <div className="relative overflow-hidden bg-raise">
                    <img
                      src={detail.image}
                      loading="lazy"
                      decoding="async"
                      onError={(e) =>
                        (e.currentTarget.style.visibility = "hidden")
                      }
                      alt=""
                      className="duotone aspect-[16/9] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-panel to-transparent" />
                    <span className="absolute bottom-4 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber text-black sm:left-8">
                      <Icon size={22} />
                    </span>
                  </div>
                  <div className="p-6 pt-4 sm:p-8 sm:pt-5">
                    <h2 className="text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl">
                      {detail.title}
                    </h2>
                    <p className="mt-4 leading-relaxed text-mute">
                      {detail.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-32">
        <SectionHeading
          title="Questions we get asked."
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <div className="mt-8 flex items-center gap-4 rounded-3xl border border-white/[0.07] bg-panel p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber">
              <MessageCircle size={20} />
            </span>
            <p className="text-sm leading-relaxed text-mute">
              Your driver details and booking updates are always on WhatsApp.
            </p>
          </div>
        </SectionHeading>
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
        title="Know who's driving before they arrive."
        body="Book with the details up front and a PIN that only you hold."
      />
    </PageLayout>
  );
}

export default SafetyPage;
