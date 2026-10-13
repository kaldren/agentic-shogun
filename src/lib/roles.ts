import {
  CodeXmlIcon,
  GraduationCapIcon,
  MegaphoneIcon,
  PresentationIcon,
  RocketIcon,
  type LucideIcon,
} from "lucide-react";

// The roles a learner can pick. This is the only place they are defined;
// profiles.role stores the id.
export const ROLES = [
  {
    id: "marketing",
    name: "Marketing",
    description: "Campaigns, content and customer insights.",
    icon: MegaphoneIcon,
  },
  {
    id: "software-developers",
    name: "Software developers",
    description: "Build, test and ship software faster.",
    icon: CodeXmlIcon,
  },
  {
    id: "teachers",
    name: "Teachers",
    description: "Plan lessons and support your students.",
    icon: PresentationIcon,
  },
  {
    id: "entrepreneurs",
    name: "Entrepreneurs",
    description: "Start and grow a business with less effort.",
    icon: RocketIcon,
  },
  {
    id: "students",
    name: "Students",
    description: "Study smarter and get ready for the future.",
    icon: GraduationCapIcon,
  },
] as const satisfies readonly {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}[];

export type Role = (typeof ROLES)[number];
export type RoleId = Role["id"];

export function findRole(id: string | null | undefined): Role | null {
  return ROLES.find((role) => role.id === id) ?? null;
}
