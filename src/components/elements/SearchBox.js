import React from 'react';
import { BsSearch } from "react-icons/bs";
import styles from './SearchBox.module.css';

const SearchBox = (props) => {
  return (
    <div className={`position-relative ${props.className}`}>
      <input
        type="text"
        className={styles.input}
        placeholder={props.placeholder ?? "Search"}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
      />
      <BsSearch className={styles.searchIcon} />
    </div>
  );
};

export default SearchBox;