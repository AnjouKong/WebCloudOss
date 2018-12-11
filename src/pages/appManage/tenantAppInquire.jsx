import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Select, Button, Input, } from 'antd';

import './appManage.css';
import Utils from '../../common/Utils';

const { Content } = Layout;
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
      tenantName: '',
      packageName: '',
      groupName: '',
      versionCode: '',
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
      title: '应用包名',
      dataIndex: 'packageName',
      key: 'packageName',
    }, {
      title: '应用版本号',
      dataIndex: 'versionCode',
      key: 'versionCode',
    }, {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
    }];
  }
  componentDidMount() {
    this.getTenantList();
    this.getPackageNameList();
    this.getAppInquireList('1', '10');
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
  }
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
  // 获取列表  统计商户或者分组的应用
  getAppInquireList = (page, size) => {
    console.log(page + '  ' + size);
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/device/stats/device`,
      method: 'get',
      data: {
        tenantName: this.search.tenantName,
        packageName: this.search.packageName,
        groupName: this.search.groupName,
        versionCode: this.search.versionCode,
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          ...resData[i],
          key: `${i}`,
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
    this.getAppInquireList(page, pageSize);
  };
  // 查询条件
  searchOnChange = (value, type) => {
    console.log(value, type);
    switch (type) {
      case 'tenantName':
        this.search.tenantName = value.target.value;
        break;
      case 'packageName':
        this.search.packageName = value;
        break;
      case 'groupName':
        this.search.groupName = value.target.value;
        break;
      case 'versionCode':
        this.search.versionCode = value.target.value;
        break;
      default:
        break;
    }
  };

  render() {
    const { loading, tableData, packageNameData, } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>应用管理</Breadcrumb.Item>
          <Breadcrumb.Item>终端应用查询</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', margin: '0 0 20px' }}>
          <div style={{ width: '100%', padding: '15px' }}>
            <div className="appLogToolbar">
              <div className="appLogToolbar-item" >
                <Input
                  placeholder="商户"
                  onChange={value => this.searchOnChange(value, 'tenantName')}
                  style={{ width: 220, marginRight: 7 }}
                />
                <Input
                  placeholder="分组"
                  onChange={value => this.searchOnChange(value, 'groupName')}
                  style={{ width: 220, marginRight: 7 }}
                />
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
                <Input
                  placeholder="应用版本号"
                  onChange={value => this.searchOnChange(value, 'versionCode')}
                  style={{ width: 130, marginRight: 7 }}
                />
                {/*
                 <Select
                  showSearch
                  optionFilterProp="children"
                  onSelect={value => this.searchOnChange(value, 'tenantId')}
                  style={{ width: 220, marginRight: 7 }}
                  placeholder="选择商户"
                  allowClear
                >
                  { tenantData }
                </Select>
                */}

                <Button type="primary" onClick={() => this.getAppInquireList('1', '10')}>筛选</Button>
              </div>
            </div>
            <Table
              loading={loading}
              columns={this.columns}
              dataSource={tableData}
              // pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Strategy;
