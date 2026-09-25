import { CarTaxiFront } from "lucide-react";
import Reveal from "./Reveal";

function Car() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber text-black shadow-[0_0_24px_rgb(255_193_7/0.55)]">
      <CarTaxiFront size={18} />
    </span>
  );
}

// A track the size of the road that slides forward with transform, carrying
// the taxi at its leading edge. Cheaper than animating left or top.
function DrivingCar({ vertical }) {
  return vertical ? (
    <div className="absolute inset-0 [animation:drive-y_9s_linear_infinite] will-change-transform">
      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Car />
      </span>
    </div>
  ) : (
    <div className="absolute inset-0 [animation:drive-x_9s_linear_infinite] will-change-transform">
      <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
        <Car />
      </span>
    </div>
  );
}

// Steps laid along a road, with a taxi driving past each milestone.
// Horizontal on large screens, vertical on phones and tablets.
function RoadTimeline({ steps }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <Reveal className="relative h-16 rounded-full border border-white/[0.07] bg-coal">
          <div className="lane absolute inset-x-8 top-1/2 h-[3px] -translate-y-1/2 opacity-60" />
          <div className="absolute inset-y-0 inset-x-10 overflow-hidden">
            <DrivingCar />
          </div>
          {steps.map((step, index) => (
            <span
              key={step.title}
              className="absolute top-1/2 flex h-7 -translate-x-1/2 -translate-y-1/2 items-center rounded-full border border-white/15 bg-black px-2.5 text-[10px] font-bold tracking-widest text-fog tabular-nums"
              style={{ left: `${12.5 + index * 25}%` }}
            >
              KM {String(index + 1).padStart(2, "0")}
            </span>
          ))}
        </Reveal>

        <div className="grid grid-cols-4 gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 110}>
                <div className="mx-auto h-8 w-px bg-linear-to-b from-white/20 to-transparent" />
                <div className="group card card-hover h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-amber transition-colors duration-300 group-hover:bg-amber group-hover:text-black">
                      <Icon size={22} />
                    </span>
                    <span className="text-5xl font-extrabold tracking-tighter text-white/[0.06] tabular-nums">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Mobile and tablet */}
      <div className="relative lg:hidden">
        <div className="absolute top-0 bottom-0 left-0 w-10 overflow-hidden rounded-full border border-white/[0.07] bg-coal">
          <div className="lane-y absolute inset-y-4 left-1/2 w-[3px] -translate-x-1/2 opacity-50" />
          <div className="absolute inset-x-0 top-6 bottom-6">
            <DrivingCar vertical />
          </div>
        </div>

        <ol className="space-y-3 pl-[3.25rem] sm:pl-14">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal as="li" key={step.title} delay={index * 80}>
                <div className="card relative p-4 sm:p-6">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber">
                      <Icon size={19} />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-mute">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </>
  );
}

export default RoadTimeline;
