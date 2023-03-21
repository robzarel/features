import { Snippet } from "react-code-blocks";

type Snippet = {
  id: number;
  category: {
    id: number;
    name: string;
  };
  code: string;
  language: string;
  name: string;
  description: string;
};

export default Snippet;
