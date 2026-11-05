import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

function NotFound() {
  return (
    <PageLayout>
      <section className="container-page flex flex-col items-center pt-40 pb-32 text-center">
        <p className="text-7xl font-bold tracking-normal text-amber">404</p>
        <h1 className="mt-6 text-2xl font-semibold text-white">
          This road doesn&apos;t go anywhere.
        </h1>
        <p className="mt-3 max-w-md text-mute">
          The page you are looking for has moved or never existed.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </section>
    </PageLayout>
  );
}

export default NotFound;
