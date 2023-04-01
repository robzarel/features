import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from '../components/layout';

import Home from './home';
import Experience from './experience';
import Search from './search';
import Contacts from './contacts';
import NotFound from './not-found';

import Feature from './feature';
import Project from './project';
import Solution from './solution';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/experience' element={<Experience />} />
        <Route path='/search' element={<Search />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/project/:id' element={<Project />} />
        <Route path='/feature/:id' element={<Feature />} />
        <Route path='/solution/:id' element={<Solution />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
