import React, { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";

import { default as CategoriesType } from "../../types/core/categories";

import Styles from "./index.module.css";

const Categories = () => {
  const [categories, setCategories] = useState<CategoriesType>([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      const cats = await fetch("http://localhost:3001/api/categories");
      const parsed = await cats.json();
      setCategories(parsed);
    };

    fetchSnippets();
  }, []);

  return (
    <div className={Styles.wrapper}>
      {categories.map((item) => (
        <div key={item.id} className={Styles.category}>
          <p>
            <span>{`№${item.id}`}</span> {item.name}
          </p>
          <p>{item.description}</p>
          <NavLink to={`/category/${item.id}`}>Details...</NavLink>
        </div>
      ))}
    </div>
  );
};

export default Categories;
