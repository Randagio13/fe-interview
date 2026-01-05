export interface User {
  id: number;
  name: string;
  title: string;
  team: string;
  email: string;
  role: "admin" | "editor" | "viewer" | "guest" | "owner" | "inactive";
  details: string;
}

export type Role = User["role"];

export const roles: Role[] = ["admin", "editor", "viewer", "guest", "owner", "inactive"];

export const mockUsers: User[] = [
  {
    id: 1,
    name: "George Harris",
    title: "Software Engineer",
    team: "Security",
    email: "george.harris@example.com",
    role: "admin",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    name: "Arianna Russo",
    title: "Product Designer",
    team: "Website",
    email: "arianna.russo@example.com",
    role: "editor",
    details:
      "Experienced designer with a passion for creating intuitive user interfaces and engaging user experiences.",
  },
  {
    id: 3,
    name: "Marco Esposito",
    title: "Software Engineer",
    team: "Finance",
    email: "marco.esposito@example.com",
    role: "viewer",
    details: "Full-stack developer specializing in fintech solutions and backend infrastructure.",
  },
  {
    id: 4,
    name: "Sarah Williams",
    title: "Product Designer",
    team: "Security",
    email: "sarah.williams@example.com",
    role: "guest",
    details: "Product designer focused on security and accessibility features.",
  },
  {
    id: 5,
    name: "Emma Clark",
    title: "Product Manager",
    team: "Marketing",
    email: "emma.clark@example.com",
    role: "guest",
    details: "Strategic product manager leading marketing initiatives and go-to-market strategies.",
  },
  {
    id: 6,
    name: "Victor Barnes",
    title: "Product Manager",
    team: "Finance",
    email: "victor.barnes@example.com",
    role: "viewer",
    details: "Product manager with expertise in financial services and data analytics.",
  },
  {
    id: 7,
    name: "Serena Parisi",
    title: "Product Designer",
    team: "Marketing",
    email: "serena.parisi@example.com",
    role: "guest",
    details: "Creative designer specializing in brand identity and marketing collateral.",
  },
];
