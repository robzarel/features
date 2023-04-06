type HardCategories =
  | 'lybrary'
  | 'framework'
  | 'tool'
  | 'language'
  | 'approach';
type SoftCategories = 'methodology';

type SKILL = {
  id: number;
  name: string;
  kind: 'hard' | 'soft';
  category: HardCategories | SoftCategories;
  proficiency: 'novice' | 'intermediate' | 'advanced' | 'expert';
  experience: number;
  isPrimary: boolean;
  lastUsage: number;
};

export default SKILL;
