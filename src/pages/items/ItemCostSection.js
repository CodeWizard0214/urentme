import React, { useEffect, useState } from 'react';

export const ItemCostSection = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData([
      {
        title: 'Daily',
        text: props.costDaily?.toFixed(2),
      },
      {
        title: 'Weekly',
        text: props.costWeekly?.toFixed(2),
      },
      {
        title: 'Weekends and Holidays',
        text: props.costWeekend?.toFixed(2),
      },
      {
        title: 'Cleaning Fee',
        text: props.cleaningFee?.toFixed(2),
      }
    ]);
  }, [props])
  return (
    <div className={props.className}>
      { data.map((item, idx) => (
        <div key={`costitem-${idx}`} className="row mb-3">
          <div className="col-6">
            <span className="fw-600 fs-1p125 black">{item.title}</span>
          </div>
          <div className="col-6">
            <span className="fw-400 fs-1p0 gray-36">${item.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
};