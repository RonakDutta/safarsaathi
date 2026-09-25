import { Link } from "react-router-dom";
import { LogOut, ArrowUpRight, Inbox } from "lucide-react";
import Logo from "../Logo";

/**
 * Shared frame for the admin and driver dashboards.
 * `nav` is a list of { key, label, icon, count, highlight }.
 */
function DashboardShell({
  label,
  nav,
  active,
  onNavigate,
  user,
  onLogout,
  children,
}) {
  const displayName = user?.full_name || user?.name || label;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-ink text-fog">
      <div className="pointer-events-none fixed top-[-12rem] right-[-10rem] -z-0 h-[30rem] w-[30rem] glow [--glow:0.098]" />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-3 left-3 z-30 hidden w-64 flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-coal lg:flex">
        <div className="checker h-2 shrink-0 [--sq:4px]" />
        <div className="flex h-20 items-center px-5">
          <Logo className="text-lg" />
        </div>

        <nav className="flex-1 space-y-1 px-3" aria-label={`${label} sections`}>
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={isActive ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-amber text-black"
                    : "text-mute hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
                {item.count > 0 && (
                  <span
                    className={`ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums ${
                      isActive
                        ? "bg-black text-amber"
                        : item.highlight
                          ? "bg-amber/15 text-amber"
                          : "bg-white/[0.06] text-mute"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-mute transition-colors duration-200 hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowUpRight size={18} />
            View website
          </Link>
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/15 text-sm font-bold text-amber">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {displayName}
              </p>
              <p className="truncate text-xs text-mute">
                {label} account
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-mute transition-colors hover:bg-danger/10 hover:text-danger"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-black/95 lg:hidden">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Logo suffix={label} className="text-lg" />
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-mute"
              aria-label="View website"
            >
              <ArrowUpRight size={17} />
            </Link>
            <button
              onClick={onLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-mute transition-colors active:text-danger"
              aria-label="Log out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom tabs */}
      <nav
        className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-black/95 lg:hidden"
        aria-label={`${label} sections`}
      >
        <div
          className="mx-auto grid max-w-lg px-2"
          style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}
        >
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 pt-2.5 pb-3 text-[11px] font-medium transition-colors ${
                  isActive ? "text-white" : "text-mute"
                }`}
              >
                <span
                  className={`relative flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-300 ${
                    isActive ? "bg-amber text-black" : ""
                  }`}
                >
                  <Icon size={19} />
                  {item.count > 0 && (
                    <span
                      className={`absolute -top-1 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums ring-2 ${
                        isActive
                          ? "bg-black text-amber ring-amber"
                          : item.highlight
                            ? "bg-amber text-black ring-black"
                            : "bg-raise text-fog ring-black"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="relative lg:pl-[17.5rem]">
        <div className="mx-auto max-w-6xl px-4 pt-7 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageHeader({ title, description, children }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
      <div>
        <h1 className="display text-3xl leading-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-mute">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function StatStrip({ stats }) {
  const cols =
    stats.length === 4
      ? "grid-cols-2 lg:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3";
  return (
    <dl className={`grid gap-3 sm:gap-4 ${cols}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const first = index === 0 && stat.accent;
        const wide = first && stats.length % 2 === 1;
        return (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-3xl p-4 sm:p-6 ${
              first
                ? `bg-amber text-black ${wide ? "col-span-2 sm:col-span-1" : ""}`
                : "border border-white/[0.07] bg-panel"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <dt
                className={`text-xs font-medium sm:text-sm ${first ? "text-black/65" : "text-mute"}`}
              >
                {stat.label}
              </dt>
              {Icon && (
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    first ? "bg-black/10" : "bg-white/[0.05] text-amber"
                  }`}
                >
                  <Icon size={17} />
                </span>
              )}
            </div>
            <dd
              className={`mt-3 text-2xl font-bold tracking-tight tabular-nums sm:mt-5 sm:text-4xl ${
                first ? "" : stat.accent ? "text-amber" : "text-white"
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

export function EmptyState({ title, body, icon = Inbox }) {
  const Icon = icon;
  return (
    <div className="animate-fade flex flex-col items-center rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-dim">
        <Icon size={22} />
      </span>
      <p className="mt-4 font-semibold text-white">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-mute">{body}</p>}
    </div>
  );
}

export default DashboardShell;
