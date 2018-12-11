import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Select, Button, Input, DatePicker, } from 'antd';

import './appManage.css';
import Utils from '../../common/Utils';

const { Content } = Layout;
const Option = Select.Option;
const { RangePicker } = DatePicker;

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
      room: '',
      packageName: '',
      tenantId: '',
      startDay: '',
      endDay: '',
    };

    this.columns = [{
      title: '商户',
      dataIndex: 'tenantName',
      key: 'tenantName',
    }, {
      title: '设备ID',
      dataIndex: 'deviceId',
      key: 'deviceId',
    }, {
      title: '应用包名',
      dataIndex: 'packageName',
      key: 'packageName',
    }, {
      title: '应用版本号',
      dataIndex: 'versionName',
      key: 'versionName',
    }, {
      title: '房间号',
      dataIndex: 'room',
      key: 'room',
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
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
  // 获取列表
  getAppInquireList = (page, size) => {
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/device/info/third`,
      method: 'get',
      data: {
        tenantId: this.search.tenantId,
        packageName: this.search.packageName,
        room: this.search.room,
        sort: 'createTime',
        order: 'desc',
        minUpdateTime: this.search.startDay,
        maxUpdateTime: this.search.endDay,
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
      case 'room':
        this.search.room = value.target.value;
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
  // 时间区间选择确定
  dateOnChange = (moment, dateString) => {
    if (dateString[0] === '') {
      this.search.startDay = '';
      this.search.endDay = '';
    } else {
      this.search.startDay = moment[0].format('YYYY-MM-DD HH:mm:ss');
      this.search.endDay = moment[1].format('YYYY-MM-DD HH:mm:ss');
    }
  }

  render() {
    const { loading, current, tableData, tableTotal, packageNameData, tenantData, } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>应用管理</Breadcrumb.Item>
          <Breadcrumb.Item>终端第三方应用查询</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', margin: '0 0 20px' }}>
          <div style={{ width: '100%', padding: '15px' }}>
            <div className="appLogToolbar">
              <div className="appLogToolbar-item" >
                <RangePicker
                  showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['最小更新时间', '最大更新时间']}
                  onChange={this.dateOnChange} style={{ marginRight: 7 }}
                />
                <Input
                  placeholder="房间号"
                  onChange={value => this.searchOnChange(value, 'room')}
                  style={{ width: 130, marginRight: 7 }}
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
                <Select
                  showSearch
                  optionFilterProp="children"
                  onChange={value => this.searchOnChange(value, 'tenantId')}
                  style={{ width: 220, marginRight: 7 }}
                  placeholder="选择商户"
                  allowClear
                >
                  { tenantData }
                </Select>
                <Button type="primary" onClick={() => this.getAppInquireList('1', '10')}>筛选</Button>
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

export default Strategy;
