function Footer() {
  return (
    <div>
      <footer className="bg-black pt-16 border-t border-[#2a2a2a]">
        <div className="max-w-275 mx-auto px-8 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 pb-12">
          <div>
            <a
              href="#"
              className="text-[#ffc107] no-underline text-3xl font-bold mb-4 inline-block hover:text-[#ffc107]"
            >
              SafarSaathi
            </a>
            <p className="mb-4 text-[#e0e0e0]">
              Your reliable partner for city travel. Connecting you to your
              destination with comfort and safety.
            </p>
          </div>
          <div>
            <h4 className="text-white mb-4 text-xl font-medium">Quick Links</h4>
            <ul className="list-none">
              <li className="mb-2">
                <a
                  href="#"
                  className="text-[#e0e0e0] no-underline hover:text-[#ffc107] hover:pl-1 transition-all duration-300"
                >
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#services"
                  className="text-[#e0e0e0] no-underline hover:text-[#ffc107] hover:pl-1 transition-all duration-300"
                >
                  Services
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-[#e0e0e0] no-underline hover:text-[#ffc107] hover:pl-1 transition-all duration-300"
                >
                  Careers
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-[#e0e0e0] no-underline hover:text-[#ffc107] hover:pl-1 transition-all duration-300"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4 text-xl font-medium">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-[#e0e0e0] text-2xl transition-colors duration-300 hover:text-[#ffc107]"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="text-[#e0e0e0] text-2xl transition-colors duration-300 hover:text-[#ffc107]"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-[#e0e0e0] text-2xl transition-colors duration-300 hover:text-[#ffc107]"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="text-[#e0e0e0] text-2xl transition-colors duration-300 hover:text-[#ffc107]"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center py-6 border-t border-[#2a2a2a] text-sm text-[#888]">
          <p>&copy; 2025 SafarSaathi. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
