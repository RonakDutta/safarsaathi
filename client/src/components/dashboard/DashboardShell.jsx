import { Link } from "react-router-dom";
import { LogOut, ArrowUpRight } from "lucide-react";
import Logo from "../Logo";

/**
 * Shared frame for the admin and driver dashboards.
 * `nav` is a list of { key, label, icon, count, highlight }.
 */
function DashboardShell({ label, nav, active, onNavigate, user, onLogout, children }) {
  const displayName = user?.full_name || user?.name || label;

  return (
    <div className="min-h-screen bg-ink text-fog">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-coal md:flex">
        <div className="flex h-16 items-center border-b border-line px-6">
          <Logo suffix={label} />
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label={`${label} sections`}>
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-raise text-white before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:bg-amber"
                    : "text-mute hover:bg-panel hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "text-amber" : ""} />
                {item.label}
                {item.count > 0 && (
                  <span
                    className={`ml-auto text-xs tabular-nums ${
                      item.highlight ? "font-semibold text-amber" : "text-mute"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mute transition-colors hover:bg-panel hover:text-white"
          >
            <ArrowUpRight size={18} />
            View website
          </Link>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {displayName}
              </p>
              {user?.email && (
                <p className="truncate text-xs text-mute">{user.email}</p>
              )}
            </div>
            <button
              onClick={onLogout}
              className="shrink-0 text-mute transition-colors hover:text-danger"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header + tabs */}
      <header className="sticky top-0 z-30 border-b border-line bg-coal/95 backdrop-blur md:hidden">
        <div className="flex h-14 items-center justify-between px-5">
          <Logo suffix={label} className="text-lg" />
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-mute hover:text-white"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
        <nav
          className="flex gap-6 overflow-x-auto px-5 [scrollbar-width:none]"
          aria-label={`${label} sections`}
        >
          {nav.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={isActive ? "page" : undefined}
                className={`-mb-px flex shrink-0 items-center gap-1.5 border-b-2 py-3 text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? "border-amber text-white"
                    : "border-transparent text-mute"
                }`}
              >
                {item.label}
                {item.count > 0 && (
                  <span
                    className={`tabular-nums ${item.highlight ? "text-amber" : "text-mute"}`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageHeader({ title, description, children }) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-2 text-mute">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function StatStrip({ stats }) {
  const fourUp = stats.length === 4;
  return (
    <dl
      className={`grid overflow-hidden rounded-xl border border-line bg-panel ${
        fourUp ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3"
      }`}
    >
      {stats.map((stat, index) => {
        // Hairline dividers between cells, for both the 2x2 and 1x4 layouts
        const divider = fourUp
          ? `${index % 2 ? "border-l" : ""} ${index >= 2 ? "border-t lg:border-t-0" : ""} ${index ? "lg:border-l" : ""}`
          : index
            ? "border-l"
            : "";
        return (
          <div key={stat.label} className={`border-line p-4 sm:p-6 ${divider}`}>
            <dt className="text-xs text-mute sm:text-sm">{stat.label}</dt>
            <dd
              className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl ${
                stat.accent ? "text-amber" : "text-white"
              }`}
            >
              {stat.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center">
      <p className="font-medium text-white">{title}</p>
      {body && <p className="mt-1 text-sm text-mute">{body}</p>}
    </div>
  );
}

export default DashboardShell;
