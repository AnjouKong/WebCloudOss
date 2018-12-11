import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Divider, Button, message, Modal } from 'antd';

import './userManage.css';
import UserOrgList from './orgList';
import Utils from '../../common/Utils';
import AddUser from './addUser';
import EditUser from './editUser';

const { Content, Sider } = Layout;
const confirm = Modal.confirm;

class UserOrg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      tableData: [],
      tableTotal: '',
      currentOrgId: '',
      editOrgId: '',
    };

    this.columns = [{
      title: '登录名',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '组织机构',
      dataIndex: 'org',
      key: 'org',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (id, record) => (
        <span>
          <a onClick={() => this.$editUser.showModal(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.delUser(record.key)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.resetPassword(record.key)}>重置密码</a>
        </span>
      )
    }];

    // this.tenantId = JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId;
  }

  componentDidMount() {
    // this.getUserList('1', '10');
  }

  // 获取信息列表接口
  getUserList = (page, size, orgId) => {
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/user/page`,
      method: 'post',
      data: {
        page,
        size,
        orgId: orgId || '',
        type: 1
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          ...resData[i],
          key: `${resData[i].id}`,
          username: `${resData[i].username}`,
          name: `${resData[i].name}`,
          org: `${resData[i].orgName}`,
          operation: '查看',
        });
      }
      this.setState({
        loading: false,
        tableData: dataArray,
        tableTotal: res.totalRows,
      });
    })
    .catch(() => {
    });
  };

  // 列表翻页
  pageOnChange = (page, pageSize) => {
    this.getUserList(page, pageSize, this.state.currentOrgId);
  }

  // 点击列表赋值组织id
  rowClick = (e) => {
    this.setState({
      editOrgId: e.orgId
    });
  }

  selectOrgList = (param) => {
    this.setState({
      currentOrgId: param.id,
      currentOrgName: param.title,
    });
    // 获取用户列表
    this.getUserList('1', '10', param.id);
  };

  // 删除用户
  delUser = (ids) => {
    confirm({
      title: '确认要删除用户吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 删除用户
        Utils.request({
          url: `${window.PAY_API_HOST}/op/system/user/delete`,
          method: 'post',
          data: {
            ids,
          }
        })
        .then(res => {
          if (res && res.success) {
            message.success('删除成功');
            this.getUserList('1', '10', this.state.currentOrgId);
          }
        })
        .catch(() => {
          message.error('删除失败');
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  }

  // 重置密码
  resetPassword = (id) => {
    confirm({
      title: '确认要重置密码吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        Utils.request({
          url: `${window.PAY_API_HOST}/op/system/user/resetPassword`,
          method: 'post',
          data: {
            id,
          }
        })
        .then(res => {
          if (res && res.success) {
            message.success('重置密码成功！原始密码123456');
            this.getUserList('1', '10', this.state.currentOrgId);
          }
        })
        .catch(() => {
          message.error('重置失败');
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  }

  render() {
    const { loading, tableData, tableTotal, currentOrgId, editOrgId } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          <Breadcrumb.Item>组织机构</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', margin: '0 0 20px' }}>
          <Layout style={{ background: '#fff' }}>
            <Sider width={250} style={{ overflow: 'auto', background: '#fff', borderRight: '10px solid #f0f2f5' }}>
              <div className="orglist">
                <UserOrgList
                  select={this.selectOrgList}
                />
              </div>
            </Sider>
            <div style={{ width: '100%', padding: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <Button type="primary" onClick={() => this.$addUser.showModal(this.state)}>新建用户</Button>
              </div>
              <Table
                onRow={(record) => ({
                  onClick: () => {
                    this.rowClick(record);
                  }
                })}
                loading={loading}
                columns={this.columns}
                dataSource={tableData}
                pagination={{ defaultCurrent: 1, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
              />
              <AddUser type={1} id={currentOrgId} onRef={(ref) => { this.$addUser = ref; }} onOK={() => this.getUserList('1', '10', currentOrgId)} />
              <EditUser type={1} id={editOrgId} onRef={(ref) => { this.$editUser = ref; }} onOK={() => this.getUserList('1', '10', currentOrgId)} />
            </div>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default UserOrg;
