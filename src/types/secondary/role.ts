type titles = {
  prod: {
    body:
      | 'Frontend'
      | 'Backend'
      | 'Quality assurance'
      | 'Analyst'
      | 'Designer'
      | 'Android'
      | 'IOS';
    head:
      | 'Scrum master'
      | 'Product Owner'
      | 'Project Manager'
      | 'Delivery Manager'
      | 'Architect'
      | 'Team Lead';
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
  grade: 'junior' | 'middle' | 'senior';
};

export default ROLE;
