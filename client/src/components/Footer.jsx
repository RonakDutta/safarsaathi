import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="brand text-white">Safar<span>Saathi</span></Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Thoughtful, dependable driver booking for every hour your day needs.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Explore</h2>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm"><Link to="/services" className="footer-link">Services</Link><Link to="/safety" className="footer-link">Safety</Link><Link to="/drive" className="footer-link">Drive with us</Link></div>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Stay connected</h2>
          <div className="mt-4 flex gap-5 text-lg"><a href="#" aria-label="Instagram" className="footer-link"><i className="fab fa-instagram" /></a><a href="#" aria-label="LinkedIn" className="footer-link"><i className="fab fa-linkedin-in" /></a><a href="#" aria-label="Facebook" className="footer-link"><i className="fab fa-facebook-f" /></a></div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-5 py-5 text-center text-xs text-slate-500">© 2025 SafarSaathi. Made for moving cities.</div>
    </footer>
  );
}

export default Footer;
