"use client";

import { useState, useEffect } from "react";
import { StaggeredMenu } from "./StaggeredMenu";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
  );
}
