import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Input, Button, message, Select } from 'antd';

import './../appManage/appManage.css';
import Utils from '../../common/Utils';

const { Content } = Layout;
const Option = Select.Option;

class nowReleaseVersion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      current: 1,
      tableTotal: '',
      tableData: [],
      tenantData: [],
      groupData: [],
      searchGroupId: '',
    };

    this.tenantId = window.sessionStorage.getItem('UV_userInfo') ? JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId : '';
    this.search = {
      deviceId: '',
      tenantId: '',
      groupId: '',
      sceneName: '',
    };

    this.columns = [{
      title: '商户',
      dataIndex: 'tenantName',
      key: 'tenantName',
    }, {
      title: '分组',
      dataIndex: 'groupName',
      key: 'groupName',
    }, {
      title: '终端',
      dataIndex: 'deviceId',
      key: 'deviceId',
    }, {
      title: '场景名称',
      dataIndex: 'sceneName',
      key: 'sceneName',
    }, {
      title: '授权状态',
      dataIndex: 'view',
      key: 'view',
      render: (id, record) => (
        <span>{ record.view ? '授权' : '未授权'}</span>
      )
    }, {
      title: '发布时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (id, record) => (
        <span>
          <a target="_blank" rel="noopener noreferrer" href={'/third/platform/preview.html?type=nowRelease&id=' + record.id}>预览场景</a>
        </span>
      )
    }];
  }
  componentDidMount() {
    this.getTenantList();
    this.getGroupList();
    this.getAppnowReleaseVersionList('1', '10');
  }

  // 获取商户
  getTenantList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/tenants`,
      method: 'get',
      data: {}
    })
      .then(res => {
        const resData = res.data;
        const tenantList = [];
        resData.map((item) => { // "/////"为了搜索名字然后取id
          return tenantList.push(
            <Option
              key={item.id}
              value={`${item.tenantName}/////${item.id}`}
              title={item.tenantName}
            >
              {item.tenantName}
            </Option>
          );
        });
        this.setState({
          tenantData: tenantList,
        });
      })
      .catch(() => {
      });
  }
  // 获取分组
  getGroupList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/group/list`,
      method: 'post',
      data: {
        tenantId: this.tenantId ? this.tenantId : this.search.tenantId,
      }
    })
      .then(res => {
        const resData = res.data;
        const tmpList = [];
        resData.map((item) => { // "/////"为了搜索名字然后取id
          return tmpList.push(
            <Option
              key={item.id}
              value={`${item.groupName}/////${item.id}`}
              title={item.groupName}
            >
              {item.groupName}
            </Option>
          );
        });
        this.setState({
          groupData: tmpList,
        });
      })
      .catch(() => {
      });
  };
  // 获取场景
  getSceneList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/group/list`,
      method: 'post',
      data: {
        tenantId: this.tenantId ? this.tenantId : this.search.tenantId,
      }
    })
      .then(res => {
        const resData = res.data;
        const tmpList = [];
        resData.map((item) => { // "/////"为了搜索名字然后取id
          return tmpList.push(
            <Option
              key={item.id}
              value={`${item.groupName}/////${item.id}`}
              title={item.groupName}
            >
              {item.groupName}
            </Option>
          );
        });
        this.setState({
          groupData: tmpList,
        });
      })
      .catch(() => {
      });
  };


  getAppnowReleaseVersionList = (page, size) => {
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/scene/releasePage`,
      method: 'post',
      data: {
        tenantId: this.tenantId ? this.tenantId : this.search.tenantId,
        groupId: this.search.groupId ? this.search.groupId.split('/////')[1] : '',
        deviceId: this.search.deviceId,
        sceneName: this.search.sceneName,
        sort: 'updateTime',
        order: 'desc',
        page,
        size,
      }
    })
      .then(res => {
        const resData = res.data;
        const dataArray = [];
        for (let i = 0; i < resData.length; i += 1) {
          dataArray.push({
            ...resData[i],
            key: `${resData[i].id}`,
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

  roomRefresh = () => {
    // 同步商户
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/room/synchronize`,
      method: 'post',
      data: {
        tenantId: this.tenantId,
      }
    })
      .then(res => {
        if (res && res.success) {
          message.success('同步成功');
          this.getAppnowReleaseVersionList('1', '10');
        }
      })
      .catch((res) => {
        // console.log(error);
        message.error(res.message);
      });
  };
  // 列表翻页
  pageOnChange = (page, pageSize) => {
    this.setState({
      current: page,
    });
    this.getAppnowReleaseVersionList(page, pageSize);
  };
  // 查询条件
  searchOnChange = (value, type) => {
    console.log(value, type);
    switch (type) {
      case 'tenantId':
        this.search.tenantId = value ? value.split('/////')[1] : '';

        this.search.groupId = '';
        this.setState({ searchGroupId: this.search.groupId });
        this.getGroupList();
        break;
      case 'groupId':
        this.search.groupId = value || '';  // value ? value.split('/////')[1] : '';
        this.setState({ searchGroupId: this.search.groupId });
        break;
      case 'deviceId':
        this.search.deviceId = value.target.value;
        break;
      case 'sceneName':
        this.search.sceneName = value.target.value;
        break;
      default:
        break;
    }
  };

  render() {
    const { loading, current, tableData, tableTotal, tenantData, groupData, searchGroupId } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>场景管理</Breadcrumb.Item>
          <Breadcrumb.Item>当前发布场景列表</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', margin: '0 0 20px' }}>
          <div style={{ width: '100%', padding: '15px' }}>
            <div style={{ marginBottom: '50px' }}>
              <div style={{ float: 'right' }}>
                {
                  !this.tenantId &&
                  <Select placeholder="选择商户" showSearch allowClear style={{ width: 240, marginRight: 20, }} onChange={value => this.searchOnChange(value, 'tenantId')}>
                    { tenantData }
                  </Select>
                }
                <Select placeholder="选择分组" showSearch allowClear style={{ width: 240, marginRight: 20, }} value={searchGroupId} onChange={value => this.searchOnChange(value, 'groupId')}>
                  { groupData }
                </Select>
                <Input
                  placeholder="终端"
                  onChange={value => this.searchOnChange(value, 'deviceId')}
                  style={{ width: 180, marginRight: 7 }}
                />
                <Input
                  placeholder="场景"
                  onChange={value => this.searchOnChange(value, 'sceneName')}
                  style={{ width: 180, marginRight: 7 }}
                />
                <Button type="primary" onClick={() => this.getAppnowReleaseVersionList('1', '10')}>筛选</Button>
              </div>
            </div>
            <Table
              loading={loading}
              columns={this.columns}
              dataSource={tableData}
              pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default nowReleaseVersion;
