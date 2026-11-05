import { Link } from "react-router-dom";
import { LogOut, ArrowUpRight, Inbox } from "lucide-react";
import Logo from "../Logo";

function CountBadge({ count, className = "" }) {
  return (
    <span
      className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber px-1 text-[10px] leading-none font-semibold text-black tabular-nums ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

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
  const initial = (displayName || "?").charAt(0).toUpperCase();

  const navigate = (key) => {
    onNavigate(key);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-ink text-fog">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/[0.06] bg-coal lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo suffix={label} />
        </div>

        <nav
          className="flex-1 space-y-1 px-3 pt-4"
          aria-label={`${label} sections`}
        >
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-white/[0.07] text-white"
                    : "text-mute hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-amber"
                  />
                )}
                <Icon size={18} className={isActive ? "text-amber" : ""} />
                {item.label}
                {item.count > 0 &&
                  (item.highlight ? (
                    <CountBadge count={item.count} className="ml-auto" />
                  ) : (
                    <span className="ml-auto text-xs text-mute tabular-nums">
                      {item.count}
                    </span>
                  ))}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/[0.06] p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-mute transition-colors hover:bg-white/[0.03] hover:text-white"
          >
            <ArrowUpRight size={18} />
            View website
          </Link>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber/15 text-sm font-semibold text-amber">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {displayName}
              </p>
              <p className="truncate text-xs text-mute">{label} account</p>
            </div>
            <button
              onClick={onLogout}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-mute transition-colors hover:bg-danger/10 hover:text-danger"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Phone / tablet top bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-black/80 backdrop-blur-md lg:hidden">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <Logo suffix={label} className="text-lg" />
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-full text-mute transition-colors hover:bg-white/5 hover:text-white active:scale-95"
              aria-label="View website"
              title="View website"
            >
              <ArrowUpRight size={19} />
            </Link>
            <button
              onClick={onLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full text-mute transition-colors hover:bg-danger/10 hover:text-danger active:scale-95"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Phone / tablet bottom tab bar */}
      <nav
        className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-black/85 backdrop-blur-md lg:hidden"
        aria-label={`${label} sections`}
      >
        <div
          className="mx-auto grid max-w-lg"
          style={{
            gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))`,
          }}
        >
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                aria-current={isActive ? "page" : undefined}
                className="group flex min-w-0 flex-col items-center gap-1 pt-2 pb-2.5"
              >
                <span
                  className={`relative flex h-8 w-14 items-center justify-center rounded-full transition-[background-color,color,transform] duration-200 group-active:scale-90 ${
                    isActive
                      ? "bg-amber/15 text-amber"
                      : "text-mute group-hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.count > 0 && item.highlight && (
                    <CountBadge
                      count={item.count}
                      className="absolute -top-1 right-1 ring-2 ring-black"
                    />
                  )}
                </span>
                <span
                  className={`max-w-full truncate px-1 text-[11px] font-medium transition-colors ${
                    isActive ? "text-white" : "text-mute"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <main className="lg:pl-64">
        <div
          key={active}
          className="animate-fade mx-auto max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10 lg:pb-16"
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageHeader({ title, description, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="display text-2xl leading-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-mute">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export function StatStrip({ stats }) {
  const cols =
    stats.length === 4
      ? "grid-cols-2 md:grid-cols-4"
      : stats.length === 3
        ? "grid-cols-3"
        : "grid-cols-2";
  return (
    <dl className={`grid gap-2.5 sm:gap-4 ${cols}`}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="surface flex min-w-0 flex-col p-3.5 sm:p-5"
          >
            <dt className="flex items-center justify-between gap-2 text-xs leading-snug text-mute sm:text-sm">
              <span className="min-w-0">{stat.label}</span>
              {Icon && (
                <span
                  className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:flex ${
                    stat.accent
                      ? "bg-amber/10 text-amber"
                      : "bg-white/[0.05] text-mute"
                  }`}
                >
                  <Icon size={16} />
                </span>
              )}
            </dt>
            <dd
              className={`mt-auto truncate pt-2 text-xl font-semibold tabular-nums sm:pt-3 sm:text-3xl ${
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
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] text-mute">
        <Icon size={22} />
      </span>
      <p className="mt-4 font-medium text-white">{title}</p>
      {body && (
        <p className="mt-1 max-w-sm text-sm leading-relaxed text-mute">
          {body}
        </p>
      )}
    </div>
  );
}

export default DashboardShell;
