import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const AppLazyImage = (props) => {
  const onErrorImage = (e) => {
    e.target.src = props.placeholder;
  }

  return (
    <LazyLoadImage
      key={props.key}
      src={props.src}
      alt={props.alt ?? ""}
      className={props.className}
      wrapperClassName={props.wrapperClassName}
      placeholderSrc={props.placeholder}
      width={props.width}
      height={props.height}
      onClick={props.onClick}
      onError={onErrorImage}
    />
  );
}

export default AppLazyImage;