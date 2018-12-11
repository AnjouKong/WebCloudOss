import React, { Component } from 'react';
import { Layout, Breadcrumb, Table } from 'antd';

import './appManage.css';
import Utils from '../../common/Utils';
import AppList from './appList';

const { Content, Sider } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      tableData: [],
      tablePage: { current: 1, pageSize: 10, totalRows: 0 },
    };

    this.currentAppPackageName = '';
    this.columns = [{
      title: '应用名',
      dataIndex: 'label',
      key: 'label',
    }, {
      title: '应用版本号名称',
      dataIndex: 'versionName',
      key: 'versionName',
    }, {
      title: '版本号',
      dataIndex: 'versionCode',
      key: 'versionCode',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    }];
  }

  componentDidMount() {
    this.getAppVersionList('1', '10');
  }

  // 获取应用版本列表接口
  getAppVersionList = (page, size) => {
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/app/apk/file/page`,
      method: 'get',
      data: {
        page,
        size,
        packageName: this.currentAppPackageName,
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          ...resData[i],
          key: `${resData[i].id}`,
          label: `${resData[i].label}`,
          versionName: `${resData[i].versionName}`,
          versionCode: `${resData[i].versionCode}`,
          updateTime: `${resData[i].updateTime}`,
        });
      }
      this.setState({
        loading: false,
        tableData: dataArray,
        tablePage: { current: res.currentPage, totalRows: res.totalRows, pageSize: res.pageSize },
      });
    })
    .catch(() => {
    });
  };

  // 列表翻页
  pageOnChange = (page, pageSize) => {
    this.getAppVersionList(page, pageSize);
  };

  selectAppRow = (param) => {
    this.currentAppPackageName = param.packageName;
    this.getAppVersionList('1', '10');
  };

  render() {
    const { loading, tableData, tablePage } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>应用管理</Breadcrumb.Item>
          <Breadcrumb.Item>应用列表</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', margin: '0 0 20px' }}>
          <Layout style={{ background: '#fff' }}>
            <Sider width={500} style={{ overflow: 'auto', background: '#fff', borderRight: '10px solid #f0f2f5' }}>
              <AppList
                select={this.selectAppRow}
              />
            </Sider>
            <div style={{ width: '100%', padding: '15px' }}>
              <Table
                loading={loading}
                columns={this.columns}
                dataSource={tableData}
                pagination={{ current: tablePage.current, pageSize: tablePage.pageSize, total: tablePage.totalRows, onChange: (this.pageOnChange) }}
              />
            </div>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default App;
