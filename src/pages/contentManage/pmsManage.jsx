import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Input, } from 'antd';
import Utils from '../../common/Utils';

const { Content } = Layout;
const Search = Input.Search;

class pmsManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      tableData: [],
      tableTotal: '',
    };
    this.name = '';
    this.columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '默认内容',
      dataIndex: 'defaultStatement',
      key: 'defaultStatement',
    }, {
      title: '内容',
      dataIndex: 'statement',
      key: 'statement',
    }, {
      title: 'X轴坐标',
      dataIndex: 'parentLeft',
      key: 'parentLeft',
    }, {
      title: 'Y轴坐标',
      dataIndex: 'parentTop',
      key: 'parentTop',
    }, {
      title: '描述',
      dataIndex: 'remarks',
      key: 'remarks',
    }];
  }
  componentDidMount() {
    this.getInfoList('1', '10');
  }
  onSearchChange = (value) => {
    this.name = value;
    this.getInfoList('1', '10');
  };
  // 获取信息列表接口
  getInfoList = (page, size) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/ui/content/page`,
      method: 'post',
      data: {
        page,
        size,
        sort: 'updateTime',
        order: 'desc',
        type: 'pms',
        name: this.name,
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
    this.getInfoList(page, pageSize);
  }

  render() {
    const { current, tableData, tableTotal, } = this.state;

    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          <Breadcrumb.Item>PMS管理</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div style={{ marginBottom: '15px' }}>
            <Search
              style={{ width: 220 }}
              placeholder="输入名称"
              onSearch={this.onSearchChange}
              enterButton
            />
          </div>
          <Table
            columns={this.columns}
            dataSource={tableData}
            pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
          />
        </Content>
      </Layout>
    );
  }
}

export default pmsManage;
