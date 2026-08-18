function Bodyfooter() {
  return (
    <>
      <section id="services" className="py-24 max-w-275 mx-auto px-8">
        <h2 className="text-center text-4xl mb-12 text-white font-semibold">
          How It Works
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
          <div className="bg-[#1e1e1e] p-8 text-center rounded-xl border border-[#2a2a2a] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-[#ffc107] group">
            <i className="fas fa-mobile-alt text-5xl text-[#ffc107] mb-6 group-hover:scale-110 transition-transform"></i>
            <h3 className="text-2xl text-white mb-2 font-medium">
              1. Book in Seconds
            </h3>
            <p className="mb-4 text-[#e0e0e0]">
              Enter your destination and choose the duration of your trip.
            </p>
          </div>
          <div className="bg-[#1e1e1e] p-8 text-center rounded-xl border border-[#2a2a2a] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-[#ffc107] group">
            <i className="fas fa-taxi text-5xl text-[#ffc107] mb-6 group-hover:scale-110 transition-transform"></i>
            <h3 className="text-2xl text-white mb-2 font-medium">
              2. Driver Arrives
            </h3>
            <p className="mb-4 text-[#e0e0e0]">
              A professional driver accepts your request and reaches your pickup
              location.
            </p>
          </div>
          <div className="bg-[#1e1e1e] p-8 text-center rounded-xl border border-[#2a2a2a] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-[#ffc107] group">
            <i className="fas fa-credit-card text-5xl text-[#ffc107] mb-6 group-hover:scale-110 transition-transform"></i>
            <h3 className="text-2xl text-white mb-2 font-medium">
              3. Ride & Pay
            </h3>
            <p className="mb-4 text-[#e0e0e0]">
              Enjoy your ride and pay seamlessly with online or cash options.
            </p>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-24 bg-[#0d0d0d]">
        <div className="max-w-275 mx-auto px-8">
          <h2 className="text-center text-4xl mb-12 text-white font-semibold">
            Why Ride With SafarSaathi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-12">
            <div>
              <img
                src="https://images.pexels.com/photos/1521580/pexels-photo-1521580.jpeg"
                alt="Modern car"
                className="w-full h-auto rounded-xl object-cover shadow-2xl"
              />
            </div>
            <div>
              <div className="flex items-start gap-6 mb-8 group">
                <div className="bg-[#1e1e1e] rounded-full w-16 h-16 flex items-center justify-center shrink-0 group-hover:bg-[#ffc107] transition-colors">
                  <i className="fas fa-shield-alt text-3xl text-[#ffc107] group-hover:text-black"></i>
                </div>
                <div>
                  <h3 className="text-2xl text-white mb-2 font-medium">
                    Safety First
                  </h3>
                  <p className="mb-4 text-[#e0e0e0]">
                    With live tracking and 24/7 support, your safety is our
                    priority.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6 mb-8 group">
                <div className="bg-[#1e1e1e] rounded-full w-16 h-16 flex items-center justify-center shrink-0 group-hover:bg-[#ffc107] transition-colors">
                  <i className="fas fa-dollar-sign text-3xl text-[#ffc107] group-hover:text-black"></i>
                </div>
                <div>
                  <h3 className="text-2xl text-white mb-2 font-medium">
                    Transparent Pricing
                  </h3>
                  <p className="mb-4 text-[#e0e0e0]">
                    Know your fare upfront based on duration. No hidden charges.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="bg-[#1e1e1e] rounded-full w-16 h-16 flex items-center justify-center shrink-0 group-hover:bg-[#ffc107] transition-colors">
                  <i className="fas fa-users text-3xl text-[#ffc107] group-hover:text-black"></i>
                </div>
                <div>
                  <h3 className="text-2xl text-white mb-2 font-medium">
                    Trusted Drivers
                  </h3>
                  <p className="mb-4 text-[#e0e0e0]">
                    All our drivers are background-checked and professionally
                    trained.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section
        id="app"
        className="py-24 flex justify-center items-center text-center max-w-275 mx-auto px-8"
      >
        <div>
          <h2 className="text-4xl text-white mb-4 font-semibold">
            Get the SafarSaathi App (Coming Soon)
          </h2>
          <p className="mb-4 text-[#e0e0e0]">
            Book and manage your rides on the go. Download our app for a better
            experience.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
            <a
              href="#"
              className="bg-black border border-[#444] w-full md:w-auto text-white px-8 py-3 rounded-lg flex items-center justify-center gap-3 transition-colors duration-300 hover:bg-[#222] no-underline"
            >
              <i className="fab fa-apple text-3xl"></i>
              <span className="text-left leading-tight">
                Download on the <br />
                <strong>App Store</strong>
              </span>
            </a>
            <a
              href="#"
              className="bg-black border border-[#444] w-full md:w-auto text-white px-8 py-3 rounded-lg flex items-center justify-center gap-3 transition-colors duration-300 hover:bg-[#222] no-underline"
            >
              <i className="fab fa-google-play text-3xl"></i>
              <span className="text-left leading-tight">
                GET IT ON <br />
                <strong>Google Play</strong>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Bodyfooter;
