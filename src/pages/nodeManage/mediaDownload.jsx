import React, { Component } from 'react';
import { Layout, Breadcrumb, Divider, Modal, Button, Input, Table, message, } from 'antd';
import Utils from '../../common/Utils';
import AddMedia from './addMedia';
import EditMedia from './editMedia';

const { Content } = Layout;
const confirm = Modal.confirm;

class nodeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaName: '',
      tableData: [],
      tableTotal: '',
      current: 1,
    };
    this.columns = [{
      title: '媒资Id',
      dataIndex: 'mediaId',
      key: 'mediaId',
    }, {
      title: '媒资名字',
      dataIndex: 'mediaName',
      key: 'mediaName',
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (id, record) => (
        <span>
          <a onClick={() => this.editModal.showEditModal(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteInfo(record.key)}>删除</a>
        </span>
      )
    }];
  }
  componentWillMount() {
    this.getMediaList('1', '10');
  }
  // 获取列表
  getMediaList = (page, size) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/node/media/page`,
      method: 'post',
      data: {
        mediaName: this.state.mediaName,
        page,
        size,
      }
    })
    .then(res => {
      const resData = res.data;
      const dataArray = [];
      for (let i = 0; i < resData.length; i += 1) {
        dataArray.push({
          key: `${resData[i].id}`,
          mediaId: `${resData[i].mediaId}`,
          mediaName: `${resData[i].mediaName}`,
          updateTime: `${resData[i].updateTime}`,
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
    this.getMediaList(page, pageSize);
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
          url: `${window.PAY_API_HOST}/op/node/media/del`,
          method: 'post',
          data: {
            id,
          }
        })
        .then(() => {
          message.success('删除成功！');
          this.getMediaList(this.state.current, '10');
        })
        .catch(() => {
          message.error('删除失败');
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  // 名字
  mediaOnchange = (e) => {
    this.setState({
      mediaName: e.target.value,
    });
  }
  render() {
    const { mediaName, tableData, tableTotal, current, } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>节点管理</Breadcrumb.Item>
          <Breadcrumb.Item>节点列表</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ height: 60, backgroundColor: '#fff', padding: '20px 20px 0px' }} >
          <Button type="primary" style={{ marginRight: 7 }} onClick={() => this.addModal.showAddModal()} >
            新建
          </Button>
          <div style={{ float: 'right' }}>
            <Input placeholder="媒资名" value={mediaName} onChange={this.mediaOnchange} style={{ width: 130, marginRight: 7 }} />
            <Button type="primary" onClick={() => this.getMediaList('1', '10')}>筛选</Button>
          </div>
        </div>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div>
            <Table
              columns={this.columns}
              dataSource={tableData}
              pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
            <AddMedia onRef={ref => { this.addModal = ref; }} onOK={() => this.getMediaList(current, '10')} />
            <EditMedia onRef={(ref) => { this.editModal = ref; }} onOK={() => this.getMediaList(current, '10')} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default nodeList;
