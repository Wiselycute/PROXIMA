import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="w-full py-28 bg-[var(--background)] transition-colors duration-300">

      <div className="absolute inset-0 pointer-events-none">
        <div className="w-72 h-72 bg-[#4BE2F2]/20 blur-[120px] absolute top-10 left-20"></div>
        <div className="w-72 h-72 bg-[#9B72CF]/20 blur-[140px] absolute bottom-10 right-20"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <h2 className="text-center text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
          Loved by Teams Everywhere
        </h2>
        <p className="text-center opacity-70 text-[var(--foreground)] mb-16">
          Real feedback from people working closely together.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-[color-mix(in srgb,var(--card) 85%,transparent 15%)] border border-[var(--border)]
                         backdrop-blur-xl shadow-xl hover:shadow-[0_0_20px_#4BE2F2] transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">
                <Image
                  src="/avatar.jpg"
                  width={70}
                  height={70}
                  alt="avatar"
                  className="rounded-full border-2 border-[#4BE2F2] shadow-[0_0_15px_#4BE2F2]"
                />
              </div>

              <p className="opacity-80 text-[var(--foreground)] italic mb-4">
                “Proxima made our workflow clear, organized, and stress-free.  
                Tasks finally feel manageable.”
              </p>

              <h3 className="font-semibold text-[var(--foreground)]">Jordan Smith</h3>
              <p className="text-sm opacity-60 text-[var(--foreground)]">Team Lead</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
