import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageLayout from "../components/PageLayout";

function NotFound() {
  return (
    <PageLayout>
      <section className="container-page flex flex-col items-center py-28 text-center lg:py-40">
        <p className="animate-rise text-7xl font-bold text-amber sm:text-8xl">
          404
        </p>
        <h1 className="animate-rise mt-6 text-2xl font-semibold text-white [animation-delay:80ms] sm:text-3xl">
          This road does not go anywhere
        </h1>
        <p className="animate-rise mt-3 max-w-md text-mute [animation-delay:160ms]">
          The page you are looking for has moved or never existed.
        </p>
        <div className="animate-rise mt-10 [animation-delay:240ms]">
          <Link to="/" className="btn-primary group px-6 py-3.5">
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to home
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

export default NotFound;
