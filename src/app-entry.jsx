import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
// import { message } from 'antd';
import 'babel-polyfill';
import Store from './store';

import './common/common.css';
import Utils from './common/Utils';
import { ROUTE_NAMES } from './common/RouteNames';
// import { ROLE_PERMISSIONS_VALUE } from './common/Constant';

import Login from './pages/login';
import Home from './pages/home';
import Index from './pages/index';
import Flow from './pages/dataStatistics/flow';
import Recommend from './pages/dataStatistics/recommend';
import OnDemand from './pages/dataStatistics/onDemand';
import InfoList from './pages/infoRelease/list';
import CIBNMedia from './pages/mediaManage/cibnMedia';
import LibraryManage from './pages/mediaManage/libraryManage';
import SortManage from './pages/mediaManage/sortManage';
import TopicManage from './pages/mediaManage/topicManage';
import PriceStrategy from './pages/mediaManage/priceStrategy';
import MediaHome from './pages/mediaManage/mediaHome';
import UserOrg from './pages/userManage/org';
import UserTenant from './pages/userManage/tenant';
import UserRole from './pages/userManage/role';
import AppApp from './pages/appManage/app';
import AppStrategy from './pages/appManage/strategy';
import Releaserecord from './pages/appManage/releaserecord';
import Upgraderecord from './pages/appManage/upgraderecord';
import AppInquire from './pages/appManage/appInquire';
import ThirdAppInquire from './pages/appManage/thirdAppInquire';
import Appstatistics from './pages/appManage/appstatistics';
import Thirdappstatistics from './pages/appManage/thirdappstatistics';
import TenantAppInquire from './pages/appManage/tenantAppInquire';
import NodeList from './pages/nodeManage/nodeList';
import MediaDownload from './pages/nodeManage/mediaDownload';
import LogManage from './pages/nodeManage/logManage';
import Announcement from './pages/infoManage/announcement';
import InstantCheckIn from './pages/dataShow/instantCheckIn';
import PeopleSource from './pages/dataShow/peopleSource';
import VideoHit from './pages/dataShow/videoHit';
import FireSafety from './pages/dataShow/fireSafety';
import CheckIn from './pages/dataShow/checkIn';
import ImgManage from './pages/contentManage/imgManage';
import ImgCollectionManage from './pages/contentManage/imgCollectionManage';
import VideoManage from './pages/contentManage/videoManage';
import AppManage from './pages/contentManage/appManage';
import WebsiteManage from './pages/contentManage/websiteManage';
import ThemeManage from './pages/contentManage/themeManage';
import MusicManage from './pages/contentManage/musicManage';
import CustomManage from './pages/contentManage/customManage';
import CustomPage from './pages/contentManage/customPage';
import SecondaryManage from './pages/contentManage/secondaryManage';
import SecondaryPage from './pages/contentManage/secondaryPage';
import AdManage from './pages/contentManage/adManage';
import LanguageManage from './pages/contentManage/languageManage';
import PmsManage from './pages/contentManage/pmsManage';
import SceneManage from './pages/sceneManage/sceneManage';
import Layout from './pages/sceneManage/layout';

