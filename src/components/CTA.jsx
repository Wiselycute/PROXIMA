export default function CTA() {
  return (
    <section className="relative w-full py-8 bg-[var(--background)] transition-colors duration-300">

      {/* Soft Glow Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#4BE2F2]/25 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#9B72CF]/25 blur-[140px] rounded-full"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <h2 className="text-5xl font-extrabold text-[var(--foreground)] mb-6 leading-tight">
          Work Smarter.  
          <br />
          Work <span className="text-[#4BE2F2]">Together</span>.
        </h2>

        <p className="text-lg opacity-70 text-[var(--foreground)] mb-12">
          Join thousands of teams using Proxima to build clarity, focus, and flow.
        </p>

        <button
          className="px-14 py-5 rounded-full text-xl font-semibold 
                     bg-[#4BE2F2] text-black 
                     shadow-[0_0_30px_#4BE2F2] hover:shadow-[0_0_50px_#4BE2F2]
                     hover:scale-105 transition duration-300"
        >
          Start Your Free Trial
        </button>
      </div>
    </section>
  );
}
