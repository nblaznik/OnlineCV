export const NAV_ITEMS = [
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "awards", label: "Awards" },
  { id: "skills", label: "Skills" },
  { id: "publications", label: "Publications" },
  { id: "contact", label: "Contact" },
];

export const MOBILE_NAV_ITEMS = [
  { id: "lander", label: "Home" },
  ...NAV_ITEMS,
];

export const SECTION_IDS = ["lander", ...NAV_ITEMS.map(({ id }) => id)];
