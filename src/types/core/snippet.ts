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
};

export default Snippet;
