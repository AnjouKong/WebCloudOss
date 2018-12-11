import React, { Component } from 'react';
import { Layout, Breadcrumb, Table, Divider, Button, Modal, Input, } from 'antd';
import Utils from '../../common/Utils';
import AddTopic from './topicModal/addTopic';
import EditInfo from './topicModal/editInfo';

const { Content } = Layout;
const confirm = Modal.confirm;

class libraryManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      current: 1,
      tableData: [],
      tableTotal: '',
    };
    this.$filmName = '';
    // 列表项
    this.columns = [{
      title: '专题名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
    }, {
      title: '是否显示购买模块',
      dataIndex: 'showBuyButton',
      key: 'showBuyButton',
    }, {
      title: '购买模块名称',
      dataIndex: 'buyButtonName',
      key: 'buyButtonName',
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
        </span>
      )
    }];
  }
  componentDidMount() {
    this.getInfoList('1', '10');
  }
  // 获取信息列表
  getInfoList = (currentPage, pageSize) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/subject/page`,
      method: 'post',
      data: {
        name: this.$filmName.input.value,
        page: currentPage,
        size: pageSize
      }
    })
    .then(res => {
      res = res.data;
      const dataArray = [];
      for (let i = 0; i < res.length; i += 1) {
        dataArray.push({
          key: `${res[i].id}`,
          name: `${res[i].name}`,
          // describe: `${res[i].describe}`,
          showBuyButton: `${res[i].showBuyButton}` === '1' ? '是' : '否',
          buyButtonName: res[i].buyButtonName ? `${res[i].buyButtonName}` : '',
          updateTime: `${res[i].updateTime}`,
        });
      }
      this.setState({
        tableData: dataArray,
        tableTotal: res.totalRows,
      });
    });
  };
  // 列表翻页
  pageOnChange = (page, pageSize) => {
    this.setState({
      current: page,
      selectedRowKeys: [],
    });
    this.getInfoList(page, pageSize);
  }
  // 选择行
  selectOnChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }
  // 删除
  deleteInfo = (id) => {
    console.log(id);
    confirm({
      title: '确认删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        Utils.request({
          url: `${window.PAY_API_HOST}/op/subject/delete`,
          method: 'post',
          data: {
            ids: id
          }
        })
        .then(() => {
          this.getInfoList(this.state.current, '10');
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
    const { selectedRowKeys, tableData, tableTotal, current, } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.selectOnChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>媒资管理</Breadcrumb.Item>
          <Breadcrumb.Item>专题管理</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ height: 60, backgroundColor: '#fff', padding: '20px 20px 0px' }} >
          <Button type="primary" style={{ marginRight: 7 }} onClick={() => this.addModal.showAddModal()} >
            新建
          </Button>
          <Button type="primary" style={{ marginRight: 7 }} disabled={!hasSelected} onClick={() => this.deleteInfo(selectedRowKeys)} >
            删除
          </Button>
          <div style={{ float: 'right' }}>
            <Input ref={ref => { this.$filmName = ref; }} placeholder="专题名称" style={{ width: 130, marginRight: 7 }} />
            <Button type="primary" onClick={() => this.getInfoList('1', '10')}>筛选</Button>
          </div>
        </div>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div>
            <Table
              rowSelection={rowSelection}
              columns={this.columns}
              dataSource={tableData}
              pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
            <AddTopic onRef={ref => { this.addModal = ref; }} onOK={() => this.getInfoList(current, '10')} />
            <EditInfo onRef={(ref) => { this.editModal = ref; }} onOK={() => this.getInfoList(current, '10')} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default libraryManage;
