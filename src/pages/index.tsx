import { Routes, Route } from 'react-router-dom';

import Layout from '../components/layout';

import CV from './cv';
import Storage from './storage';
import NotFound from './not-found';

import Detailed from './detailed';

import useTheme from '../components/theme/useTheme';
import useLanguage from '../components/localization/useLanguage';

const App = () => {
  useTheme();
  useLanguage();

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
