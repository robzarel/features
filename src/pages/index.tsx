import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useAppSelector, useAppDispatch } from '../redux/hooks';

import { setFeatureFlags } from '../redux/slices/root';

import CV from './cv';
import Storage from './storage';
import NotFound from './not-found';
import Layout from '../components/layout';

import Detailed from './detailed';
import api from '../api';

const App = () => {
  const dispatch = useAppDispatch();
  const { featureFlags, theme } = useAppSelector((state) => state.root);

  const { data } = useQuery({
    queryKey: ['featureFlags'],
    queryFn: api.get.featureFlags,
    enabled: featureFlags === undefined,
  });

  useEffect(() => {
    data && dispatch(setFeatureFlags({ value: data }));
  }, [data]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Storage />} />
        <Route path='/cv' element={<CV />} />
        <Route path='/project/:id' element={<Detailed type='project' />} />
        <Route path='/feature/:id' element={<Detailed type='feature' />} />
        <Route path='/snippet/:id' element={<Detailed type='snippet' />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
