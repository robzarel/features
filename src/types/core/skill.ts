type HardCategories = "lybrary" | "framework" | "tool";
type SoftCategories = "";

type SKILL = {
  kind: "hard" | "soft";
  category: HardCategories | SoftCategories;
  isPrimary: boolean;
  proficiency: "novice" | "intermediate" | "advanced" | "expert";
  experience: number;
  lastUsage: number;
};

export default SKILL;
