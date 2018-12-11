import React, { Component } from 'react';
import { Link } from 'react-router';
import { Layout, Menu, Icon, Button, Dropdown, Modal, Input, message, Tooltip } from 'antd';
import './home.css';
import { ROUTE_NAMES } from '../common/RouteNames';
import { ROLE_PERMISSIONS_VALUE } from '../common/Constant';
import Utils from '../common/Utils';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

class NavPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEditPasswordVisible: false,
      confirmLoading: false,
      canChangePassword: false,
      hasInputEnterPassword: false,
      collapsed: false,
      openKeys: this.arr(),
      isSelect: window.location.hash.substr(1),
    };

    this.formData = {
      oldPassword: '',
      newPassword: '',
    };
  }

  componentWillMount() {
    window.addEventListener('popstate', this.handlePop.bind(this));
  }

  componentDidMount() {
    window.removeEventListener('popstate', this.handlePop.bind(this));
  }

  onOpenChange = (openKeys) => {
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({ openKeys: nextOpenKeys });
  };

  onClickLogout = () => {
    console.log('退出');
    this.logout();
  };

  getAncestorKeys = (key) => {
    // console.log(key);
    const map = {
      sub4: ['sub3'],
    };
    return map[key] || [];
  };

  modalInputOnchange = (e, type) => {
    let checkTmp = false;
    switch (type) {
      case 'oldPassword':
        this.formData.oldPassword = e.target.value;
        break;
      case 'newPassword':
        this.formData.newPassword = e.target.value;
        break;
      case 'enterNewPassword':
        if (this.formData.newPassword === e.target.value) {
          checkTmp = true;
        }
        if (!this.state.hasInputEnterPassword) {
          this.setState({
            hasInputEnterPassword: true,
            canChangePassword: checkTmp,
          });
        } else {
          this.setState({
            canChangePassword: checkTmp,
          });
        }
        break;
      default:
        break;
    }
  };
  modalEditOk = () => {
    this.setState({
      confirmLoading: true,
    });
    // 修改密码
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/user/changePassword`,
      method: 'post',
      data: {
        oldPassword: this.formData.oldPassword,
        newPassword: this.formData.newPassword,
      }
    })
      .then(res => {
        if (res && res.success) {
          this.setState({
            modalEditPasswordVisible: false,
            confirmLoading: false,
          });
          message.success('修改密码成功');
          this.logout();
        }
      })
      .catch(() => {
        message.error('修改密码失败');
      });
  };

  modalEditCancel = () => {
    this.setState({ modalEditPasswordVisible: false });
  };

  toggle = () => {
    console.log(this.state.collapsed);
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  arr = () => {
    const arr = window.location.hash.substr(1).split('/');
    arr.splice(0, 1);
    arr.splice(-1, 1);
    return arr;
  }

  handlePop() {
    this.setState({
      isSelect: window.location.hash.substr(1),
      openKeys: this.arr(),
    });
  }

  handleClick = (e) => {
    // console.log('Clicked: ', e);
    this.setState({
      current: e.key,
    });
  };
  // 退出接口 Liser
  logout = () => {
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/user/logout`,
      method: 'GET',
      data: {},
      type: 'json',
    }).then((res) => {
      console.log(res);
      if (res.success) {
        window.sessionStorage.clear();
        if (window.loginUrlPram) {
          Utils.router.go(`${ROUTE_NAMES.LOGIN}?tenant=${window.loginUrlPram}`);
        } else {
          Utils.router.go(`${ROUTE_NAMES.LOGIN}`);
        }
      }
    });
  };

  render() {
    // let privileges = ['2', '1', 'dataMenu', 'dataMenu100', 'dataMenu200', 'dataMenu300', 'mediaMenu', 'mediaMenu100', 'mediaMenu200', 'userMenu', 'userMenu100', 'userMenu200', 'userMenu300'];
    const { confirmLoading, modalEditPasswordVisible, canChangePassword, hasInputEnterPassword } = this.state;
    let privileges = [];
    const userInfo = JSON.parse(window.sessionStorage.getItem('UV_userInfo'));
    let userName = null;
    if (userInfo && userInfo.privileges) {
      privileges = userInfo.privileges;
    }
    if (userInfo && userInfo.name) {
      userName = userInfo.name;
    }

    const menuNowUser = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={() => { this.setState({ modalEditPasswordVisible: true }); }}>修改密码</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={this.onClickLogout}>安全退出</a>
        </Menu.Item>
      </Menu>
    );
    let modalTootip = null;
    // let okDisibale = true;
    if (hasInputEnterPassword && !canChangePassword) {
      modalTootip = (
        <div className="ico redTip">
          <Tooltip title="请确认新密码是否一致!">
            <Icon type="exclamation-circle-o" />
          </Tooltip>
        </div>
        );
    } else if (hasInputEnterPassword && canChangePassword) {
      // okDisibale = false;
      modalTootip = (
        <div className="ico greenTip">
          <Icon type="check-circle-o" />
        </div>
      );
    }

    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            onOpenChange={this.onOpenChange}
            // openKeys={this.state.openKeys}
            selectedKeys={[`${this.state.isSelect}`]}
            onClick={this.handleClick}
          >
            <Menu.Item key="/index" ><Link to="/index"> <Icon type="appstore" /><span>首页</span></Link></Menu.Item>
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.DataMenu.main) > -1 &&
              <SubMenu key="dataStatistics" title={<span><Icon type="bar-chart" /><span>数据统计</span></span>}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.DataMenu.sub[0]) > -1 &&
                  <Menu.Item key="/dataStatistics/flow"><Link to="/dataStatistics/flow">流量统计</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.DataMenu.sub[1]) > -1 &&
                  <Menu.Item key="/dataStatistics/recommend"><Link to="/dataStatistics/recommend">推荐位统计</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.DataMenu.sub[2]) > -1 &&
                  <Menu.Item key="/dataStatistics/onDemand"><Link to="/dataStatistics/onDemand">点播统计</Link></Menu.Item>
                }
              </SubMenu>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.InfoMenu.main) > -1 &&
              <SubMenu key="infoRelease" title={<span><Icon type="appstore" /><span>信息发布</span></span>}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.InfoMenu.sub[0]) > -1 &&
                  <Menu.Item key="/infoRelease/list"><Link to="/infoRelease/list">信息列表</Link></Menu.Item>
                }
              </SubMenu>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.MediaMenu.main) > -1 &&
              <SubMenu key="mediaManage" title={<span><Icon type="video-camera" /><span>媒资管理</span></span>}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.MediaMenu.sub[0]) > -1 &&
                  <Menu.Item key="/mediaManage/cibnMedia"><Link to="/mediaManage/cibnMedia">CIBN媒资</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.MediaMenu.sub[1]) > -1 &&
                  <Menu.Item key="/mediaManage/libraryManage"><Link to="/mediaManage/libraryManage">媒资库管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.MediaMenu.sub[2]) > -1 &&
                  <Menu.Item key="/mediaManage/sortManage"><Link to="/mediaManage/sortManage">分类管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.MediaMenu.sub[3]) > -1 &&
                  <Menu.Item key="/mediaManage/topicManage"><Link to="/mediaManage/topicManage">专题管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.MediaMenu.sub[4]) > -1 &&
                  <Menu.Item key="/mediaManage/priceStrategy"><Link to="/mediaManage/priceStrategy">价格策略</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.MediaMenu.sub[5]) > -1 &&
                  <Menu.Item key="/mediaManage/mediaHome"><Link to="/mediaManage/mediaHome">媒资首页</Link></Menu.Item>
                }
              </SubMenu>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.UserMenu.main) > -1 &&
              <SubMenu key="userManage" title={<span><Icon type="user" /><span>用户管理</span></span>}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.UserMenu.sub[0]) > -1 &&
                  <Menu.Item key="/userManage/org"><Link to="/userManage/org">组织机构</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.UserMenu.sub[1]) > -1 &&
                  <Menu.Item key="/userManage/tenant"><Link to="/userManage/tenant">商户管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.UserMenu.sub[2]) > -1 &&
                  <Menu.Item key="/userManage/role"><Link to="/userManage/role">角色管理</Link></Menu.Item>
                }
              </SubMenu>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.main) > -1 &&
              <SubMenu key="appManage" title={<span><Icon type="android" /><span>应用管理</span></span>}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.sub[0]) > -1 &&
                  <Menu.Item key="/appManage/app"><Link to="/appManage/app">应用列表</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.sub[1]) > -1 &&
                  <Menu.Item key="/appManage/strategy"><Link to="/appManage/strategy">版本管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.sub[2]) > -1 &&
                  <Menu.Item key="/appManage/releaserecord"><Link to="/appManage/releaserecord">版本发布记录</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.sub[3]) > -1 &&
                  <Menu.Item key="/appManage/upgraderecord"><Link to="/appManage/upgraderecord">终端应用升级记录</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.sub[4]) > -1 &&
                  <Menu.Item key="/appManage/appInquire"><Link to="/appManage/appInquire">终端应用查询</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.sub[5]) > -1 &&
                  <Menu.Item key="/appManage/thirdAppInquire"><Link to="/appManage/thirdAppInquire">终端第三方应用查询</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.sub[6]) > -1 &&
                  <Menu.Item key="/appManage/appstatistics"><Link to="/appManage/appstatistics">终端应用统计</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.sub[7]) > -1 &&
                  <Menu.Item key="/appManage/thirdappstatistics"><Link to="/appManage/thirdappstatistics">终端第三方应用统计</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.sub[8]) > -1 &&
                  <Menu.Item key="/appManage/tenantAppInquire.jsx"><Link to="/appManage/tenantAppInquire">商户应用统计</Link></Menu.Item>
                }
              </SubMenu>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.NodeMenu.main) > -1 &&
              <SubMenu key="nodeManage" title={<span><Icon type="share-alt" /><span>节点管理</span></span>}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.NodeMenu.sub[0]) > -1 &&
                  <Menu.Item key="/nodeManage/nodeList"><Link to="/nodeManage/nodeList">节点列表</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.NodeMenu.sub[1]) > -1 &&
                  <Menu.Item key="/nodeManage/mediaDownload"><Link to="/nodeManage/mediaDownload">预下载列表</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.NodeMenu.sub[2]) > -1 &&
                  <Menu.Item key="/nodeManage/logManage"><Link to="/nodeManage/logManage">日志管理</Link></Menu.Item>
                }
              </SubMenu>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.InfoManage.main) > -1 &&
              <SubMenu key="infoManage" title={<span><Icon type="appstore" /><span>信息管理</span></span>}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.InfoManage.sub[0]) > -1 &&
                  <Menu.Item key="/infoManage/announcement"><Link to="/infoManage/announcement">公告信息</Link></Menu.Item>
                }
              </SubMenu>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.dataShow.main) > -1 &&
              <SubMenu key="dataShow" title={<span><Icon type="bar-chart" /><span>数据展示</span></span>}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.dataShow.sub[0]) > -1 &&
                  <Menu.Item key="/dataShow/instantCheckIn"><Link to="/dataShow/instantCheckIn">即时入住信息</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.dataShow.sub[1]) > -1 &&
                  <Menu.Item key="/dataShow/peopleSource"><Link to="/dataShow/peopleSource">入住人员分布</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.dataShow.sub[2]) > -1 &&
                  <Menu.Item key="/dataShow/videoHit"><Link to="/dataShow/videoHit">影片热播分布</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.dataShow.sub[3]) > -1 &&
                  <Menu.Item key="/dataShow/fireSafety"><Link to="/dataShow/fireSafety">房间消防安全信息</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.dataShow.sub[4]) > -1 &&
                  <Menu.Item key="/dataShow/checkIn"><Link to="/dataShow/checkIn">房间入住信息</Link></Menu.Item>
                }
              </SubMenu>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.main) > -1 &&
              <SubMenu key="contentManage" title={<span><Icon type="file-add" /><span>内容管理</span></span>}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[0]) > -1 &&
                  <Menu.Item key="/contentManage/imgManage"><Link to="/contentManage/imgManage">图片管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[1]) > -1 &&
                  <Menu.Item key="/contentManage/imgCollectionManage"><Link to="/contentManage/imgCollectionManage">图片集管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[2]) > -1 &&
                  <Menu.Item key="/contentManage/videoManage"><Link to="/contentManage/videoManage">视频管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[3]) > -1 &&
                  <Menu.Item key="/contentManage/appManage"><Link to="/contentManage/appManage">APP管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[4]) > -1 &&
                  <Menu.Item key="/contentManage/websiteManage"><Link to="/contentManage/websiteManage">网站管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[5]) > -1 &&
                  <Menu.Item key="/contentManage/themeManage"><Link to="/contentManage/themeManage">主题包管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[6]) > -1 &&
                  <Menu.Item key="/contentManage/musicManage"><Link to="/contentManage/musicManage">音乐管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[7]) > -1 &&
                  <Menu.Item key="/contentManage/customManage"><Link to="/contentManage/customManage">自定义页面</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[8]) > -1 &&
                  <Menu.Item key="/contentManage/secondaryManage"><Link to="/contentManage/secondaryManage">二级列表页面</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[9]) > -1 &&
                  <Menu.Item key="/contentManage/adManage"><Link to="/contentManage/adManage">广告管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[10]) > -1 &&
                  <Menu.Item key="/contentManage/languageManage"><Link to="/contentManage/languageManage">语言管理</Link></Menu.Item>
                }
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.sub[11]) > -1 &&
                  <Menu.Item key="/contentManage/pmsManage"><Link to="/contentManage/pmsManage">PMS管理</Link></Menu.Item>
                }
              </SubMenu>
            }
            {
              privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.main) > -1 &&
              <SubMenu key="sceneManage" title={<span><Icon type="edit" /><span>场景管理</span></span>}>
                {
                  privileges.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.sub[0]) > -1 &&
                  <Menu.Item key="/sceneManage/sceneManage"><Link to="/sceneManage/sceneManage">场景列表</Link></Menu.Item>
                }
              </SubMenu>
            }
            {/* <Menu.Item key="/sceneManage/layout"><Link to="/sceneManage/layout">场景布局</Link></Menu.Item> */}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <Dropdown overlay={menuNowUser}>
              <a className="ant-dropdown-link set-menu">
                <Button icon="user" style={{ border: 0 }} >{ userName && userName }</Button><Icon type="down" />
              </a>
            </Dropdown>
            { /* <Button className="logout" onClick={this.onClickLogout} icon="logout" ></Button> */ }
          </Header>
          <Content style={{ padding: '0 24px' }}>
            { this.props.children }
          </Content>
          <Modal
            title="修改密码"
            destroyOnClose
            visible={modalEditPasswordVisible}
            onCancel={this.modalEditCancel}
            footer={[
              <Button key="back" onClick={this.modalEditCancel}>取消</Button>,
              <Button key="submit" type="primary" disabled={!canChangePassword} loading={confirmLoading} onClick={this.modalEditOk}>
                确认
              </Button>,
            ]}
            width="500px"
          >
            <div className="userformBox">
              <div className="formSection">
                <p className="label">原有密码：</p>
                <div className="con">
                  <Input type="password" placeholder="请输入原密码" onChange={e => this.modalInputOnchange(e, 'oldPassword')} />
                </div>
              </div>
              <div className="formSection">
                <p className="label">新建密码：</p>
                <div className="con">
                  <Input type="password" placeholder="请输入新密码" onChange={e => this.modalInputOnchange(e, 'newPassword')} />
                </div>
                { modalTootip && modalTootip }
              </div>
              <div className="formSection">
                <p className="label">确认密码：</p>
                <div className="con">
                  <Input type="password" placeholder="确认新密码" onChange={e => this.modalInputOnchange(e, 'enterNewPassword')} />
                </div>
                { modalTootip && modalTootip }
              </div>
            </div>
          </Modal>
        </Layout>
      </Layout>
    );
  }
}

export default NavPage;
