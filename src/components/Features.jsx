// components/Features.jsx
import FeatureCard from "./FeatureCard";
import PerformanceChart from "./PerformanceChart";

export default function Features() {
  return (
    <section className="py-20 bg-theme">
      <div className="container-xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left column: header */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-extrabold mb-4" style={{ color: "var(--foreground)" }}>
              Key Features to <br /> Boost Team Success
            </h2>
            <p className="text-sm opacity-80" style={{ color: "var(--muted-foreground, var(--foreground))" }}>
              Experience a new level of team efficiency — from project management to performance insights, our PROXIMA-driven tools
              handle the details so your team can focus on impact.
            </p>
          </div>

          {/* Right column: main grid */}
          <div className="md:col-span-2 space-y-6">
            {/* Top: two large cards side-by-side */}
            <div className="grid feature-grid-large gap-6">
              <FeatureCard title="Streamline Team Collaboration" variant="large" badge>
                <div className="space-y-3">
                  <p className="text-sm opacity-80">
                    Effortlessly manage teamwork with all tools in one PROXIMA-powered platform.
                  </p>

                  {/* invite list mock */}
                  <div className="bg-[color-mix(in oklch, var(--card) 60%, transparent 40%)] p-3 rounded-lg">
                    <div className="flex items-center justify-between text-xs opacity-80">
                      <div className="flex items-center gap-2">
                        <span className="rounded px-2 py-1 text-[10px] bg-white/5">Slack</span>
                        <span className="rounded px-2 py-1 text-[10px] bg-white/5">Figma</span>
                      </div>
                      <div className="text-xs opacity-60">Invite</div>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full" style={{ background: "color-mix(in oklch, var(--primary) 65%, white 10%)" }} />
                          <div>
                            <div className="font-medium">Rosie Gray</div>
                            <div className="opacity-70 text-[12px]">rosie@company.com</div>
                          </div>
                        </div>
                        <button className="text-xs px-2 py-1 rounded-md border" style={{ borderColor: "var(--border)" }}>Invite</button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full" style={{ background: "color-mix(in oklch, var(--primary) 55%, white 6%)" }} />
                          <div>
                            <div className="font-medium">Naomi Watts</div>
                            <div className="opacity-70 text-[12px]">naomi@company.com</div>
                          </div>
                        </div>
                        <button className="text-xs px-2 py-1 rounded-md border" style={{ borderColor: "var(--border)" }}>Invite</button>
                      </div>
                    </div>
                  </div>
                </div>
              </FeatureCard>

              <FeatureCard title="Automate Repetitive Tasks" variant="large" badge>
                <div className="space-y-3">
                  <p className="text-sm opacity-80">
                    Let PROXIMA handle routine tasks so your team can focus on results.
                  </p>

                  {/* small mock task card inside */}
                  <div className="bg-[color-mix(in oklch, var(--card) 60%, transparent 40%)] p-3 rounded-lg">
                    <div className="flex items-center justify-between text-xs opacity-90">
                      <div>
                        <div className="font-medium">Designing a Landing</div>
                        <div className="opacity-70 text-[12px]">Repeated Weekly</div>
                      </div>
                      <div className="text-xs opacity-60">Due Mon</div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full" style={{ background: "var(--primary)" }} />
                        <div className="opacity-80">9:30 AM</div>
                      </div>
                      <div className="flex items-center gap-2 opacity-80">
                        <div className="w-8 h-4 rounded bg-[color-mix(in oklch, var(--accent) 60%, transparent 40%)]" />
                        <div className="text-xs">Save</div>
                      </div>
                    </div>
                  </div>
                </div>
              </FeatureCard>
            </div>

            {/* Bottom: three small cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard title="Performance Insights" variant="small" badge={false} footer={<div className="mt-3"><span className="opacity-70 text-sm">Monthly Projects</span></div>}>
                <div>
                  <PerformanceChart value={26} />
                </div>
              </FeatureCard>

              <FeatureCard title="Project Management" variant="small" badge={false}>
                <div className="space-y-3">
                  <div className="text-xs opacity-70">In Progress</div>
                  <div className="bg-[color-mix(in oklch, var(--card) 65%, transparent 35%)] p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div>Qualitative Research</div>
                      <div className="pill" style={{ background: "color-mix(in oklch, var(--primary) 60%, transparent 20%)", color: "var(--primary-foreground)" }}>Planning</div>
                    </div>
                    <div className="mt-3 text-xs opacity-70">Completed: 24</div>
                  </div>
                </div>
              </FeatureCard>

              <FeatureCard title="Smart Decision-Making" variant="small" badge={false}>
                <div className="text-sm opacity-80">
                  PROXIMA-powered suggestions help optimize workflows and boost efficiency.
                </div>
              </FeatureCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
