import React, {useState, useEffect} from 'react';

import styles from './RegisterSection.module.css';

import * as APIHandler from '../../apis/APIHandler';

export const RegisterSection = () => {
  const [categories, setCategories] = useState([]);
  const [earnings, setEarnings] = useState('');

  useEffect(() => {
    let isMounted = true;
    APIHandler.getCategoryPrice().then(data => {
      if (isMounted && data.length > 0) {
        setCategories(data);
        setEarnings(`${data[0].min_earning} - ${data[0].max_earning}`);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const onSelectCategory = (e) => {
    setEarnings(e.target.value);
  }

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className={styles.placeholder} />
      <div className="container">
        <div className="text-center">
          <h3 className="fw-600 fs-2p0 white">How Much Can I Make Renting My Assets?</h3>
          <div className="fw-400 fs-1p25 white mt-4 mb-2">Type of Asset You Own</div>
          <div className={`d-flex mx-auto ${styles.selectGroup}`}>
            <select
              id="category"
              required
              onChange={onSelectCategory}
              className="form-select fw-400 fs-0p875 oxford-blue app-form-control"
            >
              {categories.map((item) => (
                <option key={`category-${item.id}`} value={`${item.min_earning} - ${item.max_earning}`}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="fw-400 fs-1p0 white mt-4 mb-1">Your Annual Earnings</div>
          <span className={styles.pricebox}>{earnings}</span>
          <div className={`fw-400 fs-1p0 white mx-auto mt-3 ${styles.description}`}>*Disclaimer : These are averages and it will depend on the days rented out per month and the make, model, seasonality, geographical location, various economic factors, and rental price.</div>
        </div>
      </div>
    </div>
  );
};