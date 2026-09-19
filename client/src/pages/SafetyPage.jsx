import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqData = [
  {
    question: "How do I know my driver is safe?",
    answer:
      "Every single driver on SafarSaathi goes through a manual verification process by our Admin team. We securely store their government-issued license numbers and vehicle details in our database before they can accept rides.",
  },
  {
    question: "Are my payments secure?",
    answer:
      "Yes. We use Razorpay to process all online transactions. We do not store any of your credit card or UPI details on our servers.",
  },
  {
    question: "How do I communicate with my driver?",
    answer:
      "We believe in transparent communication. Once our Admin assigns a driver to your booking, you will receive an SMS via Twilio with their exact car model, license plate, and direct phone number.",
  },
  {
    question: "Can I cancel my ride?",
    answer:
      "If there is an issue, our drivers have the ability to cancel an active ride from their dashboard, which immediately returns your request to our priority pending queue for reassignment.",
  },
];

function SafetyPage() {
  const [openIndex, setIndex] = useState(null);

  const handleToggle = (index) => {
    setIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#121212] min-h-screen font-['Poppins',sans-serif] text-white">
      <Navbar />

      {/*  HERO SECTION  */}
      <section className="pt-40 pb-20 text-center bg-linear-to-b from-[#1e1e1e] to-[#121212]">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Committed to <span className="text-[#ffc107]">Transparency</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-[#e0e0e0] leading-relaxed">
            We don't rely on algorithms to keep you safe. We rely on manual
            vetting, secure data protocols, and strict admin oversight.
          </p>
        </div>
      </section>

      {/* SAFETY FEATURES */}
      <div className="py-20 max-w-6xl mx-auto px-8 space-y-24">
        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block px-3 py-1 mb-4 rounded-full border border-[#ffc107] text-[#ffc107] text-sm font-bold uppercase tracking-wide">
              Vetting Process
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Strict Admin Verification
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We do not allow automated sign-ups for drivers. Every driver
              application lands in our central Admin Dashboard, where their
              vehicle model and license numbers are manually reviewed and
              approved.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-[#e0e0e0]">
                <i className="fas fa-check-circle text-[#ffc107]"></i> Manual
                Profile Approvals
              </li>
              <li className="flex items-center gap-3 text-[#e0e0e0]">
                <i className="fas fa-check-circle text-[#ffc107]"></i>{" "}
                Centralized Database Logging
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="https://images.pexels.com/photos/376729/pexels-photo-376729.jpeg"
              alt="Verified Driver"
              className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#333]"
            />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg"
              alt="Secure Tech"
              className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#333]"
            />
          </div>
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-full border border-[#ffc107] text-[#ffc107] text-sm font-bold uppercase tracking-wide">
              Secure Tech
            </div>
            <h2 className="text-4xl font-bold mb-6">Encrypted & Secure</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              From the moment you enter your pickup location to the final
              payment, your data is handled securely. We utilize Razorpay's
              enterprise-grade encryption for all online transactions.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-[#e0e0e0]">
                <i className="fas fa-check-circle text-[#ffc107]"></i> Razorpay
                Payment Gateway
              </li>
              <li className="flex items-center gap-3 text-[#e0e0e0]">
                <i className="fas fa-check-circle text-[#ffc107]"></i> Real-time
                Twilio Notifications
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ SECTION  */}
      <section className="py-20 bg-black border-t border-[#2a2a2a]">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-center text-4xl mb-12 text-white font-bold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`bg-[#1e1e1e] border ${openIndex === index ? "border-[#ffc107]" : "border-[#333]"} rounded-xl transition-all duration-300 overflow-hidden`}
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-5 text-left text-lg font-semibold text-white focus:outline-none"
                  onClick={() => handleToggle(index)}
                >
                  <span>{item.question}</span>
                  <i
                    className={`fas fa-chevron-down text-[#ffc107] transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                  ></i>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out px-6 ${openIndex === index ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-[#b0b0b0] leading-relaxed border-t border-[#333] pt-4">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default SafetyPage;
