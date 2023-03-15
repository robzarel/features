import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout";
import Experience from "./experience";
import Code from "./code";
import NotFound from "./not-found";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/experience" element={<Experience />} />
        <Route path="/code" element={<Code />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
