// components/LogosRow.jsx
const logos = [
  { name: "Cloud", src: "/logos/cloud.svg" },
  { name: "Hues", src: "/logos/hues.svg" },
  { name: "Penta", src: "/logos/penta.svg" },
];

export default function LogosRow() {
  return (
    <section className="py-8">
      <div className="container mx-auto flex items-center justify-center gap-8 flex-wrap">
        {logos.map(l => (
          <div key={l.name} className="w-28 opacity-80 grayscale hover:grayscale-0 transition">
            <img src={l.src} alt={l.name} />
          </div>
        ))}
      </div>
    </section>
  );
}
