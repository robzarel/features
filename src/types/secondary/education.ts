type Description = {
  degree: string;
  univercity: string;
  city: string;
  country: string;
};

type EDUCATION = {
  id: number;
  started: string;
  ended: string;
  description: {
    ru: Description;
    en: Description;
  };
};

export default EDUCATION;
