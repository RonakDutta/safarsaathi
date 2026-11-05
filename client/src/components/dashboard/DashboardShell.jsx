import { Link } from "react-router-dom";
import { LogOut, ArrowUpRight, Inbox } from "lucide-react";
import Logo from "../Logo";

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

  return (
    <div className="min-h-screen bg-ink text-fog">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/[0.06] bg-coal lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo suffix={label} />
        </div>

        <nav className="flex-1 space-y-1 px-3 pt-2" aria-label={`${label} sections`}>
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={isActive ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/[0.06] text-white"
                    : "text-mute hover:text-white"
                }`}
              >
                <Icon size={17} className={isActive ? "text-amber" : ""} />
                {item.label}
                {item.count > 0 && (
                  <span
                    className={`ml-auto text-xs tabular-nums ${
                      item.highlight ? "text-amber" : "text-mute"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/[0.06] p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mute hover:text-white"
          >
            <ArrowUpRight size={17} />
            View website
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {displayName}
              </p>
              <p className="truncate text-xs text-mute">{label} account</p>
            </div>
            <button
              onClick={onLogout}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-mute hover:text-danger"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-black/95 lg:hidden">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <Logo suffix={label} />
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-mute"
              aria-label="View website"
            >
              <ArrowUpRight size={18} />
            </Link>
            <button
              onClick={onLogout}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-mute"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <nav
        className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-black/95 lg:hidden"
        aria-label={`${label} sections`}
      >
        <div
          className="mx-auto grid max-w-lg"
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
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  isActive ? "text-amber" : "text-mute"
                }`}
              >
                <Icon size={19} />
                {item.label}
                {item.count > 0 && (
                  <span className="absolute top-1.5 left-1/2 ml-2 rounded-full bg-amber px-1.5 text-[10px] font-semibold text-black tabular-nums">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10 lg:pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageHeader({ title, description, children }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="display text-2xl sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-mute">{description}</p>}
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
    <dl className={`grid gap-3 ${cols}`}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="surface p-4 sm:p-5">
            <dt className="flex items-center gap-2 text-xs text-mute sm:text-sm">
              {Icon && <Icon size={15} />}
              {stat.label}
            </dt>
            <dd
              className={`mt-3 text-2xl font-semibold tabular-nums sm:text-3xl ${
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

export function EmptyState({ title, body, icon = Inbox }) {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
      <Icon size={22} className="text-dim" />
      <p className="mt-3 font-medium text-white">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-mute">{body}</p>}
    </div>
  );
}

export default DashboardShell;
