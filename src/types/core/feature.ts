import type { RELATED } from '../common';

type FEATURE = {
  id: number;
  name: string;
  description: string;
  readme: {
    type: 'heading' | 'text' | 'code';
    content: string;
    language?: string;
  }[];
  related?: RELATED[];
};

export default FEATURE;
