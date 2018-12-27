import React, { Component } from 'react';
import { Layout, Breadcrumb, Checkbox, Button, message, Row, Tooltip, Icon } from 'antd';

import RoleList from './roleList';
import Utils from '../../common/Utils';
import { ROLE_PERMISSIONS_VALUE } from '../../common/Constant';

import './userManage.css';


const { Content, Sider } = Layout;
const CheckboxGroup = Checkbox.Group;

// const dataMenuOptions = [
//   { label: '流量统计', value: 'dataMenu01' },
//   { label: '推荐位统计', value: 'dataMenu02' },
//   { label: '点播统计', value: 'dataMenu03' },
// ];
class UserRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rolesLoading: false,
      rolePermissionsLoading: false,
      currentRole: [],
      rolesOptions: [],
      rolesValuse: [],
      rolePermissionsValues: [],
    };
  }

  componentDidMount() {
    // this.getSetRoleList();
  }

  onChickRolesUpdate = () => {
    this.setState({
      rolesLoading: true,
    });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/role/set`,
      method: 'post',
      data: {
        roleId: this.state.currentRole.id,
        roleIds: this.state.rolesValuse,
      }
    })
      .then(res => {
        if (res && res.success) {
          this.setState({
            rolesLoading: false,
          });
          message.success('更新成功');
        }
      })
      .catch(() => {
        message.error('更新失败');
      });
  };
  onChickRolesPermissionsUpdate = () => {
    this.setState({
      rolePermissionsLoading: true,
    });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/role/updatePermissions`,
      method: 'post',
      data: {
        roleId: this.state.currentRole.id,
        privileges: this.state.rolePermissionsValues,
      }
    })
      .then(res => {
        if (res && res.success) {
          this.setState({
            rolePermissionsLoading: false,
          });
          message.success('更新成功');
        }
      })
      .catch(() => {
        message.error('更新失败');
      });
  };
  onChangeSetRolePermissions = (checkedValues) => {
    // console.log('checked = ', checkedValues);
    this.setState({
      rolePermissionsValues: checkedValues,
    });
  };
  onChangeSetRoles = (checkedValues) => {
    console.log('checked = ', checkedValues);
    this.setState({
      rolesValuse: checkedValues,
    });
  };
  setRolesOptions = (data) => {
    const options = [];
    data.forEach((values) => {
      options.push({ label: values.name, value: values.id });
    });
    this.setState({
      rolesOptions: options,
    });
  };
  // 获取可管理角色列表
  getSetRoleList = (roleId) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/role/get`,
      method: 'post',
      data: {
        roleId,
      }
    })
      .then(res => {
        const resData = res.data;
        const dataArray = [];
        for (let i = 0; i < resData.length; i += 1) {
          dataArray.push(resData[i].id);
        }
        this.setState({
          rolesValuse: dataArray,
        });
      })
      .catch(() => {
      });
  };
  // 获取角色权限列表
  getSetRolePermissionsList = (roleId) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/role/permissions`,
      method: 'post',
      data: {
        roleId,
      }
    })
      .then(res => {
        const resData = res.data;
        this.setState({
          rolePermissionsValues: resData,
        });
      })
      .catch(() => {
      });
  };

  selectRoleRow = (param) => {
    this.setState({
      currentRole: { id: param.id, name: param.name, },
      rolesValuse: [],
      rolePermissionsValues: [],
    });
    this.getSetRoleList(param.id);
    this.getSetRolePermissionsList(param.id);
  };

  render() {
    const { currentRole, rolesOptions, rolesValuse, rolePermissionsValues } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          <Breadcrumb.Item>角色管理</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', margin: '0 0 20px' }}>
          <Layout style={{ background: '#fff' }}>
            <Sider width={500} style={{ overflow: 'auto', background: '#fff', borderRight: '10px solid #f0f2f5' }}>
              <RoleList
                select={this.selectRoleRow}
                onGetListSuccess={this.setRolesOptions}
              />
            </Sider>
            <div style={{ width: '100%', padding: '15px' }}>
              { currentRole.id &&
                <div>
                  <div style={{ width: '100%', paddingBottom: '12px' }}>
                    <Breadcrumb separator=">" >
                      <Breadcrumb.Item>{'角色: ' + currentRole.name}</Breadcrumb.Item>
                      <Breadcrumb.Item href="">可管理角色设置</Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                  <div style={{ width: '100%', marginLeft: '30px' }}>
                    <CheckboxGroup options={rolesOptions} value={rolesValuse} onChange={this.onChangeSetRoles} />
                  </div>
                  <div style={{ width: '100%', paddingTop: '20px', marginLeft: '30px' }}>
                    <Button type="primary" loading={this.state.rolesLoading} onClick={this.onChickRolesUpdate}>更新可管理角色</Button>
                  </div>
                  <div style={{ width: '100%', paddingTop: '30px' }}>
                    <div style={{ width: '100%', paddingBottom: '12px' }}>
                      <Breadcrumb separator=">" >
                        <Breadcrumb.Item>{'角色: ' + currentRole.name}</Breadcrumb.Item>
                        <Breadcrumb.Item href="">角色权限设置</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                    <div style={{ width: '100%', marginLeft: '30px' }}>
                      <CheckboxGroup value={rolePermissionsValues} onChange={this.onChangeSetRolePermissions} >
                        <Row className="roleP-checkbox-row">
                          <Checkbox value={ROLE_PERMISSIONS_VALUE.DataMenu.main}>数据统计</Checkbox>
                        </Row>
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.DataMenu.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.DataMenu.sub[0]}>流量统计</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.DataMenu.sub[1]}>推荐位统计</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.DataMenu.sub[2]}>点播统计</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.DataMenu.sub[3]}>订单统计</Checkbox>
                          </Row>
                        }
                        <Row className="roleP-checkbox-row">
                          <Checkbox value={ROLE_PERMISSIONS_VALUE.InfoMenu.main}>信息发布</Checkbox>
                        </Row>
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.InfoMenu.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.InfoMenu.sub[0]}>信息列表</Checkbox>
                          </Row>
                        }
                        <Row className="roleP-checkbox-row">
                          <Checkbox value={ROLE_PERMISSIONS_VALUE.MediaMenu.main}>媒资管理</Checkbox>
                        </Row>
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.MediaMenu.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.MediaMenu.sub[0]}>CIBN媒资</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.MediaMenu.sub[1]}>媒资库管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.MediaMenu.sub[2]}>分类管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.MediaMenu.sub[3]}>专题管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.MediaMenu.sub[4]}>价格策略</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.MediaMenu.sub[5]}>媒资首页</Checkbox>
                          </Row>
                        }
                        <Row className="roleP-checkbox-row">
                          <Checkbox value={ROLE_PERMISSIONS_VALUE.UserMenu.main}>用户管理</Checkbox>
                        </Row>
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.UserMenu.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.UserMenu.sub[0]}>组织机构&nbsp;
                              <Tooltip title="组织机构，只可给机构用户配置，请注意配置!">
                                <Icon type="question-circle-o" />
                              </Tooltip>
                            </Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.UserMenu.sub[1]}>商户管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.UserMenu.sub[2]} className="roleP-checkbox-red">角色管理&nbsp;
                              <Tooltip title="角色管理权限，只可给超级管理配置，谨慎选择!">
                                <Icon type="question-circle-o" />
                              </Tooltip>
                            </Checkbox>
                          </Row>
                        }
                        <Row className="roleP-checkbox-row">
                          <Checkbox value={ROLE_PERMISSIONS_VALUE.AppMenu.main}>应用管理</Checkbox>
                        </Row>
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.AppMenu.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.AppMenu.sub[0]}>应用列表</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.AppMenu.sub[1]}>升级策略</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.AppMenu.sub[2]}>版本发布记录</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.AppMenu.sub[3]}>终端应用升级记录</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.AppMenu.sub[4]}>终端应用查询</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.AppMenu.sub[5]}>终端第三方应用查询</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.AppMenu.sub[6]}>终端应用统计</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.AppMenu.sub[7]}>终端第三方应用统计</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.AppMenu.sub[8]}>商户应用版本统计</Checkbox>
                          </Row>
                        }
                        <Row className="roleP-checkbox-row">
                          <Checkbox value={ROLE_PERMISSIONS_VALUE.NodeMenu.main}>节点管理</Checkbox>
                        </Row>
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.NodeMenu.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.NodeMenu.sub[0]}>节点列表</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.NodeMenu.sub[1]}>预下载列表</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.NodeMenu.sub[2]}>日志管理</Checkbox>
                          </Row>
                        }
                        <Row className="roleP-checkbox-row">
                          <Checkbox value={ROLE_PERMISSIONS_VALUE.InfoManage.main}>信息管理</Checkbox>
                        </Row>
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.InfoManage.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.InfoManage.sub[0]}>公告信息</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.InfoManage.sub[1]}>WIFI信息</Checkbox>
                          </Row>
                        }
                        <Row className="roleP-checkbox-row">
                          <Checkbox value={ROLE_PERMISSIONS_VALUE.dataShow.main}>数据展示</Checkbox>
                        </Row>
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.dataShow.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.dataShow.sub[0]}>酒店即时入住信息</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.dataShow.sub[1]}>酒店入住人员分布</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.dataShow.sub[2]}>酒店影片热播分布</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.dataShow.sub[3]}>酒店房间消防安全信息</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.dataShow.sub[4]}>酒店房间入住信息</Checkbox>
                          </Row>
                        }
                        <Row className="roleP-checkbox-row">
                          <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.main}>内容管理</Checkbox>
                        </Row>
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[0]}>图片管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[1]}>图片集管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[2]}>视频管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[3]}>APP管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[4]}>网站管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[5]}>主题包管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[6]}>音乐管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[7]}>自定义页面</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[8]}>二级列表页面</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[9]}>网站管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[10]}>主题包管理</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.sub[11]}>音乐管理</Checkbox>

                          </Row>
                        }
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.contentManage.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.btn[0]}>新建栏目</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.btn[1]}>编辑栏目</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.btn[2]}>删除栏目</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.btn[3]}>新建资源</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.btn[4]}>修改资源</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.btn[5]}>删除资源</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.contentManage.btn[6]}>配置资源</Checkbox>
                          </Row>
                        }
                        <Row className="roleP-checkbox-row">
                          <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.main}>场景管理</Checkbox>
                        </Row>
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.sub[0]}>商户场景列表</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.sub[1]}>当前发布场景列表</Checkbox>
                          </Row>
                        }
                        {
                          rolePermissionsValues.indexOf(ROLE_PERMISSIONS_VALUE.SceneManage.main) > -1 &&
                          <Row className="roleP-checkbox-row roleP-checkbox-row-children">
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.btn[0]}>新建分类</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.btn[1]}>编辑分类</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.btn[2]}>删除分类</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.btn[3]}>新建场景</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.btn[4]}>编辑场景</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.btn[5]}>删除场景</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.btn[6]}>配置场景</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.btn[7]}>发布新版本</Checkbox>
                            <Checkbox value={ROLE_PERMISSIONS_VALUE.SceneManage.btn[8]}>查看发布版本</Checkbox>
                          </Row>
                        }

                      </CheckboxGroup>
                    </div>
                    <div style={{ width: '100%', paddingTop: '20px', marginLeft: '30px' }}>
                      <Button type="primary" loading={this.state.rolePermissionsLoading} onClick={this.onChickRolesPermissionsUpdate}>更新角色权限</Button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default UserRole;
