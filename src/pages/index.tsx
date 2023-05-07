import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setTheme } from '../redux/slices/theme';
import Layout from '../components/layout';

import CV from './cv';
import Storage from './storage';
import NotFound from './not-found';

import Project from './project';
import Feature from './feature';
import Snippet from './snippet';

import { getTheme, saveTheme } from '../utils/theme';

const App = () => {
  const theme = useAppSelector((state) => state.theme.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      const value = getTheme();

      saveTheme(value);
      dispatch(setTheme({ value }));
    }
  }, [theme]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Storage />} />
        <Route path='/cv' element={<CV />} />
        <Route path='/project/:id' element={<Project />} />
        <Route path='/feature/:id' element={<Feature />} />
        <Route path='/snippet/:id' element={<Snippet />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
