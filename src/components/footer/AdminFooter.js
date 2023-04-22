import React from 'react';
import styles from './AdminFooter.module.css';

const AdminFooter = () => {
  return (
    <div className={styles.footer}>
      <div className="fw-400 fs-1p0 cod-gray me-4">
        © URentMe Corporation. All rights reserved.
      </div>
    </div>
  );
};

export default AdminFooter;
