import { Link } from "react-router-dom";
import { ArrowLeft, CarTaxiFront } from "lucide-react";
import PageLayout from "../components/PageLayout";

function NotFound() {
  return (
    <PageLayout>
      <section className="relative isolate overflow-hidden">
        <div className="bg-grid mask-fade absolute inset-0 -z-10" />
        <div className="absolute top-1/3 left-1/2 -z-10 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-amber/15 blur-[120px]" />

        <div className="container-page flex flex-col items-center pt-36 pb-24 text-center lg:pt-44 lg:pb-36">
          <p className="animate-rise text-[8rem] leading-none font-extrabold tracking-tighter text-amber sm:text-[12rem]">
            404
          </p>

          <div className="animate-rise relative mt-6 h-12 w-full max-w-md overflow-hidden rounded-full border border-white/[0.07] bg-coal [animation-delay:80ms]">
            <div className="lane absolute inset-x-6 top-1/2 h-[3px] -translate-y-1/2 opacity-60" />
            <span className="absolute top-1/2 right-6 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-amber text-black">
              <CarTaxiFront size={16} />
            </span>
          </div>

          <h1 className="animate-rise mt-10 text-2xl font-bold tracking-tight text-white [animation-delay:160ms] sm:text-4xl">
            This road doesn&apos;t go anywhere.
          </h1>
          <p className="animate-rise mt-3 max-w-md text-mute [animation-delay:220ms]">
            The page you are looking for has moved or never existed.
          </p>
          <div className="animate-rise mt-10 [animation-delay:280ms]">
            <Link to="/" className="btn-primary group px-7 py-4 text-base">
              <ArrowLeft
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default NotFound;
