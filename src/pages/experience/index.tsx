import React, { useState, useEffect } from 'react';

import api from '../../api';

import WorkExperience from '../../components/experience';
import Skills from '../../components/skills';
import Education from '../../components/education';

import EXPERIENCE from '../../types/entities/experience';
import SKILL from '../../types/core/skill';
import EDUCATION from '../../types/core/education';

import Styles from './index.module.css';

const Experience = () => {
  const [experience, setExperience] = useState<EXPERIENCE[]>([]);
  const [skills, setSkills] = useState<SKILL[]>([]);
  const [education, setEducation] = useState<EDUCATION[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // todo: make all request parallel
      const fetchedExp = await api.get.experience();
      const fetchedSkills = await api.get.skills();
      const fetchedEducation = await api.get.education();

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
        <h2 className={Styles.title}>Work Experience</h2>
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
