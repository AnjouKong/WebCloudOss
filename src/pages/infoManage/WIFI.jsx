import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Input, Button, message } from 'antd';

import './../appManage/appManage.css';
import Utils from '../../common/Utils';
import AddWIFI from './addWIFI';
import EditWIFI from './editWIFI';

const { Content } = Layout;

class WIFI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      loading: false,
      current: 1,
      tableTotal: '',
      tableData: [],
    };

    this.tenantId = window.sessionStorage.getItem('UV_userInfo') ? JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId : '';
    this.search = {
      room: '',
    };

    this.columns = [{
      title: '商户',
      dataIndex: 'tenantName',
      key: 'tenantName',
    }, {
      title: '房间号',
      dataIndex: 'roomId',
      key: 'roomId',
    }, {
      title: 'WIFI名',
      dataIndex: 'wifiName',
      key: 'wifiName',
    }, {
      title: 'WIFI密码',
      dataIndex: 'wifiPassword',
      key: 'wifiPassword',
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
          <a onClick={() => this.$editWIFI.showModal(record)}>修改</a>
        </span>
      )
    }];
  }
  componentDidMount() {
    this.getAppWIFIList('1', '10');
  }

  getAppWIFIList = (page, size) => {
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/tenant/room/page`,
      method: 'post',
      data: {
        tenantId: this.tenantId,
        roomId: this.search.room,
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
          this.getAppWIFIList('1', '10');
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
    this.getAppWIFIList(page, pageSize);
  };
  // 查询条件
  searchOnChange = (value, type) => {
    console.log(value, type);
    switch (type) {
      case 'room':
        this.search.room = value.target.value;
        break;
      default:
        break;
    }
  };

  render() {
    const { loading, current, tableData, tableTotal, } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>信息管理</Breadcrumb.Item>
          <Breadcrumb.Item>WIFI信息</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', margin: '0 0 20px' }}>
          <div style={{ width: '100%', padding: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <Button type="primary" onClick={this.roomRefresh}>同步房间信息</Button>
              <Button type="primary" onClick={() => this.$addWIFI.showModal(this.state)} style={{ marginLeft: 15 }} >批量编辑WIFI信息</Button>
              {/* <Button style={{ marginLeft: '10px' }} type="primary" onClick={() => this.$addWIFI.showModal(this.state)}>新建批量策略</Button> */}
              <div style={{ float: 'right' }}>
                <Input
                  placeholder="房间号"
                  onChange={value => this.searchOnChange(value, 'room')}
                  style={{ width: 200, marginRight: 7 }}
                />
                <Button type="primary" onClick={() => this.getAppWIFIList('1', '10')}>筛选</Button>
              </div>
            </div>
            <Table
              loading={loading}
              columns={this.columns}
              dataSource={tableData}
              pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
            <AddWIFI type={2} onRef={ref => { this.$addWIFI = ref; }} onOK={() => this.getAppWIFIList('1', '10')} />
            <EditWIFI type={2} onRef={ref => { this.$editWIFI = ref; }} onOK={() => this.getAppWIFIList(current, '10')} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default WIFI;
