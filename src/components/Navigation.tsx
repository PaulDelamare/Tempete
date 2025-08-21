"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems } from "@/config/navigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 right-0 z-50 p-4">
      {/* Bouton hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 p-2 text-white hover:text-blue-400 transition-colors"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
              isOpen ? "-rotate-45 -translate-y-1" : ""
            }`}
          />
        </div>
      </button>

      {/* Menu overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu navigation */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black/90 border-l border-blue-400/30 backdrop-blur-md transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 pt-20">
          <div className="space-y-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block text-xl font-metal transition-colors duration-200 ${
                  pathname === item.href
                    ? "text-blue-400 border-b border-blue-400 pb-2"
                    : "text-white hover:text-blue-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
