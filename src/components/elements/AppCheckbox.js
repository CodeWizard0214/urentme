import React, { useState, useEffect } from 'react';

import Checkbox from 'react-custom-checkbox';
import { FiCheck } from 'react-icons/fi';

import styles from './AppCheckbox.module.css';
import * as Color from '../../constants/color';

const AppCheckbox = (props) => {
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(props.checked);
  }, [props.checked]);

  const handleChange = (value) => {
    setChecked(value);
    if (props.onChange) {
      props.onChange(value);
    }
  }

  const checkIcon = (
    <div style={{ marginLeft: props.size ? props.size * 0.6 : 8, marginBottom: props.size ? props.size * 0.4 : 8 }}>
      <FiCheck size={props.size ? props.size * 1.5 : 24} color={Color.PRIMARY_COLOR} />
    </div>
  );

  return (
    <Checkbox
      label={props.label}
      labelClassName={props.labelClassName}
      borderRadius={4}
      borderColor={Color.PRIMARY_COLOR}
      className={isChecked ? styles.checkbox : ""}
      icon={checkIcon}
      size={props.size ?? 16}
      checked={props.checked}
      onChange={handleChange}
      disabled={props.disabled}
    />
  );
};

export default AppCheckbox;