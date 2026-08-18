import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Services() {
  return (
    <div className="bg-[#121212] min-h-screen font-['Poppins',sans-serif] text-white">
      <Navbar />

      {/* HERO SECTION  */}
      <section className="pt-40 pb-20 text-center bg-linear-to-b from-[#1e1e1e] to-[#121212]">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Hire a Driver <span className="text-[#ffc107]">On Your Terms</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-[#e0e0e0] leading-relaxed">
            Forget about standard point A to point B rides. Hire a verified
            professional driver for exactly as many hours as you need them.
          </p>
        </div>
      </section>

      {/* RIDE OPTIONS GRID */}
      <section className="py-20 max-w-6xl mx-auto px-8">
        <h2 className="text-center text-4xl mb-16 font-semibold">
          Flexible Booking Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#1e1e1e] p-10 pb-8 text-center rounded-2xl border border-[#2a2a2a] transition-all duration-300 hover:border-[#ffc107] hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] group">
            <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ffc107] transition-colors duration-300">
              <i className="fas fa-shopping-bag text-4xl text-[#ffc107] group-hover:text-black"></i>
            </div>
            <h3 className="text-2xl text-white mb-3 font-bold">
              Quick Errands
            </h3>
            <p className="mb-6 text-[#b0b0b0]">
              Perfect for grocery runs, multiple quick stops, or a fast meeting
              across town.
            </p>
            <ul className="text-sm text-gray-400 space-y-2 mb-8">
              <li>
                <i className="fas fa-check text-[#ffc107] mr-2"></i> Ideal for
                1-3 Hours
              </li>
              <li>
                <i className="fas fa-check text-[#ffc107] mr-2"></i> Multiple
                Stops Allowed
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-[#1e1e1e] p-10 text-center rounded-2xl border border-[#ffc107] transform scale-110 shadow-[0_0_30px_rgba(255,193,7,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#ffc107] text-black text-xs font-bold px-3 py-2 uppercase">
              Most Popular
            </div>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#ffc107]">
              <i className="fas fa-briefcase text-4xl text-black"></i>
            </div>
            <h3 className="text-2xl text-white mb-3 font-bold">
              Full Day Hiring
            </h3>
            <p className="mb-6 text-[#b0b0b0]">
              Keep your driver on standby all day. Ideal for corporate events or
              city tours.
            </p>
            <ul className="text-sm text-gray-400 space-y-2 mb-8">
              <li>
                <i className="fas fa-check text-black mr-2"></i> Book up to 24
                Hours
              </li>
              <li>
                <i className="fas fa-check text-black mr-2"></i> Dedicated
                Availability
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-[#1e1e1e] p-10 text-center rounded-2xl border border-[#2a2a2a] transition-all duration-300 hover:border-[#ffc107] hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] group">
            <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ffc107] transition-colors duration-300">
              <i className="fas fa-moon text-4xl text-[#ffc107] group-hover:text-black"></i>
            </div>
            <h3 className="text-2xl text-white mb-3 font-bold">Night Drives</h3>
            <p className="mb-6 text-[#b0b0b0]">
              Attending a late-night event? Ensure a safe, verified ride back
              home.
            </p>
            <ul className="text-sm text-gray-400 space-y-2 mb-8">
              <li>
                <i className="fas fa-check text-[#ffc107] mr-2"></i> Verified
                Security
              </li>
              <li>
                <i className="fas fa-check text-[#ffc107] mr-2"></i>{" "}
                Wait-and-Return
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- FEATURES LIST --- */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-left mb-8 text-white text-4xl font-bold leading-tight">
              Why our service is <br />
              <span className="text-[#ffc107]">Unmatched.</span>
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="bg-[#1e1e1e] p-4 rounded-lg">
                  <i className="fas fa-hourglass-half text-2xl text-[#ffc107]"></i>
                </div>
                <div>
                  <h3 className="text-xl text-white mb-2 font-bold">
                    Hourly Rates
                  </h3>
                  <p className="text-gray-400">
                    You pay exactly for the time you need. Enter your duration,
                    and our system calculates the fixed fare instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-[#1e1e1e] p-4 rounded-lg">
                  <i className="fas fa-shield-alt text-2xl text-[#ffc107]"></i>
                </div>
                <div>
                  <h3 className="text-xl text-white mb-2 font-bold">
                    Admin Vetted
                  </h3>
                  <p className="text-gray-400">
                    Every request is reviewed. Every driver is verified. We
                    oversee the entire process manually to guarantee quality.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-[#1e1e1e] p-4 rounded-lg">
                  <i className="fas fa-credit-card text-2xl text-[#ffc107]"></i>
                </div>
                <div>
                  <h3 className="text-xl text-white mb-2 font-bold">
                    Flexible Payments
                  </h3>
                  <p className="text-gray-400">
                    Prepay securely online via Razorpay or choose to pay your
                    driver directly in cash when the ride ends.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#ffc107] blur-[100px] opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?q=80&w=1974&auto=format&fit=crop"
              alt="Luxury Car Interior"
              className="relative rounded-2xl shadow-2xl border border-[#333] z-10 w-full"
            />
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 text-center px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#ffc107] opacity-5"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-white text-4xl font-bold mb-6">Ready to Book?</h2>
          <p className="text-gray-400 mb-10 text-lg">
            Experience transparent, hourly driver hiring today.
          </p>
          <Link
            to="/"
            className="inline-block px-10 py-4 rounded-full font-medium text-lg bg-[#ffc107] text-black hover:bg-[#ffca2c] hover:shadow-[0_0_20px_rgba(255,193,7,0.4)] transition-all transform "
          >
            Book a Driver Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Services;
