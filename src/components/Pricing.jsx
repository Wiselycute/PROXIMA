// components/PricingSection.jsx
"use client";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for individuals trying out Proxima.",
    features: [
      "Up to 2 team boards",
      "Basic task management",
      "Unlimited personal notes",
      "1 GB storage",
    ],
    button: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12/mo",
    description: "For small teams who want better workflow clarity.",
    features: [
      "Up to 10 team boards",
      "Real-time collaboration",
      "Advanced filters & search",
      "Integrations + automation",
      "10 GB storage",
    ],
    button: "Start Pro",
    highlighted: true, // Most popular
  },
  {
    name: "Enterprise",
    price: "$39/mo",
    description: "For growing organizations that need power & control.",
    features: [
      "Unlimited team boards",
      "Role-based permissions",
      "Admin dashboard",
      "Priority support",
      "Unlimited storage",
    ],
    button: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-24 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-sm opacity-70 mt-3">
          Choose the perfect plan for your team. Upgrade anytime.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`
                relative p-8 rounded-3xl border backdrop-blur-xl transition shadow-[0_0_20px_rgba(255,255,255,0.04)]
                bg-[color-mix(in_srgb,var(--card)_85%,transparent_15%)]
                border-[color-mix(in_srgb,var(--border)_80%,transparent_20%)]
                hover:-translate-y-1 duration-300
            
                ${
                  plan.highlighted
                    ? "border-[var(--primary)] shadow-[0_0_25px_rgba(78,227,242,0.25)]"
                    : ""
                }
              `}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-3xl font-extrabold mt-4">{plan.price}</p>
              <p className="text-sm opacity-70 mt-1">{plan.description}</p>

              <div className="mt-6 space-y-3">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Check className="text-[var(--primary)]" size={16} />
                    <span className="opacity-80">{f}</span>
                  </div>
                ))}
              </div>

              <button
                className={`
                  mt-8 w-full py-3 rounded-xl font-medium transition
                  ${
                    plan.highlighted
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg"
                      : "bg-[color-mix(in_srgb,var(--card)_80%,transparent_20%)] border border-[var(--border)]"
                  }
                `}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
