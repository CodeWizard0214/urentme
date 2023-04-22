import React from 'react';

import AppLazyImage from '../../components/elements/AppLazyImage';
import styles from './NewsSection.module.css';
import cbsIcon from '../../assets/images/news/cbs.svg';
import foxNewsIcon from '../../assets/images/news/foxNews.svg';
import nbcIcon from '../../assets/images/news/nbc.svg';
import usaTodayIcon from '../../assets/images/news/usaToday.svg';

const NEWS = [
  {
    name: 'CBS',
    icon: cbsIcon,
  },
  {
    name: 'FOX NEWS',
    icon: foxNewsIcon,
  },
  {
    name: 'NBC',
    icon: nbcIcon,
  },
  {
    name: 'USA TODAY',
    icon: usaTodayIcon,
  },
];

export const NewsSection = () => {
  return (
    <div className={styles.container}>
      <div className="container">
        <div className="mb-4 mb-md-5">
          <h3 className={styles.title}>As Seen On</h3>
        </div>
        <div className="row">
          { NEWS.map((item, idx) => (
            <div key={`news-${idx}`} className="text-center mb-3 col-sm-6 col-lg-3 mb-lg-0">
              <AppLazyImage
                src={item.icon}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};