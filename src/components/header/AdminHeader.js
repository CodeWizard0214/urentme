import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Collapse, Nav, Navbar, NavbarToggler, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { AiOutlineDown, AiOutlineKey } from 'react-icons/ai';
import { FaRegUserCircle, FaQuestion } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineUserCircle } from 'react-icons/hi';

import AppLazyImage from '../elements/AppLazyImage';
import CircleMark from '../marks/CircleMark';
import ConfirmModal from '../modal/ConfirmModal';
import PasswordModal from '../../pages/admin/user/PasswordModal';
import { getAdminAvatar } from '../../utils/imageUrl';
import * as APIHandler from '../../apis/APIHandler';
import * as Constant from '../../constants/constant';
import * as Color from '../../constants/color';
import styles from './AdminHeader.module.css';
import LOGO_IMAGE from '../../assets/images/logo.png';
import NO_AVATAR from '../../assets/images/no_avatar.png';

const AdminHeader = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);

  useEffect(() => {
    const adminId = sessionStorage.getItem(Constant.CURRENT_ADMIN_USER);
    let isMounted = true;
    APIHandler.adminAdminByEmail(adminId).then(data => {
      if (isMounted && data.length === 1) {
        setAdminInfo(data[0]);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }

  const handleChangePassword = (password) => {
    var sha1 = require('sha1');
    const hashPwd = sha1(Constant.HASHKEY + password);
    const json = { id: adminInfo.id, password: hashPwd };
    setLoadingPwd(true);
    APIHandler.adminPasswordAdmin(json).then(data => {
      setLoadingPwd(false);
      if (data.result === 'true') {
        toast.success('The password has been updated successfully');
        setOpenPassword(false);
      } else {
        toast.error('Fail to update password');
      }
    });
  }

  const handleLogout = () => {
    sessionStorage.removeItem(Constant.CURRENT_ADMIN_USER);
    setOpenConfirm(false);
    navigate('/admin');
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
    <Navbar color="light" expand="xs" fixed="top" light className={styles.navbar}>
      <Link to="/admin/dashboard">
        <img src={LOGO_IMAGE} alt="URentMe" className={styles.logo} />
      </Link>
      <NavbarToggler onClick={toggleCollapsed} />
      <Collapse isOpen={!collapsed} navbar className="flex-grow-0 bg-light">
        <Nav navbar className={styles.nav}>
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle nav className="text-center">
              {adminInfo ? (
                <div className="d-flex align-items-center">
                  <AppLazyImage
                    src={getAdminAvatar(adminInfo.profile_image)}
                    alt=""
                    className={`avatar ${styles.account}`}
                    placeholder={NO_AVATAR}
                    wrapperClassName="avatar"
                  />
                  <span className="fw-400 fs-0p875 black-olive ms-2 me-1">{adminInfo.first_name}</span>
                  <AiOutlineDown className="fs-0p5 black-olive" />
                </div>
              ) : (
                <FaRegUserCircle className={styles.account} />
              )}
            </DropdownToggle>
            <DropdownMenu className={styles.dropdownMenu}>
              <Link to={`/admin/admin/edit/${adminInfo?.id}`} className="decoration-none">
                <DropdownItem className={styles.menuitem}>
                  <HiOutlineUserCircle className="fs-1p375 gray-36" />
                  <span className="fw-400 fs-1p0 black-olive ms-2">Profile</span>
                </DropdownItem>
              </Link>
              <DropdownItem className={styles.menuitem} onClick={() => setOpenPassword(true)}>
                <AiOutlineKey className="fs-1p375 gray-36" />
                <span className="fw-400 fs-1p0 black-olive ms-2">Change Password</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem className={styles.menuitem} onClick={() => setOpenConfirm(true)}>
                <FiLogOut className="fs-1p375 gray-36" />
                <span className="fw-400 fs-1p0 black-olive ms-2">Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        customChildren={customLogout}
        primaryButton="Yes"
        onPrimaryClick={handleLogout}
        secondaryButton="No"
      />
      <PasswordModal
        open={openPassword}
        loading={loadingPwd}
        onClose={() => setOpenPassword(false)}
        onChange={handleChangePassword}
      />
    </Navbar>
  );
};

export default AdminHeader;
