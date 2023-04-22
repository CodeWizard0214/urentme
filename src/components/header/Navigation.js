import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavbarToggler,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from 'reactstrap';
import { FaRegUserCircle, FaQuestion } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { MdPayment } from "react-icons/md";
import { toast } from 'react-toastify';

import * as Constant from '../../constants/constant';
import * as Color from '../../constants/color';
import { setUserId } from '../../store/actions/userActions';
import styles from './Navigation.module.css';
import AppLazyImage from '../elements/AppLazyImage';
import logoImage from '../../assets/images/logo.png';
import CircleMark from '../marks/CircleMark';
import ConfirmModal from '../modal/ConfirmModal';
import LoginModal from '../../pages/auth/LoginModal';
import SignupModal from '../../pages/auth/SignupModal';
import ForgotModal from '../../pages/auth/ForgotModal';
import ResetModal from '../../pages/auth/ResetModal';
import NO_AVATAR from '../../assets/images/logo-small.png';
import { getUserAvatar } from '../../utils/imageUrl';

const Navigation = (props) => {
  const navigate = useNavigate();
  const { userId, userInfo, userMessages } = props;
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [reset, setReset] = useState(false);
  const [email, setEmail] = useState('');
  const [logout, setLogout] = useState(false);
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    const value = sessionStorage.getItem(Constant.MSG_COUNT);
    setMsgCount(userMessages.length - value);
  }, [userMessages]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }

  const handleLogin = () => {
    setLogin(true);
  }

  const handleSignup = () => {
    setSignup(true);
  }

  const handleLogout = () => {
    sessionStorage.removeItem(Constant.CURRENT_USER);
    localStorage.removeItem(Constant.GLOBAL_USER);
    props.setUserId('');
    setLogout(false);
    navigate('/');
  }

  const switchSignUp = () => {
    setLogin(false);
    setSignup(true);
  }

  const toggleForgot = () => {
    if (login) {
      setLogin(false);
      setForgot(true);
    } else {
      setLogin(true);
      setForgot(false);
    }
  }

  const backToForgot = () => {
    setForgot(true);
    setReset(false);
  }

  const onSentCode = (email) => {
    setForgot(false);
    setReset(true);
    setEmail(email);
  }

  const visitHost = () => {
    if (userId) {
      navigate('/host')
    } else {
      toast.error('Please login first');
    }
  }

  const customLogout = (
    <div className="d-flex flex-column align-items-center mt-4">
      <CircleMark
        width={72}
        height={72}
        bgColor={Color.PRIMARY_COLOR}
      >
        <FaQuestion className="fp-36 white" />
      </CircleMark>
      <div className="fw-400 fs-1p0 gray-36 text-center my-4">
        Are you sure you want to log out?
      </div>
    </div>
  );

  return (
    <Navbar color="light" expand="md" fixed="top" light className={styles.navbar}>
      <Link to="/">
        <img src={logoImage} alt="URentMe" className={styles.logo} />
      </Link>
      <NavbarToggler onClick={toggleCollapsed} />
      <Collapse isOpen={!collapsed} navbar className="flex-grow-0 bg-light">
        <Nav navbar className={styles.nav}>
          <NavItem className={`py-2 px-lg-3 ${pathname === '/' && styles.active}`} onClick={(!collapsed && toggleCollapsed) || null} >
            <Link to="/" className={styles.navlink}>
              Home
            </Link>
          </NavItem>
          <NavItem className={`p-2 px-lg-3 ${pathname === '/tips' && styles.active}`} onClick={(!collapsed && toggleCollapsed) || null} >
            <Link to="/tips" className={styles.navlink}>
              Tips
            </Link>
          </NavItem>
          <NavItem className={`p-2 px-lg-3 ${pathname === '/insurance' && styles.active}`} onClick={(!collapsed && toggleCollapsed) || null} >
            <Link to="/insurance" className={styles.navlink}>
              Insurance
            </Link>
          </NavItem>
          <NavItem className={`p-2 px-lg-3 ${pathname.startsWith('/search') && styles.active}`} onClick={(!collapsed && toggleCollapsed) || null} >
            <Link to="/search" className={styles.navlink}>
              For Rent
            </Link>
          </NavItem>
          <NavItem className={`p-2 px-lg-3 ${pathname === '/host' && styles.active}`} onClick={(!collapsed && toggleCollapsed) || null} >
            <div className={`hand ${styles.navlink}`} onClick={visitHost}>
              List
            </div>
          </NavItem>
          { userId ?
          <>
          <NavItem className={`d-flex align-items-center p-2 px-lg-3 ${pathname === '/messages' && styles.active}`} onClick={(!collapsed && toggleCollapsed) || null} >
            <Link to="/messages" className={styles.navlink}>
              <div className="d-flex algin-items-center position-relative">
                Messages
                { msgCount > 0 && pathname !== '/messages' &&
                <CircleMark
                  width={12}
                  height={12}
                  borderColor={Color.WHITE_COLOR}
                  borderWidth={1}
                  borderStyle="solid"
                  bgColor={Color.RADICAL_RED}
                  className={styles.badge}
                />
                }
            </div>
            </Link>
          </NavItem>
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle nav className='text-center'>
              {userInfo.img ? (
                <AppLazyImage
                  src={getUserAvatar(userInfo.img)}
                  alt=""
                  className={`avatar ${styles.account}`}
                  placeholder={NO_AVATAR}
                />
              ) : (
                <FaRegUserCircle className={styles.account} />
              )}
            </DropdownToggle>
            <DropdownMenu className={styles.dropdownMenu}>
              <Link to="/account" className="decoration-none">
                <DropdownItem className={styles.menuitem} onClick={(!collapsed && toggleCollapsed) || null} >
                  <HiOutlineUserCircle className="fs-1p375 gray-36" />
                  <span className="fw-400 fs-1p0 black-olive ms-2">Account Profile</span>
                </DropdownItem>
              </Link>
              <Link to="/payment" className="decoration-none">
                <DropdownItem className={styles.menuitem} onClick={(!collapsed && toggleCollapsed) || null} >
                  <MdPayment className="fs-1p375 gray-36" />
                  <span className="fw-400 fs-1p0 black-olive ms-2">Payment Method</span>
                </DropdownItem>
              </Link>
              <DropdownItem divider />
              <DropdownItem className={styles.menuitem} onClick={() => setLogout(true)}>
                <FiLogOut className="fs-1p375 gray-36" />
                <span className="fw-400 fs-1p0 black-olive ms-2">Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          </>
          :
          <>
          <NavItem onClick={handleLogin}>
            <button type="button" className="btn btn-app-primary fw-600 fs-0p875 px-3 mx-2 px-lg-4 mx-lg-3">
              Log In
            </button>
          </NavItem>
          <NavItem onClick={handleSignup}>
            <button type="button" className="btn btn-outline-app-primary fw-600 fs-0p875 px-2 px-lg-3">
              Sign Up
            </button>
          </NavItem>
          </>
          }
        </Nav>
        {/* <ForgotModal open={login} callback={setLogin} / > */}
        {/* <VerifyModal open={login} callback={setLogin} / > */}
        {/* <ResetPasswordModal open={login} callback={setLogin} / > */}
      </Collapse>
      <LoginModal
        open={login}
        onClose={() => setLogin(false)}
        onSignUp={switchSignUp}
        onForgot={toggleForgot}
      />
      <SignupModal open={signup} onClose={() => setSignup(false)} />
      <ForgotModal
        open={forgot}
        onClose={() => setForgot(false)}
        onBack={toggleForgot}
        onSentCode={onSentCode}
      />
      <ResetModal
        open={reset}
        onClose={() => setReset(false)}
        email={email}
        onBack={backToForgot}
      />
      <ConfirmModal
        open={logout}
        onClose={() => setLogout(false)}
        customChildren={customLogout}
        primaryButton="Yes"
        onPrimaryClick={handleLogout}
        secondaryButton="No"
      />
    </Navbar>
  );
};

const mapStateToProps = state => {
  return {
    userId: state.userId,
    userInfo: state.userInfo,
    userMessages: state.userMessages,
  }
}
export default connect(mapStateToProps, {setUserId})(Navigation);