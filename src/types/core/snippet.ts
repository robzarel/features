import type { RELATED } from '../common';

type Snippet = {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  code: string;
  language: string;
  related?: RELATED[];
};

export default Snippet;
