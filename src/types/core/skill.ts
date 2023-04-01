type HardCategories =
  | 'lybrary'
  | 'framework'
  | 'tool'
  | 'language'
  | 'approach';
type SoftCategories = '';

type SKILL = {
  id: number;
  name: string;
  kind: 'hard' | 'soft';
  category: HardCategories | SoftCategories;
  isPrimary: boolean;
  proficiency: 'novice' | 'intermediate' | 'advanced' | 'expert';
  experience: number;
  lastUsage: number;
};

export default SKILL;
