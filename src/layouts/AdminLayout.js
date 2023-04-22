import React, { Suspense, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './Sidebar.scss';
import { AiOutlineCalendar, AiOutlineCar, AiOutlineHome, AiOutlineIdcard, AiOutlineMail, AiOutlineSend } from 'react-icons/ai';
import { BiTransferAlt } from 'react-icons/bi';
import { BsBook, BsBookmarks, BsQuestionOctagon } from 'react-icons/bs';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { IoNotificationsOutline } from 'react-icons/io5';
import { MdOutlineCategory, MdOutlineReviews, MdPayment } from "react-icons/md";
import * as Constant from '../constants/constant';

import HamburgerButton from './HamburgerButton';
import AppSpinner from '../components/loading/AppSpinner';
import styles from './ContentLayout.module.css';

const AdminLayout = (props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.removeItem(Constant.CURRENT_ADMIN_USER);
    }, 30 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [props]);

  const [collapsed, setCollapsed] = useState(false);
  const [toggle, setToggle] = useState(true);
  const path = useLocation().pathname;
  const isMobile = useMediaQuery({ query: `(max-width: 767px)` });

  const handleHamburger = () => {
    if (toggle) {
      // toggle collapsed if screen size is more than `md`
      setCollapsed(!collapsed);
    } else {
      // open sidebar as expanded (not collapsed)
      setToggle(true);
      setCollapsed(false);
    }
  }

  // close sidebar when
  const handleContentClick = () => {
    // close sidebar if sidebar is open and screen size is less than `md`
    if (isMobile && toggle) {
      setToggle(false);
    }
  }

  useEffect(() => {
    // Prevent content scrolling in overlay mode
    if (toggle) {
      document.body.style.overflowY = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflowY = 'auto';
      document.body.style.touchAction = 'auto';
    }
  }, [toggle]);

  return (
    <div className="d-flex">
      <ProSidebar
        breakPoint="md"
        collapsed={collapsed}
        toggled={toggle}
        onToggle={setToggle}
      >
        <Menu className={styles.menu}>
          <MenuItem
            active={path === "/admin/dashboard"}
            icon={<AiOutlineHome className="fs-1p5" />}>
            <Link to="/admin/dashboard" />
            Dashboard
          </MenuItem>
          <SubMenu
            title="User Manage"
            icon={<HiOutlineUserCircle className="fs-1p5" />}>
            <MenuItem active={path.includes("/admin/admin")}>
              <Link to="/admin/admins" />Administrators
            </MenuItem>
            <MenuItem active={path.includes("/admin/user")}>
              <Link to="/admin/users" />Members
            </MenuItem>
          </SubMenu>
          <MenuItem
            active={path === "/admin/referrals"}
            icon={<AiOutlineSend className="fs-1p5" />}>
            <Link to="/admin/referrals" />
            Referral Manage
          </MenuItem>
          <SubMenu
            title="Category Manage"
            icon={<MdOutlineCategory className="fs-1p5" />}>
            <MenuItem active={path === "/admin/categories"}>
              <Link to="/admin/categories" />Categories
            </MenuItem>
            <MenuItem active={path === "/admin/makes"}>
              <Link to="/admin/makes" />Makes
            </MenuItem>
            <MenuItem active={path === "/admin/models"}>
              <Link to="/admin/models" />Models
            </MenuItem>
          </SubMenu>
          <MenuItem
            active={path === "/admin/userids"}
            icon={<AiOutlineIdcard className="fs-1p5" />}>
            <Link to="/admin/userids" />
            ID Verification
          </MenuItem>
          <MenuItem
            active={path.includes("/admin/item")}
            icon={<AiOutlineCar className="fs-1p5" />}>
            <Link to="/admin/items" />
            Items Manage
          </MenuItem>
          <MenuItem
            active={path === "/admin/bookings"}
            icon={<BsBookmarks className="fs-1p5" />}>
            <Link to="/admin/bookings" />
            Booking Manage
          </MenuItem>
          <SubMenu
            title="Transaction Manage"
            icon={<BiTransferAlt className="fs-1p5" />}>
            <MenuItem active={path === "/admin/transactions"}>
              <Link to="/admin/transactions" />Transaction List
            </MenuItem>
            <MenuItem active={path === "/admin/transaction_attempts"}>
              <Link to="/admin/transaction_attempts" />Transaction Attempts List
            </MenuItem>
          </SubMenu>
          <MenuItem
            active={path === "/admin/testimonials"}
            icon={<MdOutlineReviews className="fs-1p5" />}>
            <Link to="/admin/testimonials" />
            Testimonials
          </MenuItem>
          <MenuItem
            active={path === "/admin/email_templates"}
            icon={<AiOutlineMail className="fs-1p5" />}>
            <Link to="/admin/email_templates" />
            Email Templates
          </MenuItem>
          <SubMenu
            title="Content Manage"
            icon={<BsBook className="fs-1p5" />}>
            <MenuItem active={path === "/admin/pages"}>
              <Link to="/admin/pages" />Pages Content
            </MenuItem>
            <MenuItem active={path === "/admin/tips"}>
              <Link to="/admin/tips" />Tips Content
            </MenuItem>
            <MenuItem active={path === "/admin/term"}>
              <Link to="/admin/term" />Terms &amp; Conditions
            </MenuItem>
            <MenuItem active={path === "/admin/policy"}>
              <Link to="/admin/policy" />Privacy Policy
            </MenuItem>
            <MenuItem active={path === "/admin/dmca"}>
              <Link to="/admin/dmca" />DMCA
            </MenuItem>
            <MenuItem active={path === "/admin/posts"}>
              <Link to="/admin/posts" />Blog
            </MenuItem>
            <MenuItem active={path === "/admin/medias"}>
              <Link to="/admin/medias" />Media
            </MenuItem>
          </SubMenu>
          <MenuItem
            active={path === "/admin/events"}
            icon={<AiOutlineCalendar className="fs-1p5" />}>
            <Link to="/admin/events" />
            Event manage
          </MenuItem>
          <MenuItem
            active={path === "/admin/deposit"}
            icon={<MdPayment className="fs-1p5" />}>
            <Link to="/admin/deposit" />
            Deposit &amp; Insurance
          </MenuItem>
          <MenuItem
            active={path === "/admin/about_us"}
            icon={<BsQuestionOctagon className="fs-1p5" />}>
            <Link to="/admin/about_us" />
            About Us
          </MenuItem>
          <MenuItem
            active={path === "/admin/notifications"}
            icon={<IoNotificationsOutline className="fs-1p5" />}>
            <Link to="/admin/notifications" />
            Notifications
          </MenuItem>
        </Menu>
      </ProSidebar>

      <div className={`${isMobile ? "w-100" : (collapsed ? styles.width80 : styles.width270)} ${styles.content}`} onClick={handleContentClick}>
        <HamburgerButton
          className={styles.hamburger}
          collapsed={isMobile || collapsed}
          onClick={handleHamburger}
        />
        <div id="admin-content-layout" className="admin-content-height list-scrollbar position-relative">
          <Suspense fallback={<AppSpinner absolute />}>
            {props.children}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
