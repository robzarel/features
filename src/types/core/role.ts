const abbreviation = {
  Frontend: 'FE',
  Backend: 'BE',
  'Quality assurance': 'QA',
  Analyst: 'AN',
  'Project Manager': 'PM',
  'Delivery Manager': 'DM',
  'Team Lead': 'TL',
};

type titles = {
  prod: {
    body: 'Frontend' | 'Backend' | 'Quality assurance' | 'Analyst';
    head: 'Project Manager' | 'Delivery Manager' | 'Team Lead';
  };
  nonprod: {
    head: 'Resource Manager' | 'Resource Director';
  };
};

type ROLE = {
  kind: 'body' | 'head';
  stream: 'prod' | 'nonprod';
  title:
    | titles['prod']['body']
    | titles['prod']['head']
    | titles['nonprod']['head'];
};

export default ROLE;
