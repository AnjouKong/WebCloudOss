import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Divider, Select, Button, message, Modal, Input } from 'antd';

import './appManage.css';
import Utils from '../../common/Utils';
import AddStrategy from './strategyModal/addStrategy';
import EditStrategy from './strategyModal/editStrategy';

const { Content } = Layout;
const confirm = Modal.confirm;
const Option = Select.Option;

class Strategy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      current: 1,
      tableTotal: '',
      tableData: [],
      tenantData: [],
      packageNameData: [],
    };
    this.search = {
      title: '',
      appAction: '',
      packageName: '',
      tenantId: '',
    };

    this.columns = [{
      title: '名称',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '应用名',
      dataIndex: 'label',
      key: 'label',
    }, {
      title: '应用包名',
      dataIndex: 'packageName',
      key: 'packageName',
    }, {
      title: '版本号名称',
      dataIndex: 'versionName',
      key: 'versionName',
    }, {
      title: '应用版本号',
      dataIndex: 'versionCode',
      key: 'versionCode',
    }, {
      title: '商户',
      dataIndex: 'tenantName',
      key: 'tenantName',
    }, {
      title: '是否发布',
      dataIndex: 'publish',
      key: 'publish',
      render: publish => {
        const red = <span style={{ color: 'red' }}>否</span>;
        const green = <span style={{ color: '#008B45' }}>是</span>;
        return publish === 0 ? red : green;
      }
    }, {
      title: '策略行为',
      dataIndex: 'appAction',
      key: 'appAction',
      render: appAction => {
        const red = <span style={{ color: 'red' }}>卸载</span>;
        const green = <span style={{ color: '#008B45' }}>安装</span>;
        return appAction === 'install' ? green : red;
      }
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (id, record) => (
        <span>
          <a onClick={() => this.publishState(record.id, record.publish)}>{record.publish === 0 ? '发布' : '取消发布'}</a>
          <Divider type="vertical" />
          <a onClick={() => this.$editStrategy.showModal(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.delUser(record.id)}>删除</a>
        </span>
      )
    }];
  }
  componentDidMount() {
    this.getTenantList();
    this.getPackageNameList();
    this.getAppStrategyList('1', '10');
  }
  // 获取包名列表
  getPackageNameList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/apk/list`,
      method: 'get',
      data: {}
    })
    .then(res => {
      const resData = res.data;
      const packageNameData = [];
      for (let i = 0; i < resData.length; i += 1) {
        packageNameData.push(
          <Option key={resData[i].packageName} value={resData[i].packageName}>{resData[i].label + '/' + resData[i].packageName}</Option>
        );
      }
      this.setState({
        packageNameData
      });
    })
    .catch(() => {
    });
  };
  // 获取商户列表
  getTenantList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/page`,
      method: 'post',
      data: {
        page: 1,
        size: 10000,
      }
    })
    .then(res => {
      const resData = res.data;
      const tenantData = [];
      for (let i = 0; i < resData.length; i += 1) {
        tenantData.push(
          <Option key={i} value={resData[i].id} title={resData[i].tenantName}>{resData[i].tenantName}</Option>
        );
      }
      this.setState({
        tenantData
      });
    })
    .catch(() => {
    });
  }
  // 获取列表
  getAppStrategyList = (page, size) => {
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/version/page`,
      method: 'get',
      data: {
        tenantId: this.search.tenantId,
        packageName: this.search.packageName,
        appAction: this.search.appAction,
        title: this.search.title,
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
          appAction: `${resData[i].appAction}`,
          publish: resData[i].state, // state: 1发布 0未发布
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
    this.setState({
      current: page,
    });
    this.getAppStrategyList(page, pageSize);
  };
  // 发布
  publishState = (id, state) => {
    this.url = '';
    if (state === 0) {
      this.url = '';
    } else {
      this.url = '/cancel';
    }
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/version/release${this.url}`,
      method: 'post',
      data: {
        id,
      }
    })
    .then(() => {
      message.success('成功！');
      this.getAppStrategyList(this.state.current, '10');
    })
    .catch(res => {
      message.error(res.message);
    });
  }
  // 删除
  delUser = (id) => {
    confirm({
      title: '确认要删除吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 删除用户
        Utils.request({
          url: `${window.PAY_API_HOST}/op/app/version/delete`,
          method: 'post',
          data: {
            id,
          }
        })
        .then(res => {
          if (res && res.success) {
            message.success('删除成功');
            this.getAppStrategyList('1', '10');
          }
        })
        .catch(() => {
        });
      },
      onCancel: () => {
        // console.log('Cancel');
      },
    });
  }
  // 查询条件
  searchOnChange = (value, type) => {
    console.log(value, type);
    switch (type) {
      case 'title':
        this.search.title = value.target.value;
        break;
      case 'appAction':
        this.search.appAction = value;
        break;
      case 'packageName':
        this.search.packageName = value;
        break;
      case 'tenantId':
        this.search.tenantId = value;
        break;
      default:
        break;
    }
  };

  render() {
    const { loading, current, tableData, tableTotal, packageNameData, tenantData, } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>应用管理</Breadcrumb.Item>
          <Breadcrumb.Item>升级策略</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', margin: '0 0 20px' }}>
          <div style={{ width: '100%', padding: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <Button type="primary" onClick={() => this.$addStrategy.showModal(this.state)}>新建策略</Button>
              {/* <Button style={{ marginLeft: '10px' }} type="primary" onClick={() => this.$addStrategy.showModal(this.state)}>新建批量策略</Button> */}
              <div style={{ float: 'right' }}>
                <Input
                  placeholder="名称"
                  onChange={value => this.searchOnChange(value, 'title')}
                  style={{ width: 200, marginRight: 7 }}
                />
                <Select
                  onChange={value => this.searchOnChange(value, 'appAction')}
                  style={{ width: 130, marginRight: 7 }}
                  placeholder="选择状态"
                  allowClear
                >
                  <Option value="install">安装</Option>
                  <Option value="remove">卸载</Option>
                </Select>
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={value => this.searchOnChange(value, 'packageName')}
                  style={{ width: 330, marginRight: 7 }}
                  placeholder="选择包名"
                  allowClear
                >
                  { packageNameData }
                </Select>
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={value => this.searchOnChange(value, 'tenantId')}
                  style={{ width: 230, marginRight: 7 }}
                  placeholder="选择商户"
                  allowClear
                >
                  { tenantData }
                </Select>
                <Button type="primary" onClick={() => this.getAppStrategyList('1', '10')}>筛选</Button>
              </div>
            </div>
            <Table
              loading={loading}
              columns={this.columns}
              dataSource={tableData}
              pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
            <AddStrategy type={2} onRef={ref => { this.$addStrategy = ref; }} onOK={() => this.getAppStrategyList('1', '10')} />
            <EditStrategy type={2} onRef={ref => { this.$editStrategy = ref; }} onOK={() => this.getAppStrategyList(current, '10')} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Strategy;
