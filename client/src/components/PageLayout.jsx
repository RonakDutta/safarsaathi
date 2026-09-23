import Navbar from "./Navbar";
import Footer from "./Footer";

// `overlay` lets the page's hero sit behind a transparent navbar.
function PageLayout({ children, overlay = false }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-fog">
      <Navbar overlay={overlay} />
      <main
        className={`flex-1 animate-fade ${overlay ? "" : "pt-16 md:pt-[72px]"}`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PageLayout;
