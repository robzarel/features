import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from '../components/layout';

import CV from './cv';
import Search from './search';
import NotFound from './not-found';

import Project from './project';
import Feature from './feature';
import Snippet from './snippet';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Search />} />
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
