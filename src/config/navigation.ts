export interface NavItem {
  name: string;
  href: string;
}

export const mainNavItems: NavItem[] = [
  { name: "Accueil", href: "/" },
  { name: "Espaces", href: "/areas" },
  { name: "Événements", href: "/event" },
  { name: "Favoris", href: "/favorites" },
  { name: "Carte", href: "/map" },
];
