import { Snippet } from 'react-code-blocks';

type Snippet = {
  id: number;
  categoryId: number,
  code: string;
  language: string;
  name: string;
  description: string;
}

export default Snippet;
