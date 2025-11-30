// components/Footer.jsx
import { Facebook, Instagram, Twitter, Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative  pt-20 pb-10 bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      
      {/* Neon accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--primary)] opacity-60 shadow-[0_0_18px_var(--primary)]"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight">Proxima</h3>
            <p className="text-sm opacity-70 mt-4">
              Working closely together.  
              The modern task management platform built for teams who value clarity.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Product</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="#">Features</Link></li>
              <li><Link href="#">Dashboard</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Integrations</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-bold mb-4 text-lg">Resources</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="#">Help Center</Link></li>
              <li><Link href="#">Community</Link></li>
              <li><Link href="#">Guides</Link></li>
              <li><Link href="#">API Docs</Link></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-12 mb-8 h-px bg-[color-mix(in_srgb,var(--border)_90%,transparent_10%)]"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright */}
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} Proxima. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-5 opacity-80">
            <Link href="#" className="hover:text-[var(--primary)] transition"><Facebook size={18} /></Link>
            <Link href="#" className="hover:text-[var(--primary)] transition"><Instagram size={18} /></Link>
            <Link href="#" className="hover:text-[var(--primary)] transition"><Twitter size={18} /></Link>
            <Link href="#" className="hover:text-[var(--primary)] transition"><Github size={18} /></Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
