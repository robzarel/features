import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout";
import Features from "./features";
import Categories from "./categories";
import Category from "./category";
import Snippets from "./snippets";
import Projects from "./projects";
import NotFound from "./not-found";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Features />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/snippets" element={<Snippets />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
