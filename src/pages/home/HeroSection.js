import React, { createRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FaPlay } from "react-icons/fa";
import VideoPlayer from '../../components/player/VideoPlayer';
import styles from './HeroSection.module.css';

export const HeroSection = (props) => {
  const [isOpen, setOpen] = useState(false);
  let pageHeader = createRef();

  useEffect(() => {
    /*if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }*/
  }, [pageHeader]);

  const toggleModal = () => {
    setOpen(!isOpen);
  }

  return (
    <>
    <header id="header-hero" className={styles.pageHeader}>
      <div
        className={styles.pageHeaderImage}
        style={{
          backgroundImage:
            "url(" + require("../../assets/images/home/hero-placeholder.jpg").default + ")",
        }}
        ref={pageHeader}
      />
      <div className={styles.contentCenter}>
        <div className="container-fluid">
          <h1 className={styles.title}>
            {props.title ? props.title : "Loading"}
          </h1>
          <div className="text-center mt-5">
            <Link to="/tips">
              <button type="button" className={`btn btn-app-primary px-4 py-2 styles.learnButton`}>
                Learn what's new
              </button>
            </Link>
          </div>
          <div className="d-flex justify-content-center mt-5">
            <div className={styles.playVideo} onClick={toggleModal}>
              <FaPlay className={styles.playIcon}/>
            </div>
          </div>
        </div>
      </div>
    </header>
    <VideoPlayer
      open={isOpen}
      toggleModal={toggleModal}
      url={"https://drive.google.com/uc?export=download&id=1y7x7iHDnZZ_nB12iD6bcfpkFBHpxt-va"}
    />
    </>
  );
};
