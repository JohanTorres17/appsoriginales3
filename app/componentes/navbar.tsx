"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type LinkItem = {
  href: string;
  label: string;
};

export default function NavBar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const links: LinkItem[] = [
    { href: "/primeraoriginal", label: "Esquivar Asteroide" },
    { href: "/segundaoriginal", label: "¿Qué carta sigue?" },
    { href: "/terceraoriginal", label: "Simon Dice" },
  ];

  function close() {
    setOpen(false);
  }

  return (
    <nav className="relative bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-3 sm:p-4 flex items-center justify-between gap-4 shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="ml-2 font-bold text-lg">Juegos</div>
      </div>

      {/* Desktop / wide screens: horizontal links */}
      <div className="hidden sm:flex nav-links">
        {links.map((link) => {
          const active = path === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className={`btn-ghost px-3 py-2 text-base sm:text-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                active ? "bg-white/10 ring-1 ring-white/20" : ""
              }`}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Mobile hamburger toggle */}
      <div className="sm:hidden">
        <button
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md btn-ghost"
        >
          {open ? (
            <span style={{ fontSize: 18, fontWeight: 800 }}>✕</span>
          ) : (
            <span style={{ fontSize: 18, fontWeight: 800 }}>☰</span>
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="sm:hidden absolute left-0 right-0 top-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-3 shadow-lg z-40">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const active = path === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className={`btn-ghost w-full text-left px-3 py-2 transition-colors ${
                    active ? "bg-white/10" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}