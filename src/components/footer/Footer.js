import React from 'react';
import { Link } from 'react-router-dom';
import { IoLocationOutline, IoMailOutline, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';
import { FiFacebook } from 'react-icons/fi';
import { AiOutlineSkype } from 'react-icons/ai';

import CircleMark from '../marks/CircleMark';
import * as Color from '../../constants/color';

const Footer = () => {
  return (
    <div className="py-4">
      <div className="container">
        <div className="d-md-flex justify-content-between">
          <div className="text-center text-md-start">
            <div className="fw-600 fs-1p0 cod-gray mb-3">Address</div>
            <div className="d-flex gap-2 align-content-center justify-content-center justify-content-md-start">
              <IoMailOutline className="fs-1p5 jelly-bean" />
              <span className="fw-400 fs-1p125 dark-gray">Support@URentMe.com</span>
            </div>
            <div className="d-flex gap-2 mt-2 align-content-center justify-content-center justify-content-md-start">
              <IoLocationOutline className="fs-1p5 jelly-bean" />
              <span className="fw-400 fs-1p125 dark-gray">Las Vegas Nevada</span>
            </div>
          </div>
          <div className="mt-4 text-center d-md-flex gap-md-1 gap-lg-5 mt-md-0 text-md-start">
            <div className="d-flex flex-column gap-1">
              <div className="fw-600 fs-1p0 cod-gray mb-3">Info</div>
              <Link to="/terms" className="fw-400 fs-1p125 dark-gray decoration-none">Terms &amp; Conditions</Link>
              <Link to="/dmca" className="fw-400 fs-1p125 dark-gray decoration-none">DMCA</Link>
              <Link to="/policy/privacy" className="fw-400 fs-1p125 dark-gray decoration-none">Privacy Policy</Link>
            </div>
            <div className="d-flex flex-column gap-1 mt-4 mt-md-0">
              <div className="fw-600 fs-1p0 cod-gray mb-3">Help</div>
              <Link to="/pages/contact" className="fw-400 fs-1p125 dark-gray decoration-none">Contact Us</Link>
              <Link to="/aboutus" className="fw-400 fs-1p125 dark-gray decoration-none">About Us</Link>
            </div>
          </div>
          <div className="mt-4 text-center mt-md-0 text-md-start">
            <div className="d-flex flex-row justify-content-center gap-4 justify-content-md-start gap-md-2 gap-lg-3">
              <CircleMark bgColor={Color.PRIMARY_COLOR}><IoLogoInstagram className="fs-1p125 white" /></CircleMark>
              <a href="https://www.facebook.com/URentMe">
                <CircleMark bgColor={Color.PRIMARY_COLOR}>
                  <FiFacebook className="fs-1p125 white" />
                </CircleMark>
              </a>
              <CircleMark bgColor={Color.PRIMARY_COLOR}><AiOutlineSkype className="fs-1p125 white" /></CircleMark>
              <a href="https://twitter.com/URentMeLLC">
                <CircleMark bgColor={Color.PRIMARY_COLOR}>
                  <IoLogoTwitter className="fs-1p125 white" />
                </CircleMark>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;