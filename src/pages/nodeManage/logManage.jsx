import React, { Component } from 'react';
import { Layout, Breadcrumb, Tabs, Table, Button, Input, DatePicker, } from 'antd';
import Utils from '../../common/Utils';
// import AddMedia from './addMedia';
// import EditMedia from './editMedia';

const { Content } = Layout;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

class nodeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 节点状态
      nodeStateId: '',
      tenantStateId: '',
      stateTableData: [],
      stateTableTotal: '',
      stateCurrent: 1,
      // 节点日志
      nodeId: '',
      tenantId: '',
      logTableData: [],
      logTableTotal: '',
      logCurrent: 1,
      // 预下载
      mediaNodeId: '',
      mediaTenantId: '',
      mediaTableData: [],
      mediaTableTotal: '',
      mediaCurrent: 1,
    };
    this.stateStartDay = '';
    this.stateEndDay = '';
    this.nodeStartDay = '';
    this.nodeEndDay = '';
    this.mediaStartDay = '';
    this.mediaEndDay = '';
    this.stateColumns = [{
      title: '节点Id',
      dataIndex: 'nodeId',
      key: 'nodeId',
    }, {
      title: '商户Id',
      dataIndex: 'tenantId',
      key: 'tenantId',
    }, {
      title: '节点状态',
      dataIndex: 'nodeState',
      key: 'nodeState',
    }, {
      title: '开始时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }];
    this.logColumns = [{
      title: '节点名称',
      dataIndex: 'nodeName',
      key: 'nodeName',
    }, {
      title: '节点Id',
      dataIndex: 'nodeId',
      key: 'nodeId',
    }, {
      title: '商户Id',
      dataIndex: 'tenantId',
      key: 'tenantId',
    }, {
      title: '运行内存剩余量',
      dataIndex: 'memorySpace',
      key: 'memorySpace',
    }, {
      title: '缓存区文件夹',
      dataIndex: 'diskSpace',
      key: 'diskSpace',
    }, {
      title: '下载限速/秒',
      dataIndex: 'downloadSpeed',
      key: 'downloadSpeed',
    }, {
      title: 'CPU',
      dataIndex: 'cpuRate',
      key: 'cpuRate',
    }, {
      title: '开始时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }];
    this.mediaColumns = [{
      title: '节点名称',
      dataIndex: 'nodeName',
      key: 'nodeName',
    }, {
      title: '节点Id',
      dataIndex: 'nodeId',
      key: 'nodeId',
    }, {
      title: '商户Id',
      dataIndex: 'tenantId',
      key: 'tenantId',
    }, {
      title: '总数',
      dataIndex: 'total',
      key: 'total',
    }, {
      title: '成功总数',
      dataIndex: 'totalSuccess',
      key: 'totalSuccess',
    }, {
      title: '失败总数',
      dataIndex: 'totalFail',
      key: 'totalFail',
    }, {
      title: '部分',
      dataIndex: 'partial',
      key: 'partial',
    }, {
      title: '成功部分',
      dataIndex: 'partialSuccess',
      key: 'partialSuccess',
    }, {
      title: '失败部分',
      dataIndex: 'partialFail',
      key: 'partialFail',
    }, {
      title: '开始时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    }];
  }
  componentWillMount() {
    this.getStateList('1', '10');
  }
  // 获取节点状态
  getStateList = (page, size) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/node/log/state`,
      method: 'post',
      data: {
        nodeId: this.state.nodeStateId,
        tenantId: this.state.tenantStateId,
        minTime: this.stateStartDay,
        maxTime: this.stateEndDay,
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
          nodeId: `${resData[i].nodeId}`,
          tenantId: `${resData[i].tenantId}`,
          nodeState: `${resData[i].nodeState}`,
          createTime: `${resData[i].createTime}`,
        });
      }
      this.setState({
        stateTableData: dataArray,
        stateTableTotal: res.totalRows,
      });
    });
  };
  // 获取节点日志
  getNodeList = (page, size) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/node/log`,
      method: 'post',
      data: {
        nodeId: this.state.nodeId,
        tenantId: this.state.tenantId,
        minTime: this.nodeStartDay,
        maxTime: this.nodeEndDay,
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
          nodeName: `${resData[i].name}`,
          nodeId: `${resData[i].nodeId}`,
          tenantId: `${resData[i].tenantId}`,
          memorySpace: `${resData[i].memorySpace}`,
          diskSpace: `${resData[i].diskSpace}`,
          downloadSpeed: `${resData[i].downloadSpeed}`,
          cpuRate: `${resData[i].cpuRate}`,
          createTime: `${resData[i].createTime}`,
        });
      }
      this.setState({
        logTableData: dataArray,
        logTableTotal: res.totalRows,
      });
    });
  };
  // 获取预下载日志
  getMediaList = (page, size) => {
    Utils.request({
      url: `${window.PAY_API_HOST}/op/node/log/media`,
      method: 'post',
      data: {
        nodeId: this.state.mediaNodeId,
        tenantId: this.state.mediaTenantId,
        minTime: this.mediaStartDay,
        maxTime: this.mediaEndDay,
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
          nodeName: `${resData[i].name}`,
          nodeId: `${resData[i].nodeId}`,
          tenantId: `${resData[i].tenantId}`,
          total: `${resData[i].total}`,
          totalSuccess: `${resData[i].totalSuccess}`,
          totalFail: `${resData[i].totalFail}`,
          partial: `${resData[i].partial}`,
          partialSuccess: `${resData[i].partialSuccess}`,
          partialFail: `${resData[i].partialFail}`,
          createTime: `${resData[i].createTime}`,
          remark: `${resData[i].remark}`,
        });
      }
      this.setState({
        mediaTableData: dataArray,
        mediaTableTotal: res.totalRows,
      });
    });
  };
  // 状态翻页
  stateOnChange = (page, pageSize) => {
    this.setState({
      stateCurrent: page,
    });
    this.getStateList(page, pageSize);
  }
  // 节点翻页
  logOnChange = (page, pageSize) => {
    this.setState({
      logCurrent: page,
    });
    this.getNodeList(page, pageSize);
  }
  // 预下载翻页
  mediaOnChange = (page, pageSize) => {
    this.setState({
      mediaCurrent: page,
    });
    this.getMediaList(page, pageSize);
  }
  // 状态
  nodeStateOnchange = (e) => {
    this.setState({
      nodeStateId: e.target.value,
    });
  }
  tenantStateOnchange = (e) => {
    this.setState({
      tenantStateId: e.target.value,
    });
  }
  stateDateOnChange = (moment, dateString) => {
    console.log(dateString);
    if (dateString[0] === '') {
      this.stateStartDay = '';
      this.stateEndDay = '';
    } else {
      this.stateStartDay = moment[0].format('YYYY-MM-DD HH:mm:ss');
      this.stateEndDay = moment[1].format('YYYY-MM-DD HH:mm:ss');
    }
  }
  // 节点
  nodeOnchange = (e) => {
    this.setState({
      nodeId: e.target.value,
    });
  }
  tenantOnchange = (e) => {
    this.setState({
      tenantId: e.target.value,
    });
  }
  dateOnChange = (moment, dateString) => {
    console.log(dateString);
    if (dateString[0] === '') {
      this.nodeStartDay = '';
      this.nodeEndDay = '';
    } else {
      this.nodeStartDay = moment[0].format('YYYY-MM-DD HH:mm:ss');
      this.nodeEndDay = moment[1].format('YYYY-MM-DD HH:mm:ss');
    }
  }
  // 预下载
  mediaNodeOnchange = (e) => {
    this.setState({
      mediaNodeId: e.target.value,
    });
  }
  mediaTenantOnchange = (e) => {
    this.setState({
      mediaTenantId: e.target.value,
    });
  }
  mediaDateOnChange = (moment, dateString) => {
    console.log(dateString);
    if (dateString[0] === '') {
      this.mediaStartDay = '';
      this.mediaEndDay = '';
    } else {
      this.mediaStartDay = moment[0].format('YYYY-MM-DD HH:mm:ss');
      this.mediaEndDay = moment[1].format('YYYY-MM-DD HH:mm:ss');
    }
  }
  callback = (key) => {
    console.log(key);
    switch (key) {
      case 'nodeState':
        this.getStateList(this.state.stateCurrent, '10');
        break;
      case 'nodeLog':
        this.getNodeList(this.state.logCurrent, '10');
        break;
      case 'media':
        this.getMediaList(this.state.mediaCurrent, '10');
        break;
      default:
        this.getStateList(this.state.stateCurrent, '10');
        break;
    }
  }
  render() {
    const { nodeId, tenantId, logTableData, logTableTotal, logCurrent,
      mediaNodeId, mediaTenantId, mediaTableData, mediaTableTotal, mediaCurrent,
      nodeStateId, tenantStateId, stateTableData, stateCurrent, stateTableTotal } = this.state;
    return (
      <Layout>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>节点管理</Breadcrumb.Item>
          <Breadcrumb.Item>日志管理</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
          <Tabs defaultActiveKey="nodeState" onChange={this.callback}>
            <TabPane tab="节点状态" key="nodeState">
              <div style={{ height: 60, backgroundColor: '#fff', padding: '20px 20px 0px' }} >
                <Input placeholder="节点ID" value={nodeStateId} onChange={this.nodeStateOnchange} style={{ width: 130, marginRight: 7 }} />
                <Input placeholder="商户ID" value={tenantStateId} onChange={this.tenantStateOnchange} style={{ width: 130, marginRight: 7 }} />
                <RangePicker
                  showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['开始时间', '结束时间']}
                  onChange={this.stateDateOnChange} style={{ marginRight: 7 }}
                />
                <Button type="primary" onClick={() => this.getStateList('1', '10')}>筛选</Button>
              </div>
              <Table
                columns={this.stateColumns}
                dataSource={stateTableData}
                pagination={{ stateCurrent, pageSize: 10, total: stateTableTotal, onChange: (this.stateOnChange) }}
              />
            </TabPane>
            <TabPane tab="节点日志" key="nodeLog">
              <div style={{ height: 60, backgroundColor: '#fff', padding: '20px 20px 0px' }} >
                <Input placeholder="节点ID" value={nodeId} onChange={this.nodeOnchange} style={{ width: 130, marginRight: 7 }} />
                <Input placeholder="商户ID" value={tenantId} onChange={this.tenantOnchange} style={{ width: 130, marginRight: 7 }} />
                <RangePicker
                  showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['开始时间', '结束时间']}
                  onChange={this.dateOnChange} style={{ marginRight: 7 }}
                />
                <Button type="primary" onClick={() => this.getNodeList('1', '10')}>筛选</Button>
              </div>
              <Table
                columns={this.logColumns}
                dataSource={logTableData}
                pagination={{ logCurrent, pageSize: 10, total: logTableTotal, onChange: (this.logOnChange) }}
              />
            </TabPane>
            <TabPane tab="预下载日志" key="media">
              <div style={{ height: 60, backgroundColor: '#fff', padding: '20px 20px 0px' }} >
                <Input placeholder="节点ID" value={mediaNodeId} onChange={this.mediaNodeOnchange} style={{ width: 130, marginRight: 7 }} />
                <Input placeholder="商户ID" value={mediaTenantId} onChange={this.mediaTenantOnchange} style={{ width: 130, marginRight: 7 }} />
                <RangePicker
                  showTime format="YYYY-MM-DD HH:mm:ss" placeholder={['开始时间', '结束时间']}
                  onChange={this.mediaDateOnChange} style={{ marginRight: 7 }}
                />
                <Button type="primary" onClick={() => this.getMediaList('1', '10')}>筛选</Button>
              </div>
              <Table
                columns={this.mediaColumns}
                dataSource={mediaTableData}
                pagination={{ mediaCurrent, pageSize: 10, total: mediaTableTotal, onChange: (this.mediaOnChange) }}
              />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    );
  }
}

export default nodeList;
