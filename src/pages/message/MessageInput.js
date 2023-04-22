import React from 'react';
import { IoIosSend } from 'react-icons/io';
import styles from './MessageInput.module.css';

const MessageInput = (props) => {
  return (
    <div className={`d-flex align-items-center justify-content-between ${props.className}`}>
      <input
        type="text"
        className={styles.input}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
      />

      <div
        className={`d-flex align-items-center justify-content-center hand ${styles.send}`}
        onClick={props.onSend}
      >
        <IoIosSend className="fs-1p5 white" />
      </div>
    </div>
  );
};

export default MessageInput;