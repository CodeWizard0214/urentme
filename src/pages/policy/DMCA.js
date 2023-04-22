import React, { useEffect, useState } from 'react';
import AppSpinner from '../../components/loading/AppSpinner';
import * as APIHandler from '../../apis/APIHandler';
import * as Color from '../../constants/color';
import { parseContent } from '../../utils/stringUtils';
import CircleMark from '../../components/marks/CircleMark';
import styles from './DMCA.module.css';

const DMCA = () => {
  const [dataList, setDataList] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    APIHandler.getDmcaContent().then(data => {
      if (data.length > 0) {
        const list = data.sort((a, b) => (+a.list_order) - (+b.list_order));
        setDataList(list);
      }
    });
  }, []);

  const onSelectIndex = (idx) => {
    setIndex(idx);
  }

  const renderItem = (idx, content) => {
    const data = parseContent(content);
    return (
      <div
        key={`title-${idx}`}
        className={`d-flex align-items-center white hand py-2 ${styles.item} ${idx !== index && styles.unselect}`}
        onClick={() => onSelectIndex(idx)}
      >
        {data.num &&
        <CircleMark
          bgColor={Color.WHITE_COLOR}
          className={`white me-3 ${styles.item}`}
          width="1.875rem"
          height="1.875rem"
        >
          <span className="fw-400 fs-1p125 color-primary">{data.num}</span>
        </CircleMark>
        }
        <span className="fw-600 fs-1p125">{data.text}</span>
      </div>
    );
  }

  return (
    <div className="container">
      { dataList.length > 0 ?
      <div className="row">
        <div className={`col-6 col-sm-5 col-md-4 col-lg-3 app-content-height list-scrollbar ${styles.sidebar}`}>
          { dataList.map((item, idx) => 
            renderItem(idx, item.name)
          )}
        </div>
        <div className={`col-6 col-sm-7 col-md-8 col-lg-9 p-4 app-content-height list-scrollbar ${styles.content}`}>
          <div dangerouslySetInnerHTML={{__html: dataList[index].contents}} />
        </div>
      </div>
      :
      <AppSpinner absolute />
      }
    </div>
  );
};

export default DMCA;