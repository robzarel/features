type Text = {
  type: string;
  content: string;
};
type Code = Text & { language: string };

type Solution = {
  id: number;
  name: string;
  description: string;
  readme: (Text | Code)[];
  snippets: number[];
};

export default Solution;
