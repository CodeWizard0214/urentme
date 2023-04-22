import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux';

import SearchListSection from './SearchListSection';
import MapSection from '../../components/map/MapSection';
import CollapseButton from '../../components/elements/CollapseButton';
import styles from './SearchScreen.module.css';

const SearchScreen = (props) => {
  const { search } = useLocation();
  const [searchKey, setSearchKey] = useState('');
  const [searchTag, setSearchTag] = useState(0);
  const [items, setItems] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const params = queryString.parse(search);
    if (params?.key) {
      setSearchKey(params.key);
    }
    if (params?.tag) {
      setSearchTag(params.tag);
    }
  }, [search]);

  const onSearchItems = (data) => {
    setItems(data);
  }

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  }

  return (
    <div className="container-fluid d-flex">
      <div className={`${collapsed?"w-0":""} ${styles.searchList}`}>
        <SearchListSection
          search={searchKey}
          tag={searchTag}
          onSearchItems={onSearchItems}
        />
      </div>
      <div className="d-flex flex-1-1 app-min-height position-relative">
        <div className={styles.mapContainer}>
          <MapSection
            initialCenter={{ lat: 39.8097, lng: -98.5556 }}
            zoom={5}
            items={items}
            itemImages={props.itemImages}
          />
        </div>
        <CollapseButton
          className={styles.collapse}
          collapsed={collapsed}
          onClick={toggleCollapse}
        />

      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    itemImages: state.allItemImages,
  };
};

export default connect(mapStateToProps)(SearchScreen);