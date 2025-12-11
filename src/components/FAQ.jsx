"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section className="py-8 relative bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      
      {/* glowing neon top highlight */}
      {/* <div className="absolute top-0 left-0 w-full h-[2px]  opacity-60 shadow-[0_0_18px_#4BE2F2]"></div> */}

      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Frequently Asked Questions
        </h2>

        <p className="text-sm opacity-70 mt-3 mb-12 max-w-xl mx-auto">
          Everything you need to know about using Proxima with your team.
        </p>

        <Accordion
          type="single"
          collapsible
          className="space-y-4 text-left"
        >
          <AccordionItem
            value="item-1"
            className="border border-[color-mix(in_srgb,var(--border)_70%,transparent_30%)] rounded-xl 
            bg-[color-mix(in_srgb,var(--card)_88%,transparent_12%)] backdrop-blur-md px-4"
          >
            <AccordionTrigger className="font-semibold">
              What is Proxima?
            </AccordionTrigger>
            <AccordionContent className="text-sm opacity-80 pb-4">
              Proxima is a modern collaborative task management platform
              designed to help teams stay aligned, productive, and organized
              with clarity.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="border border-[color-mix(in_srgb,var(--border)_70%,transparent_30%)] rounded-xl 
            bg-[color-mix(in_srgb,var(--card)_88%,transparent_12%)] backdrop-blur-md px-4"
          >
            <AccordionTrigger className="font-semibold">
              Does Proxima support real-time updates?
            </AccordionTrigger>
            <AccordionContent className="text-sm opacity-80 pb-4">
              Yes! Every task, comment, change, and update syncs instantly so
              your entire team stays in perfect alignment.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="border border-[color-mix(in_srgb,var(--border)_70%,transparent_30%)] rounded-xl 
            bg-[color-mix(in_srgb,var(--card)_88%,transparent_12%)] backdrop-blur-md px-4"
          >
            <AccordionTrigger className="font-semibold">
              Can I use Proxima for free?
            </AccordionTrigger>
            <AccordionContent className="text-sm opacity-80 pb-4">
              Yes, Proxima offers a generous free tier ideal for personal use
              and small teams. Larger teams can upgrade anytime.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="border border-[color-mix(in_srgb,var(--border)_70%,transparent_30%)] rounded-xl 
            bg-[color-mix(in_srgb,var(--card)_88%,transparent_12%)] backdrop-blur-md px-4"
          >
            <AccordionTrigger className="font-semibold">
              Do you offer team collaboration features?
            </AccordionTrigger>
            <AccordionContent className="text-sm opacity-80 pb-4">
              Absolutely. Proxima was built for teams — with real-time
              collaboration, role-based access, notifications, and shared
              workspaces.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </section>
  );
}
