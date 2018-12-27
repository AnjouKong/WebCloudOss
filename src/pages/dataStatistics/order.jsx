import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Button, Input, DatePicker, } from 'antd';

import '../appManage/appManage.css';
import Utils from '../../common/Utils';

const { Content } = Layout;
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

    this.tenantId = window.sessionStorage.getItem('UV_userInfo') ? JSON.parse(window.sessionStorage.getItem('UV_userInfo')).tenantId : '';
    this.search = {
      room: '',
      startDay: '',
      endDay: '',
    };

    this.columns = [{
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    }, {
      title: '订单标题',
      dataIndex: 'subject',
      key: 'subject',
    }, {
      title: '支付方式',
      dataIndex: 'payType',
      key: 'payType',
    }, {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => {
        return price ? `${price} 元` : '';
      }
    }, {
      title: '房间号',
      dataIndex: 'roomId',
      key: 'roomId',
    }, {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
    }];
  }
  componentDidMount() {
    this.getOrderList('1', '10');
  }
  // 获取订单列表
  getOrderList = (page, size) => {
    this.setState({ loading: true });
    Utils.request({
      url: `${window.PAY_API_HOST}/op/system/order/page`,
      method: 'POST',
      data: {
        tenantId: this.tenantId,
        roomId: this.search.room,
        // sort: 'createTime',
        // order: 'desc',
        startDate: this.search.startDay,
        endDate: this.search.endDay,
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
    this.getOrderList(page, pageSize);
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
    const { loading, current, tableData, tableTotal, } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>数据统计</Breadcrumb.Item>
          <Breadcrumb.Item>订单统计</Breadcrumb.Item>
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
                <Button type="primary" onClick={() => this.getOrderList('1', '10')}>筛选</Button>
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
