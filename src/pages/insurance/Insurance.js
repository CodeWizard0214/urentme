import React, { useState, useEffect } from 'react';

import { ServiceSection } from './ServiceSection';
import { InfoSection1 } from './InfoSection1';
import { InfoSection2 } from './InfoSection2';
import AppSpinner from '../../components/loading/AppSpinner';
import * as APIHandler from '../../apis/APIHandler';
import styles from './Insurance.module.css';

const Insurance = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.getInsuranceContent().then(data => {
      if (isMounted && data.length > 0) {
        setContent(data[0].contents);
      }
      setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="container">
      {loading ? (
        <AppSpinner absolute />
      ): content ? (
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <>
          <div className="row justify-content-center my-4 my-lg-5">
            <div className="col-md-10 col-lg-8 col-xl-6 text-center fw-700 fs-1p5 gray-36">
              You may have Questions concerning Insurance and we are here to put your Mind at Ease!
            </div>
          </div>
          <ServiceSection />
          <InfoSection1 />
          <InfoSection2 />
          <div className="row justify-content-center my-5">
            <div className="col-lg-8 text-center fw-500 fs-1p625 gray-36">
              Host per day will include insurance and any additional services are included in the advertised rental price.
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Insurance;
