import Image from "next/image";

export default function About() {
  return (
    <section className="w-full py-28 bg-[var(--background)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-8">
            About <span className="text-[#4BE2F2]">Proxima</span>
          </h2>

          <p className="text-[var(--foreground)]/80 leading-relaxed text-lg mb-6">
            Proxima helps teams replace chaos with clarity.  
            A beautifully structured way to manage tasks, collaborate,  
            and move forward together.
          </p>

          <p className="text-[var(--foreground)]/70 leading-relaxed mb-8">
            Designed with care for startups, remote teams,  
            and creators who value clean and elegant workflow.
          </p>

          <ul className="space-y-4">
            {[
              "Real-time Collaboration",
              "Clean & intuitive Kanban UI",
              "Fast & distraction-free interface",
              "Perfect for agile teams",
              "Designed with beauty and intention"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-[var(--foreground)]">
                <span className="w-3 h-3 rounded-full bg-[#4BE2F2] shadow-[0_0_10px_#4BE2F2]"></span>
                <span className="opacity-80">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center relative">
          <div className="relative w-full max-w-md">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200"
              width={500}
              height={400}
              alt="Dashboard"
              className="rounded-3xl border border-[var(--border)]
                         bg-[color-mix(in srgb,var(--card) 90%,transparent 10%)]"
            />

            {/* Glow */}
            <div className="absolute -bottom-12 -left-10 w-60 h-60 bg-[#4BE2F2]/20 blur-[100px]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
