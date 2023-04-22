import React, { Suspense, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';
import 'react-tabs/style/react-tabs.css';

import * as Constant from '../constants/constant';
import Navigation from "../components/header/Navigation"
import Footer from '../components/footer/Footer';
import AppSpinner from '../components/loading/AppSpinner';
import ContentLayout from './ContentLayout';
import AdminHeader from '../components/header/AdminHeader';
import AdminLayout from './AdminLayout';
import AdminLogin from '../pages/admin/login/AdminLogin';
import AdminFooter from '../components/footer/AdminFooter';
import NotFound from '../pages/error/NotFound';
import { frontRoutes, innerRoutes, adminRoutes } from "../routes/routes";
import styles from './AppLayout.module.css';

const AppLayout = (props) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userId } = props;
  const PAGE_TYPE_NONE = -1;
  const PAGE_TYPE_FRONT = 0;
  const PAGE_TYPE_INNER = 1;
  const PAGE_TYPE_ADMIN = 2;
  const [pageType, setPageType] = useState(PAGE_TYPE_NONE);
  const [adminLogin, setAdminLogin] = useState(false);

  useEffect(() => {
    const includePage = (routes, path) => {
      return routes.filter((e) => {
        if (e.exact) {
          return e.path === path;
        } else {
          const words = e.path.split(':');
          const keys = path.split('?');
          if (words.length === 2) {
            return path.startsWith(words[0]);
          } else if (keys.length === 1 || keys.length === 2) {
            return path.startsWith(keys[0]);
          } else {
            /// 404 page
            return false;
          }
        }
      }).length > 0;
    }

    const getPageType = (path) => {
      if (userId && includePage(innerRoutes, path)) {
        return PAGE_TYPE_INNER;
      } else if (includePage(adminRoutes, path)) {
        return PAGE_TYPE_ADMIN;
      } else if (includePage(frontRoutes, path)) {
        return PAGE_TYPE_FRONT;
      } else {
        return PAGE_TYPE_NONE;
      }
    }

    setPageType(getPageType(pathname));
  }, [pathname, userId, PAGE_TYPE_NONE]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if(pathname === '/admin') setAdminLogin(true);
  }, [pathname]);

  useEffect(() => {
    if(pageType === PAGE_TYPE_ADMIN && sessionStorage.getItem(Constant.CURRENT_ADMIN_USER)){
      if(pathname === '/admin') navigate('/admin/dashboard');
      setAdminLogin(false);
    }
    else if(pageType === PAGE_TYPE_ADMIN){
      navigate('/admin');
      setAdminLogin(true);
    }
  }, [navigate, pageType, pathname]);
  
  return (
    <div className={styles.layout}>
      {pageType === PAGE_TYPE_ADMIN ? (
        <>
          {adminLogin ? (
            <AdminLogin>{props.children}</AdminLogin>
          ) : (
            <>
              <AdminHeader />
              <AdminLayout>{props.children}</AdminLayout>
              <AdminFooter />
            </>
          )}
        </>
      ) : (
        <>
          <Navigation />
          {pageType === PAGE_TYPE_FRONT ? (
            <div className="app-min-height position-relative">
              <Suspense fallback={<AppSpinner absolute />}>
                {props.children}
              </Suspense>
            </div>
          ) : pageType === PAGE_TYPE_INNER ? (
            <ContentLayout>
              {props.children}
            </ContentLayout>
          ) : (
            <NotFound />
          )}
          <Footer />
        </>
      )}
      <ToastContainer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps)(AppLayout);