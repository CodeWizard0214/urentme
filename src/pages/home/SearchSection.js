import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import { IoSearchOutline } from 'react-icons/io5';
import styles from './SearchSection.module.css';

import * as APIHandler from '../../apis/APIHandler';

export const SearchSection = () => {
  const [searchKey, setSearchKey] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchTag, setSearchTag] = useState('');

  useEffect(() => {
    let isMounted = true;
    APIHandler.getCategoryPrice().then(data => {
      if (isMounted && data.length > 0) {
        setCategories(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className={styles.searchContainer}>
      <div className="container">
        <div className={styles.searchGroup}>
          <div className="row">
            <div className={`col-12 col-md-5 mb-3 mb-md-0 ${styles.inputGroup}`}>
              <label htmlFor="search-location" className={`form-label ${styles.label}`}>Location</label>
              <input
                type="text"
                id="search-location"
                className={`form-control ${styles.location}`}
                placeholder="Where you want to rent?"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </div>
            <div className={`col-12 col-md-5 mb-3 mb-md-0 ${styles.inputGroup}`}>
              <label htmlFor="search-category" className={`form-label ${styles.label}`}>Category</label>
              <select
                className={`form-select ${styles.category}`}
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                id="search-category">
                <option value="">All</option>
                {categories.map((item) => (
                  <option key={`category-${item.id}`} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-2 d-flex align-items-center justify-content-end">
              <Link to={`/search?key=${searchKey}&tag=${searchTag}`}>
                <button type="button" className={`btn btn-app-primary py-2 ${styles.searchButton}`}>
                  <IoSearchOutline className="fs-1p5 white" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};