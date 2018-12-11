import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Divider, Button, Modal, } from 'antd';
import Utils from '../../common/Utils';
import AddSort from './sortModal/addSort';
import EditInfo from './sortModal/editInfo';
import AddMedia from './sortModal/addMedia';

const { Content } = Layout;
const confirm = Modal.confirm;

class libraryManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      tableData: [],
    };
    // 列表项
    this.columns = [{
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '类型',
      dataIndex: 'sortType',
      key: 'sortType',
    }, {
      title: '更改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.editModal.showEditModal(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteInfo(record.key)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.addMediaModal.showAddMediaModal(record)}>添加媒资</a>
        </span>
      )
    }];
  }
  componentDidMount() {
    this.getInfoList();
  }
  // 获取信息列表
  getInfoList = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/category/list`,
      method: 'post',
      data: {}
    })
    .then(res => {
      res = res.data;
      const dataArray = [];
      for (let i = 0; i < res.length; i += 1) {
        dataArray.push({
          key: `${res[i].categoryId}`,
          name: `${res[i].categoryName}`,
          sortType: `${res[i].type}`,
          updateTime: `${res[i].updateTime}`,
          priceStrategyId: `${res[i].priceStrategyId}`, // 价格策略
        });
      }
      this.setState({
        tableData: dataArray,
      });
    });
  };
  // 选择行
  selectOnChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }
  // 删除
  deleteInfo = (id) => {
    // console.log(id);
    confirm({
      title: '确认删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        Utils.request({
          url: `${window.PAY_API_HOST}/op/category/delete`,
          method: 'post',
          data: {
            ids: id
          }
        })
        .then(() => {
          this.getInfoList();
        })
        .catch(() => {
          Modal.error({
            title: '删除失败',
          });
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  render() {
    const { selectedRowKeys, tableData, } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.selectOnChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>媒资管理</Breadcrumb.Item>
          <Breadcrumb.Item>分类管理</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ height: 60, backgroundColor: '#fff', padding: '20px 20px 0px' }} >
          <Button type="primary" style={{ marginRight: 7 }} onClick={() => this.addModal.showAddModal()} >
            新建
          </Button>
          <Button type="primary" style={{ marginRight: 7 }} disabled={!hasSelected} onClick={() => this.deleteInfo(selectedRowKeys)} >
            删除
          </Button>
          <Button type="primary" style={{ marginRight: 7 }} disabled={!hasSelected} onClick={() => this.topping(selectedRowKeys)} >
            置顶
          </Button>
          <Button type="primary" style={{ marginRight: 7 }} disabled={!hasSelected} onClick={() => this.ending(selectedRowKeys)} >
            置底
          </Button>
        </div>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div>
            <Table
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={tableData}
              pagination={false}
            />
            <AddSort onRef={ref => { this.addModal = ref; }} onOK={() => this.getInfoList()} />
            <EditInfo onRef={(ref) => { this.editModal = ref; }} onOK={() => this.getInfoList()} />
            <AddMedia onRef={(ref) => { this.addMediaModal = ref; }} onOK={() => this.getInfoList()} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default libraryManage;
