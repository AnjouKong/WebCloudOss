import React, { Component } from 'react';
import { Layout, Breadcrumb, Divider, Modal, Button, Input, Table, Radio, message } from 'antd';
import Utils from '../../common/Utils';
import AddNode from './addNode';
import EditNode from './editNode';

const { Content } = Layout;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;

class nodeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeName: '',
      tableData: [],
      tableTotal: '',
      current: 1,
      orderShow: false,
      nodeId: '',
      nodeOrder: 'none',
    };
    this.columns = [{
      title: '节点id',
      dataIndex: 'nodeId',
      key: 'nodeId',
    }, {
      title: '节点名称',
      dataIndex: 'nodeName',
      key: 'nodeName',
    }, {
      title: '商户id',
      dataIndex: 'tenantId',
      key: 'tenantId',
    }, {
      title: '商户名称',
      dataIndex: 'tenantName',
      key: 'tenantName',
    }, {
    //   title: '内存大小',
    //   dataIndex: 'memory',
    //   key: 'memory',
    // }, {
    //   title: '硬盘大小',
    //   dataIndex: 'disk',
    //   key: 'disk',
    // }, {
    //   title: '带宽大小',
    //   dataIndex: 'bandWidth',
    //   key: 'bandWidth',
    // }, {
    //   title: '缓存区地址',
    //   dataIndex: 'cachePath',
    //   key: 'cachePath',
    // }, {
    //   title: '缓存区大小',
    //   dataIndex: 'cacheSize',
    //   key: 'cacheSize',
    // }, {
      title: '节点状态',
      dataIndex: 'nodeState',
      key: 'nodeState',
      render: nodeState => {
        const red = <span style={{ color: 'red' }}>离线</span>;
        const green = <span style={{ color: '#008B45' }}>在线</span>;
        return nodeState === '0' ? red : green;
      }
    }, {
      title: '监控开关',
      dataIndex: 'monitorSwitch',
      key: 'monitorSwitch',
      render: monitorSwitch => {
        const red = <span style={{ color: 'red' }}>关闭</span>;
        const green = <span style={{ color: '#008B45' }}>开启</span>;
        return monitorSwitch === 0 ? red : green;
      }
    }, {
      title: '监控策略',
      dataIndex: 'monitorScheduled',
      key: 'monitorScheduled',
    }, {
      title: '预下载开关',
      dataIndex: 'downloadSwitch',
      key: 'downloadSwitch',
      render: downloadSwitch => {
        const red = <span style={{ color: 'red' }}>关闭</span>;
        const green = <span style={{ color: '#008B45' }}>开启</span>;
        return downloadSwitch === 0 ? red : green;
      }
    }, {
      title: '预下载策略',
      dataIndex: 'mediaScheduled',
      key: 'mediaScheduled',
    }, {
      title: '预下载停止策略',
      dataIndex: 'mediaScheduledClose',
      key: 'mediaScheduledClose',
    // }, {
    //   title: '性能比率限制',
    //   dataIndex: 'rateLimit',
    //   key: 'rateLimit',
    // }, {
    //   title: '并发任务数量限制',
    //   dataIndex: 'maxTaskSize',
    //   key: 'maxTaskSize',
    // }, {
    //   title: '下载限速/秒',
    //   dataIndex: 'downloadSpeed',
    //   key: 'downloadSpeed',
    // }, {
    //   title: '默认下载ts片段个数',
    //   dataIndex: 'tsSize',
    //   key: 'tsSize',
    // }, {
    //   title: '代理地址',
    //   dataIndex: 'proxyUrl',
    //   key: 'proxyUrl',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (id, record) => (
        <span>
          <a onClick={() => this.orderModal(record.key)}>添加指令</a>
          <Divider type="vertical" />
          <a onClick={() => this.editModal.showEditModal(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteInfo(record.key)}>删除</a>
        </span>
      )
    }];
  }
  componentWillMount() {
    this.getNodeList('1', '10');
  }
  // 获取节点列表
  getNodeList = (page, size) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/node/page`,
      method: 'post',
      data: {
        name: this.state.nodeName,
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
          nodeId: `${resData[i].id}`,
          nodeName: `${resData[i].name}`,
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
    this.getNodeList(page, pageSize);
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
          url: `${window.PAY_API_HOST}/op/node/del`,
          method: 'post',
          data: {
            id,
          }
        })
        .then(() => {
          message.success('删除成功！');
          this.getNodeList(this.state.current, '10');
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
  nodeOnchange = (e) => {
    this.setState({
      nodeName: e.target.value,
    });
  }
  // 指令选择
  orderOnChange = (e) => {
    this.setState({
      nodeOrder: e.target.value,
    });
  }
  // 添加指令
  orderModal = (id) => {
    this.setState({
      orderShow: true,
      nodeId: id,
    });
  }
  // 添加指令
  modalOk = () => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/node/order`,
      method: 'post',
      data: {
        id: this.state.nodeId,
        order: this.state.nodeOrder,
      },
    })
    .then((res) => {
      if (res && res.success) {
        this.setState({
          orderShow: false,
          nodeOrder: 'none',
        });
        message.success('指令添加成功！');
      }
    })
    .catch((res) => {
      message.error(`${res.message}`);
    });
  };
  modalCancel = () => {
    this.setState({
      orderShow: false,
    });
  };
  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const { nodeName, tableData, tableTotal, current, orderShow, nodeOrder } = this.state;
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
          <Button type="primary" style={{ marginRight: 7 }} onClick={() => this.getNodeList(current, '10')} >
            刷新
          </Button>
          <div style={{ float: 'right' }}>
            <Input placeholder="节点名" value={nodeName} onChange={this.nodeOnchange} style={{ width: 130, marginRight: 7 }} />
            <Button type="primary" onClick={() => this.getNodeList('1', '10')}>筛选</Button>
          </div>
        </div>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <div>
            <Table
              columns={this.columns}
              dataSource={tableData}
              pagination={{ current, pageSize: 10, total: tableTotal, onChange: (this.pageOnChange) }}
            />
            <AddNode onRef={ref => { this.addModal = ref; }} onOK={() => this.getNodeList(current, '10')} />
            <EditNode onRef={(ref) => { this.editModal = ref; }} onOK={() => this.getNodeList(current, '10')} />
          </div>
          <Modal title="添加指令" visible={orderShow} onOk={this.modalOk} onCancel={this.modalCancel} width="500px" >
            <div style={{ overflow: 'hidden' }}>
              <span style={{ width: '100px', float: 'left', textAlign: 'right' }}>节点状态：</span>
              <RadioGroup style={{ width: '300px', float: 'left' }} value={nodeOrder} onChange={this.orderOnChange}>
                <Radio style={radioStyle} value="none">无任务</Radio>
                <Radio style={radioStyle} value="updateInfo">更新节点信息</Radio>
                <Radio style={radioStyle} value="report">上报节点监控</Radio>
                <Radio style={radioStyle} value="start">预下载开始</Radio>
                <Radio style={radioStyle} value="stop">预下载关闭</Radio>
              </RadioGroup>
            </div>
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default nodeList;
