import React, { useEffect, useState } from 'react';

import * as APIHandler from '../../apis/APIHandler';
import AppLazyImage from '../../components/elements/AppLazyImage';
import AppSpinner from '../../components/loading/AppSpinner';
import { getTipImage } from '../../utils/imageUrl';
import styles from './TipsScreen.module.css';

const TripsScreen = () => {
  const [tips, setTips] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    APIHandler.getTipsContent().then(data => {
      if (isMounted && data.length > 0) {
        const list = data.sort((a, b) => (+a.list_order) - (+b.list_order));
        setTips(list);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const onSelectIndex = (idx) => {
    setIndex(idx);
  }

  const renderItem = (idx, tip) => {
    return (
      <div
        key={`title-${idx}`}
        className={`d-flex align-items-center white hand py-2 ${styles.item} ${idx !== index && styles.unselect}`}
        onClick={() => onSelectIndex(idx)}
      >
        <AppLazyImage
          src={getTipImage(tip.id)}
          alt={tip.name}
          width={48}
          height={48}
        />
        <span className="ms-3">{tip.name}</span>
      </div>
    );
  }

  return (
    <div className="container">
      {tips.length > 0 ? (
        <div className="row">
          <div className={`col-6 col-sm-5 col-md-4 col-lg-3 app-content-height list-scrollbar ${styles.sidebar}`}>
            {tips.map((tip, idx) =>
              renderItem(idx, tip)
            )}
          </div>
          <div className={`col-6 col-sm-7 col-md-8 col-lg-9 p-4 app-content-height list-scrollbar ${styles.content}`}>
            <div dangerouslySetInnerHTML={{ __html: tips[index].contents }} />
          </div>
        </div>
      ) : (
        <AppSpinner absolute />
      )}
    </div>
  );
};

export default TripsScreen;