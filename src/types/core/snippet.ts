import type { RELATED } from '../common';

type Snippet = {
  id: number;
  name: string;
  description: string;
  code: string;
  language: string;
  related?: RELATED[];
};

export default Snippet;
