"use client";

import { useState, useEffect } from "react";
import { StaggeredMenu } from "./StaggeredMenu";
<<<<<<< HEAD

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
=======
import { useLiveSnapshot } from "@/lib/live-data";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const snapshot = useLiveSnapshot();

  const updated = snapshot?.generatedAt ? new Date(snapshot.generatedAt) : null;
  const updatedLabel =
    updated && !Number.isNaN(updated.getTime())
      ? updated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : null;
>>>>>>> origin/teju

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/" },
    { label: "Batting", ariaLabel: "View batting stats", link: "/batting" },
    { label: "Bowling", ariaLabel: "View bowling stats", link: "/bowling" },
    { label: "Keepers", ariaLabel: "View wicketkeeper stats", link: "/keepers" },
    { label: "Daily", ariaLabel: "View daily report", link: "/daily" },
    { label: "Players", ariaLabel: "View players", link: "/players" },
<<<<<<< HEAD
    { label: "Teams", ariaLabel: "View teams", link: "/teams" },
  ];

  return (
    <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={[]}
      displaySocials={false}
      displayItemNumbering={true}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#fff"
      changeMenuColorOnOpen={true}
      colors={['#050505', '#111111']}
      accentColor="#D4FF00"
      isFixed={true}
      closeOnClickAway={true}
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
    />
=======
  ];

  return (
    <>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={[]}
        displaySocials={false}
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#050505', '#111111']}
        accentColor="#D4FF00"
        isFixed={true}
        closeOnClickAway={true}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
      />
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-zinc-800 bg-black/60 px-3 py-1.5 font-mono text-[11px] text-zinc-400 backdrop-blur-sm">
        <span className={`h-2 w-2 rounded-full ${snapshot ? "bg-[#D4FF00]" : "bg-zinc-600"}`} />
        <span>{snapshot ? "LIVE" : "SYNC"}</span>
        {updatedLabel ? <span className="text-zinc-500">{updatedLabel}</span> : null}
      </div>
    </>
>>>>>>> origin/teju
  );
}
