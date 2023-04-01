import React, { useState, useEffect } from 'react';

import Styles from './index.module.css';

import WorkExperience from '../../components/experience';
import Skills from '../../components/skills';
import Education from '../../components/education';

import EXPERIENCE from '../../types/entities/experience';
import SKILL from '../../types/core/skill';
import EDUCATION from '../../types/core/education';

const Experience = () => {
  const [experience, setExperience] = useState<EXPERIENCE[]>([]);
  const [skills, setSkills] = useState<SKILL[]>([]);
  const [education, setEducation] = useState<EDUCATION[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // todo: make all request parallel
      const fetchedExp = await fetch(
        'https://raw.githubusercontent.com/robzarel/features/main/src/server/db/experience.json'
      );
      const fetchedSkills = await fetch(
        'https://raw.githubusercontent.com/robzarel/features/main/src/server/db/skills.json'
      );
      const fetchedEducation = await fetch(
        'https://raw.githubusercontent.com/robzarel/features/main/src/server/db/education.json'
      );

      const parsedExp: EXPERIENCE[] = await fetchedExp.json();
      const parsedSkills: SKILL[] = await fetchedSkills.json();
      const parsedEducation: EDUCATION[] = await fetchedEducation.json();

      setExperience(parsedExp);
      setSkills(parsedSkills);
      setEducation(parsedEducation);
    };

    fetchData();
  }, []);

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.leftColumn}>
        <h2 className={Styles.title}>Work Experience !!!!5</h2>
        {experience.map((item) => (
          <WorkExperience key={item.id} {...item} />
        ))}
      </div>
      <div className={Styles.rightColumn}>
        <div className={Styles.skills}>
          <h2 className={Styles.title}>Skills</h2>
          <Skills data={skills} />
        </div>
        <div className={Styles.education}>
          <h2 className={Styles.title}>Education</h2>
          <Education data={education} />
        </div>
      </div>
    </div>
  );
};

export default Experience;
