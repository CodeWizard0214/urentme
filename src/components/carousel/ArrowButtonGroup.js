import React from 'react';

import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

import styles from './ArrowButtonGroup.module.css';

export const ArrowButtonGroup = ({ infinite, next, previous, goToSlide, ...rest }) => {
  const { carouselState: { currentSlide, totalItems, slidesToShow }, type } = rest;

  const isFirstSlide = () => {
    return currentSlide === 0;
  }

  const isLastSlide = () => {
    return currentSlide === totalItems - slidesToShow;
  }

  const handlePrevious = () => {
    (infinite && isFirstSlide()) ? goToSlide(totalItems - 1) : previous();
  }

  const handleNext = () => {
    (infinite && isLastSlide()) ? goToSlide(0) : next();
  }

  return (
    <>
      <div
        onClick={handlePrevious}
        className={`${(infinite || !isFirstSlide()) ? "d-flex" : "d-none"} ${styles.arrowButton} ${styles.leftButton} ${type === 'secondary' ? styles.secondaryButton : styles.primaryButton}`}
      >
        <FaChevronLeft className={`${styles.arrowIcon} ${type === 'secondary' ? styles.secondaryIcon : styles.primaryIcon}`}/>
      </div>
      <div
        onClick={handleNext}
        className={`${(infinite || !isLastSlide()) ? "d-flex" : "d-none"} ${styles.arrowButton} ${styles.rightButton} ${type === 'secondary' ? styles.secondaryButton : styles.primaryButton}`}
      >
        <FaChevronRight className={`${styles.arrowIcon} ${type === 'secondary' ? styles.secondaryIcon : styles.primaryIcon}`}/>
      </div>
    </>
  );
};