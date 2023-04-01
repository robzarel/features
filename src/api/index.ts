const get = (endpoint: string) => {
  const path =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3001/api/${endpoint}`
      : `https://raw.githubusercontent.com/robzarel/features/main/src/server/db/${endpoint}.json`;

  return () => fetch(path);
};
const api = {
  get: {
    experience: get('experience'),
    skills: get('skills'),
    education: get('education'),
  },
};

export default api;
