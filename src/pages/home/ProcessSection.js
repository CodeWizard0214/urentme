import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { toast } from 'react-toastify';
import { FaArrowRight } from "react-icons/fa";

import ProcessCard from '../../components/elements/ProcessCard';
import styles from './ProcessSection.module.css';
import searchIcon from '../../assets/images/mark/search.svg';
import bookIcon from '../../assets/images/mark/bookIcon.svg';
import roadIcon from '../../assets/images/mark/roadIcon.svg';

const PROCESSES = [
  {
    title: 'Choose Your Fun',
    text: 'Over Thousands of Off Road Choices',
    icon: searchIcon,
  },
  {
    title: 'Book Your Trip',
    text: 'Flexible pricing, message the owner, secure your rental',
    icon: bookIcon,
  },
  {
    title: 'Enjoy Your Adventure',
    text: 'Your Protected, optional 24/7 roadside assistance, Insured!',
    icon: roadIcon,
  },
];

const ProcessSection = (props) => {
  const navigate = useNavigate();
  const { userId } = props;

  const goBooking = () => {
    userId ? navigate('/bookings') : toast.error('Please log in');
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className="mb-4">
          <h3 className={styles.title}>Our Process</h3>
        </div>
        <div className="row">
          { PROCESSES.map((process, idx) => (
            <div key={`process-${idx}`} className={`mb-4 col-md-4 ${styles.card}`}>
              <ProcessCard
                title={process.title}
                text={process.text}
                icon={process.icon}
              />
            </div>
          ))}
        </div>
        <div className="text-center">
          <button type="button" className="btn btn-app-primary px-4 py-2" onClick={goBooking}>
            Book Now <FaArrowRight/>
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {userId: state.userId}
}

export default connect(mapStateToProps)(ProcessSection);