const App = function(props) {
  return (
    <div className="app-container">
      {props.children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired,
};

// 渲染入口
const appDom = document.querySelector('#app');
const RN = ROUTE_NAMES;
const routeEnter = nextState => {
  Utils.fixTitle(nextState);
  // console.log(nextState.location.pathname);

  const neednotLoginPages = [
    ROUTE_NAMES.LOGIN,
  ];

  if (neednotLoginPages.indexOf(nextState.location.pathname) === -1) {
    const userInfo = JSON.parse(window.sessionStorage.getItem('UV_userInfo'));
    if (!userInfo) {
      Utils.router.go(ROUTE_NAMES.LOGIN);
    } else if (!userInfo.tenantId && !userInfo.orgId) {
      Utils.router.go(ROUTE_NAMES.LOGIN);
    }
    /*
    else if (userInfo.privileges) {
      // 判断角色权限，访问打开具体菜单
      const privileges = userInfo.privileges;
      let indexPage = null;
      if (privileges.length === 0) {
        Utils.router.go(ROUTE_NAMES.LOGIN);
        message.error('没有任何权限，请联系管理员！');
        return;
      }
      // 判断可以第一个权限所打开的页面
      if (privileges.indexOf(ROLE_PERMISSIONS_VALUE.DataMenu)) {
        if (privileges.indexOf(ROLE_PERMISSIONS_VALUE.DataMenu.sub[0])) {
          indexPage = RN.APPAPP;
        }
      }
      if (indexPage) {
        Utils.router.go(indexPage);
      }
    }
    */
  }
};

// const routeChange = (preState, nextState) => {
//   Utils.fixTitle(nextState);
// };


// 部分页面采用嵌套路由的方式进行跳转，可以保留上一级页面的状态，不用做滚动条的记录等功能
// 前提是下一个页面没有进入其他页面的路口，如果有的话，状态保留就会失败
// 带有子页面的需要使用onChange方法来监听，因为onEnter方法在从子页面返回父页面时不会触发

// 使用redux时的模板
render(
  (
    <Provider store={Store}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRedirect to={RN.HOME} />
          <Route path={RN.LOGIN} onEnter={routeEnter} component={Login} />
          <Route path={RN.HOME} onEnter={routeEnter} component={Home}>
            <IndexRedirect to={RN.INDEX} />
            <Route path={RN.INDEX} onEnter={routeEnter} component={Index} />
            <Route path={RN.FLOW} onEnter={routeEnter} component={Flow} />
            <Route path={RN.RECOMMEND} onEnter={routeEnter} component={Recommend} />
            <Route path={RN.ONDEMAND} onEnter={routeEnter} component={OnDemand} />
            <Route path={RN.INFOLIST} onEnter={routeEnter} component={InfoList} />
            <Route path={RN.CIBNMEDIA} onEnter={routeEnter} component={CIBNMedia} />
            <Route path={RN.LIBRARYMANAGE} onEnter={routeEnter} component={LibraryManage} />
            <Route path={RN.SORTMANAGE} onEnter={routeEnter} component={SortManage} />
            <Route path={RN.TOPICMANAGE} onEnter={routeEnter} component={TopicManage} />
            <Route path={RN.PRICESTRATEGY} onEnter={routeEnter} component={PriceStrategy} />
            <Route path={RN.MEDIAHOME} onEnter={routeEnter} component={MediaHome} />
            <Route path={RN.USERORG} onEnter={routeEnter} component={UserOrg} />
            <Route path={RN.USERTENANT} onEnter={routeEnter} component={UserTenant} />
            <Route path={RN.USERROLE} onEnter={routeEnter} component={UserRole} />
            <Route path={RN.APPAPP} onEnter={routeEnter} component={AppApp} />
            <Route path={RN.APPSTRATEGY} onEnter={routeEnter} component={AppStrategy} />
            <Route path={RN.RELEASERECORD} onEnter={routeEnter} component={Releaserecord} />
            <Route path={RN.UPGRADERECORD} onEnter={routeEnter} component={Upgraderecord} />
            <Route path={RN.APPINQUIRE} onEnter={routeEnter} component={AppInquire} />
            <Route path={RN.THIRDAPPINQUIRE} onEnter={routeEnter} component={ThirdAppInquire} />
            <Route path={RN.APPSTATISTICS} onEnter={routeEnter} component={Appstatistics} />
            <Route path={RN.THIRDAPPSTATISTICS} onEnter={routeEnter} component={Thirdappstatistics} />
            <Route path={RN.TENANTAPPINQUIRE} onEnter={routeEnter} component={TenantAppInquire} />
            <Route path={RN.NODELIST} onEnter={routeEnter} component={NodeList} />
            <Route path={RN.MEDIADOWNLOAD} onEnter={routeEnter} component={MediaDownload} />
            <Route path={RN.LOGMANAGE} onEnter={routeEnter} component={LogManage} />
            <Route path={RN.ANNOUNCEMENT} onEnter={routeEnter} component={Announcement} />
            <Route path={RN.INSTANTCHECKIN} onEnter={routeEnter} component={InstantCheckIn} />
            <Route path={RN.PEOPLESOURCE} onEnter={routeEnter} component={PeopleSource} />
            <Route path={RN.VIDEOHIT} onEnter={routeEnter} component={VideoHit} />
            <Route path={RN.FIRESAFETY} onEnter={routeEnter} component={FireSafety} />
            <Route path={RN.CHECKIN} onEnter={routeEnter} component={CheckIn} />
            <Route path={RN.IMGMANAGE} onEnter={routeEnter} component={ImgManage} />
            <Route path={RN.IMGCOLLECTIONMANAGE} onEnter={routeEnter} component={ImgCollectionManage} />
            <Route path={RN.VIDEOMANAGE} onEnter={routeEnter} component={VideoManage} />
            <Route path={RN.APPMANAGE} onEnter={routeEnter} component={AppManage} />
            <Route path={RN.WEBSITEMANAGE} onEnter={routeEnter} component={WebsiteManage} />
            <Route path={RN.THEMEMANAGE} onEnter={routeEnter} component={ThemeManage} />
            <Route path={RN.MUSICMANAGE} onEnter={routeEnter} component={MusicManage} />
            <Route path={RN.CUSTOMMANAGE} onEnter={routeEnter} component={CustomManage} />
            <Route path={RN.CUSTOMPAGE} onEnter={routeEnter} component={CustomPage} />
            <Route path={RN.SECONDARYMANAGE} onEnter={routeEnter} component={SecondaryManage} />
            <Route path={RN.SECONDARYPAGE} onEnter={routeEnter} component={SecondaryPage} />
            <Route path={RN.ADMANAGE} onEnter={routeEnter} component={AdManage} />
            <Route path={RN.LANGUAGEMANAGE} onEnter={routeEnter} component={LanguageManage} />
            <Route path={RN.PMSMANAGE} onEnter={routeEnter} component={PmsManage} />
            <Route path={RN.SCENEMANAGE} onEnter={routeEnter} component={SceneManage} />
            <Route path={RN.LAYOUT} onEnter={routeEnter} component={Layout} />
          </Route>


        </Route>
      </Router>
    </Provider>
  ),
  appDom,
);
